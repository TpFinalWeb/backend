import express from 'express';
import { config } from './config/config';
import https from 'https';
import http from 'http';
import connectToDb from './utils/mongodb.utils';
import app from './app';
import fs from 'fs';

const port = config.port!;
const serverHttp = config.serverHttp!;

if(serverHttp=="true"){
  http.createServer(app).listen(port, () => {
    connectToDb();
    console.log(`Serveur en écoute sur <http://localhost:${port}>`);
  })
}else{
  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
  https.createServer(options,app).listen(port, () => {
    connectToDb();
    console.log(`Serveur en écoute sur <https://localhost:${port}>`);
  })
}