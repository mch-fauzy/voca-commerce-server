interface Filter {
    filterFields: FilterField[];
    pagination: Pagination;
    sorts: Sort[];

}

interface FilterField {
    field: string;
    operator: 'equals' | 'not' | 'in' | 'notIn' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'search';
    value: string | number | boolean | null;
}

interface Pagination {
    page: number;
    pageSize: number;
}

interface Sort {
    field: string;
    order: 'asc' | 'desc'
}

export { Filter }