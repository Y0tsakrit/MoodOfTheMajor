import api from "../../utils/api";
import type { SearchProfileDTO } from "../../interface/searchProfileDTO";

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


export const updateProfile = async (profileData: any, token: string) => {
    try {
        const config: any = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await api.put("/profile/update", profileData, config);
        return response.data;
    } catch (error) {
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