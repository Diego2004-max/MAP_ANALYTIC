/**
 * @file database.js
 * @description Database connection pool configuration
 */
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Carga obligatoria de las variables de entorno desde el archivo .env
dotenv.config();

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});