export interface ProfileSearchCriteria {
    "id"?: string | null;
    "firstName"?: string | null;
    "lastName"?: string | null;
    "departmentId"?: string | null;
    "year"?: string | null;
    "page"?: number | 1;
    "limit"?: number | 10;
}