import axios from "axios";
import type { RegisterDTO } from "../../interface/registerDTO";

export const getFaculties = async () => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_URL_API}/department/search`);
        let faculties = response.data.map((faculty: any) => ({
            value: faculty.faculty,
            label: faculty.faculty,
        })).filter((item: any, index: number, self: any[]) => 
            index === self.findIndex((t) => t.label === item.label)
        );
        return faculties;
    }  catch (error) {
        throw error;
    }
}

export const getMajors = async (faculty: string) => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_URL_API}/department/search?faculty=${faculty}`);
        let majors = response.data.map((major: any) => ({
            value: major.major,
            label: major.major,
        }))
        return majors;
    }  catch (error) {
        throw error;
    }
}

export const registerUser = async (data: RegisterDTO) => {
    const payload = {
        email: data.email,
        password: data.password,
        profileData: {
            firstName: data.firstName,
            lastName: data.lastName,
            faculty: data.faculty,
            departmentName: data.major,
            year: String(data.yearOfStudy),
        }
    }
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_API}/auth/register`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}