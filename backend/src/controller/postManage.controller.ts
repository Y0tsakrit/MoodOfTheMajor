import postManageService from "../service/postManage.service";


const postService = new postManageService();

export const createPost = async (req: any, res: any) => {
    const profileId = req.user?.profileId;
    const postData = req.body;

    try {
        const newPost = await postService.createPost(profileId, postData);
        res.status(201).json(newPost);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
    
};

export const updatePost = async (req: any, res: any) => {
    const tokenData = req.user; 
    const postId = req.params.postId;
    const postData = req.body;

    try {
        const updatedPost = await postService.updatePost(tokenData, postId, postData);
        res.status(200).json(updatedPost);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: message });
    }
};

export const deletePost = async (req: any, res: any) => {
    const tokenData = req.user;
    const postId = req.params.postId;

    try {
        const result = await postService.deletePost(tokenData, postId);
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