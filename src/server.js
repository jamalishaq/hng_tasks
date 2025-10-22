const https = require("https");
const fs = require("fs");
const app = require("./app");
const dotenv = require("dotenv");
const { createTable } = require("./repositories/string.repository");
const db = require("./connectDB");
dotenv.config();

const startServer = () => {
  const privateKey = fs.readFileSync("./server.key");
  const certificate = fs.readFileSync("./server.cert");
  const credentials = { key: privateKey, cert: certificate };

  const server = https.createServer(credentials, app);

  db.on("error", (err) => {
    console.error("Error opening database:", err.message);
    process.exit(1);
  });

  db.on("open", () => {
    createTable();

    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      console.log(`Server running and listening on port ${PORT}`);
    });
  });
};

startServer();
