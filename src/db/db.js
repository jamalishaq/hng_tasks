import mysql from "mysql2/promise";

const connectionConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'test_db',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
};

let pool;

function getDbPool() {
    if (!pool) {
        pool = mysql.createPool(connectionConfig);
    }
    return pool;
}

export default getDbPool;
