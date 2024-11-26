import express from 'express';
import { config } from './config/config';
import connectToDb from './utils/mongodb';


const app = express();
const port = config.port!;

app.use(express.json());

// Démarrer le serveur
app.listen(port, () => {
  connectToDb();
  console.log(`Serveur en écoute sur <http://localhost>:${port}`);
});