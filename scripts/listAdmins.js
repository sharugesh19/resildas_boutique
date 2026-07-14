// scripts/listAdmins.js
//
// Lists every Firebase Authentication user and shows whether they have
// the "admin: true" custom claim — Firebase's own console UI has no way
// to display this, so this script is the only way to actually check.
//
// Run this locally with Node — never deploy or expose this file.
//
// USAGE:
//   node scripts/listAdmins.js
//
// Requirements (same as setAdminClaim.js):
//   1. npm install firebase-admin   (run this once inside scripts/ or project root)
//   2. scripts/serviceAccountKey.json must exist (downloaded from Firebase Console)

const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount),
});

const admin = { auth: getAuth };

async function listAllUsers(nextPageToken, allUsers = []) {
  const result = await admin.auth().listUsers(1000, nextPageToken);
  const combined = allUsers.concat(result.users);
  if (result.pageToken) {
    return listAllUsers(result.pageToken, combined);
  }
  return combined;
}

async function main() {
  const users = await listAllUsers();

  const admins = users.filter((u) => u.customClaims?.admin === true);
  const nonAdmins = users.filter((u) => !u.customClaims?.admin);

  console.log(`\n📋 Total users: ${users.length}\n`);

  console.log(`✅ ADMINS (${admins.length}):`);
  if (admins.length === 0) {
    console.log('  (none)');
  } else {
    admins.forEach((u) => {
      console.log(`  - ${u.email || '(no email)'}  (uid: ${u.uid})`);
    });
  }

  console.log(`\n⬜ NOT ADMIN (${nonAdmins.length}):`);
  if (nonAdmins.length === 0) {
    console.log('  (none)');
  } else {
    nonAdmins.forEach((u) => {
      console.log(`  - ${u.email || '(no email)'}`);
    });
  }

  console.log('');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});