import dotenv from "dotenv";
import app from "./src/app.js";
import db from "./src/db/connectDB.js";
dotenv.config({ silent: true });

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const [rows] = await db.execute("SELECT VERSION() AS version;");

    if (rows && rows.length > 0) {
      const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });

      return server;
    } else {
      console.error(
        "❌ Connection failed: No version returned from the server."
      );
    }
  } catch (error) {
    console.error("❌ Database connection FAILED!");
    console.error("Error details:", error.message);
    process.exit(1); // Exit with a non-zero code to indicate failure
  }
}

startServer();
