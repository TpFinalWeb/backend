import express from 'express';
import { config } from './config/config';
import https from 'https';
import connectToDb from './utils/mongodb.utils';
import app from './app';
import fs from 'fs';
import path from 'path';

// Use the PORT environment variable or fallback to config.port or 3005 for local testing
const port = Number(process.env.PORT) || Number(config.port) || 3005;  // Convert to number

console.log("hey");
console.log(`Using port: ${port}`);

const options = {
  key: fs.readFileSync('/etc/secrets/key.pem'),
  cert: fs.readFileSync('/etc/secrets/cert.pem'),
};

// Bind to 0.0.0.0 to ensure it works on Render's platform
https.createServer(options, app).listen(port, '0.0.0.0', () => {  // Binding to 0.0.0.0
  connectToDb();
  console.log(`Serveur en écoute sur https://localhost:${port}`);
});
