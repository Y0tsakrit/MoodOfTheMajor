export interface SearchPostDTO {
    id?: string;
    title?: string;
    content?: string;
    authorId?: string;
    mood?: string;
    isAnonymous?: boolean;
    page?: number;
    limit?: number;
}