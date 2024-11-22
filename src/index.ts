const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur <http://localhost>:${port}`);
});