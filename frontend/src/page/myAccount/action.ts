import api from "../../utils/api";
import type { SearchProfileDTO } from "../../interface/searchProfileDTO";
import type { SearchPostDTO } from "../../interface/searchPostDTO";
import type { CreatePostDTO } from "../../interface/createPostDTO";

export const getProfile = async (criteria: SearchProfileDTO = {}, token: string) => {
  try {
    const config: any = { params: criteria };

    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get("/profile/search", config);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};


export const getPost = async (criteria: SearchPostDTO, token: string) => {
  try {
    const config: any = { params: criteria };

    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get("/post/search", config);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};


export const createPost = async (postData: CreatePostDTO, token: string) => {
  try{
    const config: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.post("/post/create", postData, config);
    return response.data;
  }catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }

}

export const deletePost = async (postId: string, token: string) => {
  try {
    const config: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.delete(`/post/delete/${postId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const updatePost = async (postId: string, postData: Partial<CreatePostDTO>, token: string) => {
  try {
    const config: any = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.put(`/post/update/${postId}`, postData, config);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
