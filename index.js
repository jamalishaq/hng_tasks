import dotenv from "dotenv";
import app from "./src/app.js";
import getDbPool from "./src/db/db.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

function startServer() {
    // Try establishing a DB connection first
    getDbPool().getConnection().then(connection => {
        connection.release(); // Release connection back to pool
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        return server;
    }).catch((error) => {
        console.error("Failed to connect to the MySQL database:", error);
        process.exit(1);
    });
}

startServer();