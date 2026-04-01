// Netlify ビルド時に firebase-config.local.js を環境変数から生成するスクリプト
// Netlify ダッシュボード → Site configuration → Environment variables に以下を設定してください:
//   FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL,
//   FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID

const fs = require('fs');

const required = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing environment variables:', missing.join(', '));
  process.exit(1);
}

const content = `window.__FIREBASE_CONFIG__ = {
  apiKey:            "${process.env.FIREBASE_API_KEY}",
  authDomain:        "${process.env.FIREBASE_AUTH_DOMAIN}",
  databaseURL:       "${process.env.FIREBASE_DATABASE_URL}",
  projectId:         "${process.env.FIREBASE_PROJECT_ID}",
  storageBucket:     "${process.env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
  appId:             "${process.env.FIREBASE_APP_ID}",
  measurementId:     "${process.env.FIREBASE_MEASUREMENT_ID || ''}",
};
`;

fs.writeFileSync('firebase-config.local.js', content);
console.log('firebase-config.local.js generated successfully.');
