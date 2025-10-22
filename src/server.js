const app = require("./app");
const dotenv = require("dotenv");
const { createTable } = require("./repositories/string.repository");
const db = require("./connectDB");
dotenv.config();

const startServer = () => {

  db.on("error", (err) => {
    console.error("Error opening database:", err.message);
    process.exit(1);
  });

  db.on("open", () => {
    createTable();

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running and listening on port ${PORT}`);
    });
  });
};

startServer();
