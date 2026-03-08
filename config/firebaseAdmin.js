import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let app;

function getFirebaseAdmin() {
  if (app) return app;

  const projectId = process.env.FIREBASE_PROJECT_ID || 'edulumix-9c6d7';
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (admin.apps.length > 0) {
    app = admin.app();
    return app;
  }

  let credential;

  if (credentials) {
    try {
      const serviceAccount = JSON.parse(credentials);
      credential = admin.credential.cert(serviceAccount);
    } catch (e) {
      console.error('Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON:', e.message);
      throw new Error('Invalid Firebase credentials');
    }
  } else if (credentialsPath && existsSync(credentialsPath)) {
    const serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf8'));
    credential = admin.credential.cert(serviceAccount);
  } else {
    const defaultPath = path.join(__dirname, 'edulumix-service-account.json');
    if (existsSync(defaultPath)) {
      const serviceAccount = JSON.parse(readFileSync(defaultPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } else {
      throw new Error('Firebase Auth requires: config/edulumix-service-account.json, GOOGLE_APPLICATION_CREDENTIALS, or GOOGLE_APPLICATION_CREDENTIALS_JSON');
    }
  }

  app = admin.initializeApp({ credential, projectId });
  return app;
}

export async function verifyFirebaseToken(idToken) {
  const adminApp = getFirebaseAdmin();
  const decoded = await adminApp.auth().verifyIdToken(idToken);
  return decoded;
}
