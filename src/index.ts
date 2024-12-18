import express from 'express';
import { config } from './config/config';
import https from 'https';
import connectToDb from './utils/mongodb.utils';
import app from './app';
import fs from 'fs';
import path from 'path';

// Use the PORT environment variable that Render provides, or fallback to 3005
const port = process.env.PORT || 3005;  // Let Render define the port

console.log("Starting the server...");
console.log(`Server is running on port: ${port}`);

let options;
try {
  // Reading SSL certificates, ensure the files are present
  options = {
    key: fs.readFileSync('/etc/secrets/key.pem'),
    cert: fs.readFileSync('/etc/secrets/cert.pem'),
  };
} catch (err) {
  console.error("Error reading SSL certificates:", err.message);
  process.exit(1);  // Exit the process if certificates cannot be loaded
}

// Ensure the server is set up to listen on all network interfaces
https.createServer(options, app).listen(port, '0.0.0.0', () => {
  // Attempt to connect to the database
  connectToDb()
    .then(() => {
      console.log(`Server is live on https://0.0.0.0:${port}`);
    })
    .catch((dbError) => {
      console.error("Failed to connect to MongoDB:", dbError.message);
      process.exit(1);  // Exit the process if the DB connection fails
    });
});
