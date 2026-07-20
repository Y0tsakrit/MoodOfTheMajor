export interface PostCreateCriteria {
    "title": string;
    "content": string;
    "mood": string;
    "authorId": string;
    "isAnonymous": boolean;
    "CreatedAt"?: Date;
    "UpdatedAt"?: Date;
}