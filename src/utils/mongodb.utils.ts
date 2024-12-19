import mongoose from "mongoose";
import { config } from "../config/config";


// Connect to MongoDB
const connectToDb = async () => {
    try {
        const dbUri = config.nodeEnv?.trim() === 'test' ? config.mongo_uri_test : config.mongo_uri_dev;
        await mongoose.connect(dbUri!).then(() => {
            console.log('Connected to MongoDB');
        });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB:'));
        db.once('open', () => {
            console.log('Connexion à MongoDB réussie');
        });
    }
    catch (error) {
        console.log('Error connecting to MongoDB', error);
    };
}

export function closeMongoConnectionTest() {
    mongoose.connection.close()
  }

export default connectToDb;