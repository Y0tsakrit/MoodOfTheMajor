import 'dotenv/config';
import express from 'express';
import authRoutes from './src/routes/auth.routes';
import cors from 'cors';
import indexRoutes from './src/routes/index.routes';

const app = express();


app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes);
app.use('/', indexRoutes);

app.listen(8443, () => {
    console.log('Server running on port 8443');
});