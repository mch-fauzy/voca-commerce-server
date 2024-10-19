interface Metadata {
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    isFromCache: boolean;
}

export { Metadata };
