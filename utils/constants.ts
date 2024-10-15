import { Role } from '../models/user-model';

const CONSTANTS = {
    REDIS: {
        CACHE_EXPIRY: 60 * 60, // In seconds
        PRODUCT_KEY: 'product',
        PRODUCT_FILTER_SET_KEY: 'product_filter_set'
    },
    ROLES: {
        ADMIN: Role.ADMIN,
        USER: Role.USER
    },
    JWT: {
        EXPIRY: '1h'
    },
    HEADERS: {
        EMAIL: 'x-email',
        ROLE: 'x-role',
        IAT: 'x-iat',
        EXP: 'x-exp'
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_PAGESIZE: 10
    }
};

export { CONSTANTS }
