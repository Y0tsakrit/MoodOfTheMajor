import api from "../../utils/api";
import type { SearchProfileDTO } from "../../interface/searchProfileDTO";
import type { SearchPostDTO } from "../../interface/searchPostDTO";

export const getProfile = async (criteria: SearchProfileDTO = {}, token: string) => {
  try {
    const config: any = { params: criteria };

    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get("/profile/search", config);
    return response.data;
  } catch (error) {
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

export const getDepartments = async (params: any, token: string) => {
    try {
        const config: any = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params,
        };
        const response = await api.get("/department/search", config);
        return response.data;
    } catch (error) {
        throw error;
    }
}
