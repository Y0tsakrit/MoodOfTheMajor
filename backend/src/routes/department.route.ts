import { Router } from 'express';
import { getDepartment } from '../controller/departmentManage.controller';

const router = Router();

router.get('/search', getDepartment);

export default router;