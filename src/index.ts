import express from 'express';
import { config } from './config/config';
import https from 'https';
import connectToDb from './utils/mongodb.utils';
import app from './app';
import fs from 'fs';
import path from 'path';

const port = config.port!;
console.log("hey")
console.log(port)

const options = {
  key: fs.readFileSync('/etc/secrets/key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(port, () => {
  connectToDb();
  console.log(`Serveur en écoute sur <https://localhost>:${port}`);
})
