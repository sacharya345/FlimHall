import 'dotenv/config';

const isRender = Boolean(process.env.RENDER);
const useSSL = isRender || process.env.DB_SSL === 'true';

export const dbConfig = {
  ...(process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'flimhall',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
      }),

  ssl: useSSL ? { rejectUnauthorized: true } : false,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
};