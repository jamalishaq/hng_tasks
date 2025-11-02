import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
dotenv.config({ silent: true });

const connectionConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
};

const pool = mysql.createPool(connectionConfig)

const db = drizzle({ client: pool });

export default db;