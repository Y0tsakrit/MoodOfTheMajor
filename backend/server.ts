import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './src/routes/auth.routes';
import indexRoutes from './src/routes/index.routes';
import profileRoutes from './src/routes/profile.route';

const app = express();


app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/', indexRoutes);

app.listen(8443, () => {
    console.log('Server running on port 8443');
});