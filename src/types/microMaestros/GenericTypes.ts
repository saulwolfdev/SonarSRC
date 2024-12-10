export interface IdOption {
    id: number;
    label: string;
}

export interface PaginatedRequest{
    pageNumber?:number
    pageSize?:number
}

export interface PaginacionAPI {
    totalCount: number
    pageNumber: number
    pageSize: number
    totalPages: number
}