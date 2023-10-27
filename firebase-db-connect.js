// [START firestore_deps]
const { initializeApp, cert } = require('firebase-admin/app');

async function initializeDBConnection() {
  const serviceAccount = require('./secret-key.json');

  initializeApp({
    credential: cert(serviceAccount)
  }); 
}


// [END initialize_app_service_account]
module.exports = { initializeDBConnection };