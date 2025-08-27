// server.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Resolve cert paths relative to this file to avoid CWD issues
const sslDir = path.resolve(__dirname, 'ssl');
const keyPath = path.join(sslDir, 'key.pem');
const certPath = path.join(sslDir, 'cert.pem');

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

// Ensure certs exist (fail fast with helpful message)
if (!fileExists(keyPath) || !fileExists(certPath)) {
  console.error(
    '\n[SSL ERROR] Missing certificate files.\n' +
    `Expected:\n  ${keyPath}\n  ${certPath}\n\n` +
    'Generate them with:\n' +
    '  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\\n' +
    '    -keyout ssl/key.pem -out ssl/cert.pem \\\n' +
    '    -config ssl/openssl.cnf -extensions v3_req\n'
  );
  process.exit(1);
}

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  // For local self-signed, you can add:
  // requestCert: false,
  // rejectUnauthorized: false, // NEVER use this in production
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`✅ PulseVote API over HTTPS: https://localhost:${PORT}`);
});
