import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './src/routes/auth.routes';
import indexRoutes from './src/routes/index.routes';
import profileRoutes from './src/routes/profile.route';
import departmentRoutes from './src/routes/department.route';
import postRoutes from './src/routes/post.route';

const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());


app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/department', departmentRoutes);

app.use('/post', postRoutes);


const PORT = process.env.PORT || 8443;
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});