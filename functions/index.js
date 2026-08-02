const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { defineSecret } = require('firebase-functions/params');

const razorpayKeyId = defineSecret('RAZORPAY_KEY_ID');
const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET');

initializeApp();
const db = getFirestore();



// Reads a single size entry regardless of legacy format.
function normalizeSizeEntry(raw) {
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    return trimmed ? { size: trimmed, stock: null } : null;
  }
  if (raw && typeof raw === 'object' && typeof raw.size === 'string' && raw.size.trim()) {
    const stockNum = Number(raw.stock);
    return { size: raw.size.trim(), stock: Number.isFinite(stockNum) ? stockNum : null };
  }
  return null;
}

exports.placeOrder = onCall({ region: 'asia-south1', secrets: [razorpayKeyId, razorpayKeySecret] }, async (request) => {
  const uid = request.auth?.uid ?? null;

  const { items, customer } = request.data || {};

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpsError('invalid-argument', 'Cart is empty.');
  }
  if (
    !customer ||
    !customer.name || !customer.phone || !customer.email ||
    !customer.address1 || !customer.city || !customer.state || !customer.pincode
  ) {
    throw new HttpsError('invalid-argument', 'Missing delivery details.');
  }
  for (const item of items) {
    if (!item.productId || !item.size || !Number.isInteger(Number(item.qty)) || Number(item.qty) < 1) {
      throw new HttpsError('invalid-argument', 'Invalid item in cart.');
    }
  }

  const result = await db.runTransaction(async (tx) => {
    const uniqueProductIds = [...new Set(items.map((i) => i.productId))];
    const productDocs = new Map();

    for (const productId of uniqueProductIds) {
      const ref = db.collection('products').doc(productId);
      const snap = await tx.get(ref);
      if (!snap.exists) {
        throw new HttpsError('not-found', `A product in your cart no longer exists (${productId}). Please remove it and try again.`);
      }
      productDocs.set(productId, { ref, data: JSON.parse(JSON.stringify(snap.data())) });
    }

    let total = 0;
    const verifiedItems = [];

    for (const item of items) {
      const quantity = Number(item.qty);
      const { data: product } = productDocs.get(item.productId);

      let realPrice;
      let sizesArr;
      let colorObj = null;

      if (Array.isArray(product.colors) && product.colors.length > 0) {
        colorObj = product.colors.find((c) => c.name === item.colorName);
        if (!colorObj) {
          throw new HttpsError('failed-precondition', `"${item.colorName}" is no longer available for ${product.name}.`);
        }
        realPrice = Number(colorObj.price) > 0 ? Number(colorObj.price) : Number(product.price);
        sizesArr = Array.isArray(colorObj.sizes) ? colorObj.sizes : [];
      } else {
        realPrice = Number(product.price);
        sizesArr = Array.isArray(product.sizes) ? product.sizes : [];
      }

      if (!Number.isFinite(realPrice) || realPrice <= 0) {
        throw new HttpsError('failed-precondition', `${product.name} has an invalid price and cannot be ordered right now.`);
      }

      const sizeIndex = sizesArr.findIndex((s) => {
        const n = normalizeSizeEntry(s);
        return n && n.size === item.size;
      });
      if (sizeIndex === -1) {
        throw new HttpsError('failed-precondition', `Size "${item.size}" is no longer available for ${product.name}.`);
      }

      const normalized = normalizeSizeEntry(sizesArr[sizeIndex]);

      if (normalized.stock !== null) {
        if (normalized.stock < quantity) {
          const label = item.colorName ? `${item.size}, ${item.colorName}` : item.size;
          throw new HttpsError('resource-exhausted', `Only ${normalized.stock} left for ${product.name} (${label}). Please reduce the quantity.`);
        }
        sizesArr[sizeIndex] = { ...sizesArr[sizeIndex], size: normalized.size, stock: normalized.stock - quantity };
      }

      const lineTotal = realPrice * quantity;
      total += lineTotal;

      verifiedItems.push({
        productId: item.productId,
        name: product.name,
        price: realPrice,
        quantity,
        size: item.size,
        color: item.colorName || null,
        image: (colorObj?.images?.[0]) || product.images?.[0] || null,
        lineTotal,
      });
    }


    const orderRef = db.collection('orders').doc();
    tx.set(orderRef, {
      userId: uid,
      customer,
      items: verifiedItems,
      total,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',          // NEW
      orderStatus: 'pending_payment',    // CHANGED from 'placed'
      createdAt: FieldValue.serverTimestamp(),
    });

    return { orderId: orderRef.id, total };
  });

  // ── Create the Razorpay order (must happen outside the Firestore transaction) ──
  let razorpayOrder;
  try {
    const razorpay = new Razorpay({
  key_id: razorpayKeyId.value(),
  key_secret: razorpayKeySecret.value(),
});
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(result.total * 100), // Razorpay wants paise, not rupees
      currency: 'INR',
      receipt: result.orderId,
    });
  } catch (err) {
    await db.collection('orders').doc(result.orderId).update({
      orderStatus: 'failed',
      paymentStatus: 'failed',
    });
    throw new HttpsError('internal', 'Could not initiate payment. Please try again.');
  }

  await db.collection('orders').doc(result.orderId).update({
    razorpayOrderId: razorpayOrder.id,
  });

  return {
    orderId: result.orderId,
    total: result.total,
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: razorpayKeyId.value(),
  };
});

