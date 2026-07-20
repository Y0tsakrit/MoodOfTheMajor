import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

import authRoutes from './src/routes/auth.routes';
import indexRoutes from './src/routes/index.routes';
import profileRoutes from './src/routes/profile.route';
import departmentRoutes from './src/routes/department.route';
import postRoutes from './src/routes/post.route';

const app = express();
app.set('trust proxy', 1);


app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigin = process.env.FRONTEND_URL;
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS restrictions'));
        }
    },
    credentials: true
}));


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 100, 
    standardHeaders: 'draft-7', 
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' },
});

app.use(express.json());
app.use(globalLimiter);

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/department', departmentRoutes);

app.use('/post', postRoutes);


const PORT = process.env.PORT || 8443;
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});