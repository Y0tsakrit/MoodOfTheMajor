import { createPost, updatePost } from "../controller/postManage.controller";
import express from "express";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/create',verifyToken, createPost);
router.put('/update/:postId',verifyToken, updatePost);


export default router;