import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

router.get('/health', (req, res) => {
    res.status(200).json({ message: 'service is healthy' });
});

export default router;