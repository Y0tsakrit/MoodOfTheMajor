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
    console.error("Error fetching profile:", error);
    throw error;
  }
};