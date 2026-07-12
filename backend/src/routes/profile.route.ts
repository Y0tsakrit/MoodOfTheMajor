import {getProfile, updateProfile,} from '../controller/profileManage.controller';
import { Router } from 'express';

const router = Router();

router.put('/:profileId', updateProfile);
router.get('/search', getProfile);

export default router;