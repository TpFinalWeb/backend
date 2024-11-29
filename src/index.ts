import express from 'express';
import { config } from './config/config';
import connectToDb from './utils/mongodb';
import app from './app';

const port = config.port!;


// Démarrer le serveur
app.listen(port, () => {
  connectToDb();
  console.log(`Serveur en écoute sur <http://localhost>:${port}`);
});