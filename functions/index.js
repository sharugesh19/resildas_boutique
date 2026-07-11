const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

// Reads a single size entry regardless of legacy format.
// Old products: sizes = ["S", "M", "L"]  (no stock info at all)
// New products: sizes = [{ size: "S", stock: 10 }, ...]
// Returns { size, stock } where stock is null if untracked (legacy string format).
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

exports.placeOrder = onCall({ region: 'asia-south1' }, async (request) => {
  // CHANGED: guest checkout allowed — uid is null for unauthenticated users.
  // (Login is still required for /wishlist via ProtectedRoute elsewhere in the app.)
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
    // ── PASS 1: read every unique product doc first (Firestore requires all reads before writes) ──
    const uniqueProductIds = [...new Set(items.map((i) => i.productId))];
    const productDocs = new Map(); // productId -> mutable working copy of the doc data

    for (const productId of uniqueProductIds) {
      const ref = db.collection('products').doc(productId);
      const snap = await tx.get(ref);
      if (!snap.exists) {
        throw new HttpsError('not-found', `A product in your cart no longer exists (${productId}). Please remove it and try again.`);
      }
      productDocs.set(productId, { ref, data: JSON.parse(JSON.stringify(snap.data())) });
    }

    // ── PASS 2: resolve real price + stock for each cart line, mutating the in-memory copies ──
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
        // Tracked stock — enforce and decrement.
        if (normalized.stock < quantity) {
          const label = item.colorName ? `${item.size}, ${item.colorName}` : item.size;
          throw new HttpsError('resource-exhausted', `Only ${normalized.stock} left for ${product.name} (${label}). Please reduce the quantity.`);
        }
        sizesArr[sizeIndex] = { ...sizesArr[sizeIndex], size: normalized.size, stock: normalized.stock - quantity };
      }
      // else: legacy untracked size (plain string, no stock field yet) — sale allowed, no decrement possible.

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

    // ── PASS 3: write back updated stock for every product touched, once each ──
    for (const productId of uniqueProductIds) {
      const { ref, data: product } = productDocs.get(productId);
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        tx.update(ref, { colors: product.colors });
      } else if (Array.isArray(product.sizes)) {
        tx.update(ref, { sizes: product.sizes });
      }
    }

    // ── Write the order itself ──
    const orderRef = db.collection('orders').doc();
    tx.set(orderRef, {
      userId: uid, // null for guest orders
      customer,
      items: verifiedItems,
      total,
      paymentMethod: 'prepaid', // placeholder — will be replaced once Razorpay is wired in
      orderStatus: 'placed',
      createdAt: FieldValue.serverTimestamp(),
    });

    return { orderId: orderRef.id, total };
  });

  return result;
});