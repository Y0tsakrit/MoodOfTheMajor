import { postRepository } from "../Repository/post.repository";
import { userRepository } from "../Repository/user.repository";
import { TokenData } from "../interface/token.interface";
import { PostCreateDTO } from "../interface/createPostDTO.interface";
import { PostCreateCriteria } from "../interface/postCreateCriteria.interface";
import jsonwebtoken from "jsonwebtoken";
import { UserCreateCriteria } from "../interface/userCreateCriteria.interface";

export default class PostManagementService {
    private postRepository;
    private userRepository;

    constructor() {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    async createPost(token: string, postData: PostCreateDTO) {
        const tokenData: TokenData = extractDataFromToken(token);

        const payload: PostCreateCriteria = {
            ...postData,
            authorId: tokenData.userId
        };

        try {
            const newPost = await this.postRepository.CreatePost(payload);
            return newPost;
        } catch (error) {
            throw new Error('Failed to create post');
        }
    }

    async updatePost(token: string, postId: string, postData: PostCreateDTO) {
        const tokenData: TokenData = extractDataFromToken(token);

        const existingPost = await this.postRepository.SearchByCriteria({ id: postId });
        if (existingPost.length === 0 || !existingPost[0]) {
            throw new Error('Post not found');
        }

        await this.verifyOwenerOrAdmin(tokenData, postId);

        const payload: PostCreateCriteria = {
            ...postData,
            authorId: existingPost[0].authorId,
            UpdatedAt: new Date()
        };

        try {
            const updatedPost = await this.postRepository.UpdatePost(postId, payload);
            return updatedPost;
        } catch (error) {
            throw new Error('Failed to update post');
        }
    }

    async deletePost(token: string, postId: string) {
        const tokenData: TokenData = extractDataFromToken(token);

        const existingPost = await this.postRepository.SearchByCriteria({ id: postId });
        if (existingPost.length === 0 || !existingPost[0]) {
            throw new Error('Post not found');
        }

        await this.verifyOwenerOrAdmin(tokenData, postId);

        try {
            await this.postRepository.DeletePost(postId);
            return { message: 'Post deleted successfully' };
        } catch (error) {
            throw new Error('Failed to delete post');
        }
    }

    async verifyOwenerOrAdmin(tokenData: TokenData, postId: string) {

        try {
            const post = await this.postRepository.SearchByCriteria({ id: postId });
            if (post.length === 0 || !post[0]) {
                throw new Error('Post not found');
            }

            if (post[0].authorId !== tokenData.userId) {
                const user = await this.userRepository.SearchByCriteria({ id: tokenData.userId });

                if (user[0]?.isAdmin !== true) {
                    throw new Error('Unauthorized to update this post');
                }
            }
        }catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : 'Failed to verify ownership or admin rights');
        }
    }

}

const extractDataFromToken = (token: string) => {
    try {
        const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET as string);
        return decodedToken as TokenData;
    }catch (error) {
        throw new Error('Invalid token');
    }
}