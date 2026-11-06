import pg from 'pg';
import { dbConfig } from './config/database.js';

const { Pool } = pg;

const pool = new Pool(dbConfig);

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error);
});

export default pool;
