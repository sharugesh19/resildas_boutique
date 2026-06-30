// scripts/setAdminClaim.js
//
// Sets (or removes) the "admin: true" custom claim on a Firebase user.
// Run this locally with Node — never deploy or expose this file.
//
// USAGE:
//   node scripts/setAdminClaim.js add maheswari.k1107@gmail.com
//   node scripts/setAdminClaim.js add clientemail@example.com
//   node scripts/setAdminClaim.js remove maheswari.k1107@gmail.com
//
// Requirements:
//   1. npm install firebase-admin   (run this once inside scripts/ or project root)
//   2. scripts/serviceAccountKey.json must exist (downloaded from Firebase Console)
//   3. The target email must already exist as a user in Firebase Authentication
//      (they must have signed up / logged in at least once on the site first)

const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount),
});

const admin = { auth: getAuth };

async function main() {
  const [, , action, email] = process.argv;

  if (!action || !email || !['add', 'remove'].includes(action)) {
    console.error('Usage:');
    console.error('  node scripts/setAdminClaim.js add <email>');
    console.error('  node scripts/setAdminClaim.js remove <email>');
    process.exit(1);
  }

  try {
    const user = await admin.auth().getUserByEmail(email);

    const isAdmin = action === 'add';
    await admin.auth().setCustomUserClaims(user.uid, { admin: isAdmin });

    console.log(`✅ Success: ${email} (uid: ${user.uid}) admin = ${isAdmin}`);
    console.log(
      `\nNOTE: ${email} must log out and log back in (or refresh their ID token) for this change to take effect in the app.`
    );
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.error(
        `❌ No user found with email "${email}". They must sign up / log in on the site at least once before you can grant them admin.`
      );
    } else {
      console.error('❌ Error:', err.message);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();