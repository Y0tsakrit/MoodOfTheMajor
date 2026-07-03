export interface ProfileCreateCriteria {
    "firstName": string,
    "lastName": string;
    "departmentId": string;
    "year": string;
    "createdAt"?: Date | null;
    "updatedAt"?: Date| null;
}