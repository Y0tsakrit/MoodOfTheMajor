export interface PostSearchCriteria {
    "id"?: string;
    "title"?: string;
    "content"?: string;
    "authorId"?: string;
    "mood"?: string;
    "isAnonymous"?: boolean;
    "page"?: number;
    "limit"?: number;
    "fromDate"?: string | Date;
    "toDate"?: string | Date;
}