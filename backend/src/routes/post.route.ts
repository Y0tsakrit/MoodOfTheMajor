import { createPost, deletePost, updatePost } from "../controller/postManage.controller";
import express from "express";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/create',verifyToken, createPost);
router.put('/update/:postId',verifyToken, updatePost);
router.delete('/delete/:postId',verifyToken, deletePost);


export default router;