interface Filter {
    selectFields?: string[];
    filterFields?: FilterField[];
    pagination: Pagination;
    sorts?: Sort[];
}

interface FilterField {
    field: string;
    operator: 'equals' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains';
    value: string | number | boolean | null;
}

interface Pagination {
    page: number;
    pageSize: number;
}

interface Sort {
    field: string;
    order: string;
}

export { Filter };
