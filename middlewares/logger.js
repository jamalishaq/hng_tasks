const logEvents = require("../utils/logEvents");

const logger = (req, res, next) => {
    logEvents("reqLog.txt", `Method: ${req.method} | URL: ${req.url}`);
    next();
}

module.exports = logger;