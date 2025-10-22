const { mkdir, appendFile } = require("fs/promises");
const { existsSync } = require("fs");
const { join } = require("path");

const logEvents = async (logFileName, message) => {
    const logsDirectory = join(__dirname, '..', '..', 'logs');
    const logItem = `Timestamp: ${new Date().toISOString()} | ${message} \n`

    try {
        if (!existsSync(logsDirectory)) {
            await mkdir(logsDirectory);
        }
    
        await appendFile(join(logsDirectory, logFileName), logItem);
        
    } catch (err) {
        console.error(err);
    }
}

module.exports = logEvents;