interface PaginationMetadata {
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
}

interface CacheMetadata {
    isFromCache: boolean;
}

type Metadata = PaginationMetadata & CacheMetadata;

export { PaginationMetadata, CacheMetadata, Metadata };
