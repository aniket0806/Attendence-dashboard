import { createPool } from "mysql2/promise";
import { config } from 'dotenv';
// Load environment variables from .env file
config();
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
  connectionLimit: 5, // Keep this LOW for db4free.net
  queueLimit: 0

});

export default pool;