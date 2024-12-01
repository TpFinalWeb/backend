import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route';

const app = express();

const corsOptions = {
    // maybe make port secret or sum
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));
app.use(express.json());


app.use('/', userRoutes);


export default app;