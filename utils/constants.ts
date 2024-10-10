import { Role } from '../models/user-model';

const CONSTANTS = {
    REDIS: {
        CACHE_EXPIRY: 60 * 60, // In seconds
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
    }
};

export { CONSTANTS }
