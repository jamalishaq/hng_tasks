import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
    MYSQL_PORT
} = process.env;
const DATABASE_URL = `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`;

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.js',
   dbCredentials: {
    url: DATABASE_URL,
  },
})
