
import 'dotenv/config';

const isRender = Boolean(process.env.RENDER);

export const dbConfig = {
  ...(process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isRender ? { rejectUnauthorized: false } : undefined
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'flimhall',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
      }),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
};
