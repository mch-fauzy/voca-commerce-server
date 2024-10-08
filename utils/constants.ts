import { Role } from "../models/user-model";

const CONSTANTS = {
    REDIS: {
        CACHE_EXPIRY: 60 * 60, // In seconds
    },
    MESSAGE: {
        SUCCESS: 'Success',
        UNEXPECTED_ERROR: 'Internal Server Error'
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
