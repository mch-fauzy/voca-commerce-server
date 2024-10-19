import { Role } from '../models/user-model';

const CONSTANTS = {
    REDIS: {
        CACHE_EXPIRY: 60 * 60, // In seconds
        PRODUCT_KEY: 'product',
        PRODUCT_SET_KEY: 'product_set'
    },
    ROLES: {
        ADMIN: Role.ADMIN,
        USER: Role.USER
    },
    JWT: {
        EXPIRY: 60 * 60
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
    },
    SERVER: {
        DEFAULT_PORT: 3000
    }
};

export { CONSTANTS }
