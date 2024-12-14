import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './utils/swagger.utils';
import userRoutes from './routes/user.route';

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:3005', 'https://localhost:4000'],
}



app.use(cors(corsOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());


app.use('/', userRoutes);


export default app;