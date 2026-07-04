import {updateProfile} from '../controller/profileManage.controller';
import { Router } from 'express';

const router = Router();

router.put('/:profileId', updateProfile);

export default router;