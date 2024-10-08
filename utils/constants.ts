import { Role } from "../models/user-model";

const CONSTANTS = {
    REDIS: {
        CACHE_EXPIRY: 60 * 60, // In seconds
    },
    MESSAGE: {
        SUCCESS: 'Success',
        UNEXPECTED_ERROR: 'Internal server error',
        MISSING_TOKEN: 'Missing token',
        INVALID_TOKEN: 'Invalid token',
        ADMIN_ONLY: 'Admin access only'
    },
    ROLE: {
        ADMIN: Role.ADMIN,
        USER: Role.USER
    },
    JWT: {
        EXPIRY: '1h'
    }
};

export { CONSTANTS }
