export interface UserCreateDTO {
    "email": string;
    "password": string;
    "profileData": {
        "firstName": string;
        "lastName": string;
        "faculty": string;
        "departmentName": string;
        "year": string;
    };
}