/**
 * @file database.js
 * @description 
 */
import pkg from 'pg';
const { Pool } = pkg;

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});