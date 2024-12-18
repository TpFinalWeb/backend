import express from 'express';
import { config } from './config/config';
import http from 'http';
import https from 'https';
import connectToDb from './utils/mongodb.utils';
import app from './app';
import fs from 'fs';
import path from 'path';

const port = config.port!;
const serverHttp = config.serverHttp!;

if(serveurHttp){
  http.createServer(app).listen(port, () => {
    connectToDb();
    console.log(`Serveur en écoute sur <http://localhost>:${port}`);
  })
}else{
  https.createServer(app).listen(port, () => {
    connectToDb();
    console.log(`Serveur en écoute sur <http://localhost>:${port}`);
  })
}
