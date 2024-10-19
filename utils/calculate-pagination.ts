const calculatePaginationMetadata = (totalRows: number, currentPage: number, pageSize: number) => {
    const totalPages = Math.ceil(totalRows / pageSize);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;

    return {
        totalPages,
        currentPage,
        nextPage,
        previousPage
    };
}

export { calculatePaginationMetadata };