// ── Runs after Razorpay confirms payment succeeded on the frontend ──
exports.verifyPayment = onCall({ region: 'asia-south1', secrets: [razorpayKeySecret] }, async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError('unauthenticated', 'Must be logged in to verify payment.');
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = request.data || {};

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new HttpsError('invalid-argument', 'Missing payment verification details.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret.value())
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await db.collection('orders').doc(orderId).update({
      paymentStatus: 'failed',
      orderStatus: 'failed',
    });
    throw new HttpsError('permission-denied', 'Payment verification failed.');
  }

  // Signature confirmed — now decrement stock and mark the order paid,
  // all inside one transaction so it only ever happens once per order.
  await db.runTransaction(async (tx) => {
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) {
      throw new HttpsError('not-found', 'Order not found.');
    }
    const order = orderSnap.data();

    // Idempotency guard — if this order was already marked paid before,
    // don't decrement stock a second time.
    if (order.paymentStatus === 'paid') {
      return;
    }

    const uniqueProductIds = [...new Set(order.items.map((i) => i.productId))];
    const productDocs = new Map();

    for (const productId of uniqueProductIds) {
      const ref = db.collection('products').doc(productId);
      const snap = await tx.get(ref);
      if (snap.exists) {
        productDocs.set(productId, { ref, data: JSON.parse(JSON.stringify(snap.data())) });
      }
    }

    for (const item of order.items) {
      const entry = productDocs.get(item.productId);
      if (!entry) continue;
      const { data: product } = entry;

      let sizesArr = null;
      if (item.color && Array.isArray(product.colors)) {
        const colorObj = product.colors.find((c) => c.name === item.color);
        if (colorObj && Array.isArray(colorObj.sizes)) sizesArr = colorObj.sizes;
      } else if (Array.isArray(product.sizes)) {
        sizesArr = product.sizes;
      }
      if (!sizesArr) continue;

      const sizeIndex = sizesArr.findIndex((s) => {
        const n = normalizeSizeEntry(s);
        return n && n.size === item.size;
      });
      if (sizeIndex === -1) continue;

      const normalized = normalizeSizeEntry(sizesArr[sizeIndex]);
      if (normalized.stock !== null) {
        const newStock = Math.max(0, normalized.stock - item.quantity);
        sizesArr[sizeIndex] = { ...sizesArr[sizeIndex], size: normalized.size, stock: newStock };
      }
    }

    for (const productId of uniqueProductIds) {
      const entry = productDocs.get(productId);
      if (!entry) continue;
      const { ref, data: product } = entry;
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        tx.update(ref, { colors: product.colors });
      } else if (Array.isArray(product.sizes)) {
        tx.update(ref, { sizes: product.sizes });
      }
    }

    tx.update(orderRef, {
      paymentStatus: 'paid',
      orderStatus: 'placed',
      razorpayPaymentId: razorpay_payment_id,
    });
  });

  return { success: true };
});