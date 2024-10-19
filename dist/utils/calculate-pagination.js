"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePaginationMetadata = void 0;
const calculatePaginationMetadata = (totalRows, currentPage, pageSize) => {
    const totalPages = Math.ceil(totalRows / pageSize);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    return {
        totalPages,
        currentPage,
        nextPage,
        previousPage
    };
};
exports.calculatePaginationMetadata = calculatePaginationMetadata;
