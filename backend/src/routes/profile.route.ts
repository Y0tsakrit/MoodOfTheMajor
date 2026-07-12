import {getProfile, updateProfile,} from '../controller/profileManage.controller';
import { Router } from 'express';
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.put('/:profileId', verifyToken, updateProfile);
router.get('/search', verifyToken, getProfile);

export default router;