const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        // Log the error and exit the application immediately if the connection fails
        console.error("Error opening database:", err.message);
        process.exit(1);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

module.exports = db;