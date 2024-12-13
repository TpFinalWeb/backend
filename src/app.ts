import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './utils/swagger.utils';
import userRoutes from './routes/user.route';
import gameRoutes from './routes/game.route';
import helmet from 'helmet';

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:3005']
}



app.use(cors(corsOptions));
app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());


app.use('/', userRoutes);
app.use('/games', gameRoutes);


export default app;