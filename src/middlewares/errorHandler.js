import { logEvents } from "../utils/workers.js";
import mysql from "mysql2";

const errorHandler = (err, req, res, next) => {
  // const message = err instanceof mysql.SqlError ? "Internal server error" : err.message;
  // const details = err instanceof mysql.SqlError ? "Somehing went wrong" : err.details;
  // const statusCode = err instanceof mysql.SqlError ? 500 : err.statusCode;
  logEvents(
    "errLog.txt",
    `statusCode: ${500} | message: ${err.message} | details: ${err.details}`
  );

  return res.status(500).json({
      message: err.message,
      details: err.details,
    });
};

export default errorHandler;

