import express from 'express';
import { config } from './config/config';
import https from 'https';
import http from 'http';
import connectToDb from './utils/mongodb.utils';
import app from './app';
import fs from 'fs';

const port = config.port!;

const options = {
  key: fs.readFileSync('/etc/secrets/key.pem'),
  cert: fs.readFileSync('/etc/secrets/cert.pem')
};

http.createServer(app).listen(port, () => {
  connectToDb();
  console.log(`Serveur en écoute sur <https://localhost>:${port}`);
})