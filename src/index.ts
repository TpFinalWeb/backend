import express from 'express';
import { config } from './config/config';
import https from 'https';
import connectToDb from './utils/mongodb.utils';
import app from './app';
import fs from 'fs';
import path from 'path';

const port = config.port!;

const keyPath = '/etc/secrets/key.pem';
const certPath = '/etc/secrets/cert.pem';

try {
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Key file not found at ${keyPath}`);
  }
  if (!fs.existsSync(certPath)) {
    throw new Error(`Cert file not found at ${certPath}`);
  }

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(options, app).listen(port, () => {
    connectToDb();
    console.log(`Server is listening on https://localhost:${port}`);
  });

} catch (error) {
  console.error('Error starting server:', error.message);
}
