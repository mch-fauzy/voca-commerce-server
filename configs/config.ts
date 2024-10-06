const CONFIG = {
    SERVER: {
        PORT: process.env.SERVER_PORT,
        ENV: process.env.SERVER_ENV,
    },
    APP: {
        URL: process.env.APP_URL,
        DOCS: process.env.APP_DOCS,
        JWT_ACCESS_KEY: process.env.APP_JWT_ACCESS_KEY,
    },
    DB: {
        URL: process.env.DATABASE_URL,
    },
    REDIS: {
        URL: process.env.REDIS_URL
    }
};

export { CONFIG };
