import api from '../../utils/api';


export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password },{ withCredentials: false });
        return response.data;
    } catch (error) {
        throw error;
    }
}