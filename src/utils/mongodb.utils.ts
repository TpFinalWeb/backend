import mongoose from "mongoose";
import { config } from "../config/config";




const connectToDb = async () => {
    try {
        await mongoose.connect(config.mongo_uri!).then(() => {
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

export default connectToDb;