export interface UpdateProfileDTO {
    firstName?: string;
    lastName?: string;
    department?:{
        faculty?: string;
        major?: string;
    };
    year?: string;
}