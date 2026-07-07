import postManageService from "../service/postManage.service";


const postService = new postManageService();

export const createPost = async (req: any, res: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    const postData = req.body;

    try {
        const newPost = await postService.createPost(token, postData);
        res.status(201).json(newPost);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
    
};

export const updatePost = async (req: any, res: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    const postId = req.params.postId;
    const postData = req.body;

    try {
        const updatedPost = await postService.updatePost(token, postId, postData);
        res.status(200).json(updatedPost);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
};

export const deletePost = async (req: any, res: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    const postId = req.params.postId;

    try {
        const result = await postService.deletePost(token, postId);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
};

export const getPost = async (req: any, res: any) => {
    const searchCriteria = req.query;
    try {
        const posts = await postService.getPost(searchCriteria);
        res.status(200).json(posts);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
};