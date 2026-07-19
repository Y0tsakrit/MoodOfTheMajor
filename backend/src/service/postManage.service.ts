import { postRepository } from "../Repository/post.repository";
import { userRepository } from "../Repository/user.repository";
import { departmentRepository } from "../Repository/department.repository";
import { profileRepository } from "../Repository/profile.repository";
import { TokenData } from "../interface/token.interface";
import { PostCreateDTO } from "../interface/createPostDTO.interface";
import { PostCreateCriteria } from "../interface/postCreateCriteria.interface";
import { PostSearchCriteria } from "../interface/postSearchCriteria.interface";
import jsonwebtoken from "jsonwebtoken";

export default class PostManagementService {
    private postRepository;
    private userRepository;
    private departmentRepository;
    private profileRepository;

    constructor() {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.profileRepository = profileRepository;
    }

    async createPost(profileId: string, postData: PostCreateDTO) {
        const payload: PostCreateCriteria = {
            ...postData,
            authorId: profileId,
        };

        try {
            const newPost = await this.postRepository.CreatePost(payload);
            return newPost;
        } catch (error) {
            throw new Error('Failed to create post');
        }
    }

    async updatePost(tokenData: TokenData, postId: string, postData: PostCreateDTO) {

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

    async deletePost(tokenData: TokenData, postId: string) {

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

    async getPost(SearchCriteria: PostSearchCriteria) {
        try {
            const posts = await this.postRepository.SearchByCriteria(SearchCriteria);
            
            const totalPosts = posts.length;
            const isLastPage = SearchCriteria.page && SearchCriteria.limit ? (SearchCriteria.page * SearchCriteria.limit >= totalPosts) : (1 * 10 >= totalPosts);
            
            if (posts.length === 0) {
                return { 
                    data: [], 
                    totalPosts, 
                    isLastPage
                };
            }

            const data = await Promise.all(
                posts.map(async (post) => {
    
                    const author = await this.fetchTheAuthorOfPost(post.authorId);
                    const department = await this.fetchTheDepartmentOfProfile(author.departmentId);

                    const authorData = {
                        firstName: post.isAnonymous ? 'Anonymous' : author.firstName,
                        lastName: post.isAnonymous ? '' : author.lastName,
                        year: author.year,
                    };
                    const facultyData = department.faculty;
                    const majorData = department.major;

                    return {
                        postId: post.id,
                        postTitle: post.title,
                        postContent: post.content,
                        postMood: post.mood,
                        author: authorData,
                        faculty: facultyData,
                        major: majorData,
                    };
                })
            );

            return {
                data,
                totalPosts,
                isLastPage
            };
        } catch (error) {
            throw new Error('Failed to fetch posts');
        }
    }

    async verifyOwenerOrAdmin(tokenData: TokenData, postId: string) {

        try {
            const post = await this.postRepository.SearchByCriteria({ id: postId });
            if (post.length === 0 || !post[0]) {
                throw new Error('Post not found');
            }

            if (post[0].authorId !== tokenData.profileId) {
                const user = await this.userRepository.SearchByCriteria({ profileId: tokenData.profileId });

                if (user[0]?.isAdmin !== true) {
                    throw new Error('Unauthorized to update this post');
                }
            }
        }catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : 'Failed to verify ownership or admin rights');
        }
    }

    async fetchTheAuthorOfPost(authorId: string) {
        try {
            const author = await this.profileRepository.SearchByCriteria({ id: authorId });
            if (author.length === 0 || !author[0]) {
                throw new Error('Author not found');
            }
            return author[0];
        } catch (error) {
            throw new Error('Failed to fetch author');
        }
    }

    async fetchTheDepartmentOfProfile(departmentId: string) {
        try {
            const department = await this.departmentRepository.SearchByCriteria({ id: departmentId });
            if (department.length === 0 || !department[0]) {
                throw new Error('Department not found');
            }
            return department[0];
        } catch (error) {
            throw new Error('Failed to fetch department');
        }
    }

}