const fsPromise = require("fs").promises;
const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
dotenv.config();
const cors = require("cors");
const app = express();
// Load the YAML file
const swaggerDocument = YAML.load('./openapi.yaml');

// Serve the documentation on a dedicated route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const corsOptions = {
  origin: "*",
  methods: ["GET"],
};

const limiter = rateLimit({
  windowMs: +process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 100000);

app.use(cors(corsOptions));
app.use(limiter);

app.get("/me", async (req, res) => {
  const timestamp = new Date().toISOString();
  try {
    const response = await fetch("https://catfact.ninja/fact", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal, 
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { fact } = await response.json();
    const responseData = {
      status: "success",
      user: {
        email: "toyinjamal@gmail.com",
        name: "Jamal Ishaq",
        stack: "Nodejs/Express",
      },
      timestamp,
      fact,
    };

    logRequestDetails(req, timestamp, "Successful /me request");
    res.status(200).json(responseData);
  } catch (error) {
    if (error.name === 'AbortError') {
        logRequestDetails(req, timestamp, error.message);
        return res.status(504).json({
            status: "error",
            message: "Upstream request timed out",
        });
    }

    clearTimeout(timeoutId);
    logRequestDetails(req, timestamp, error.message);
    return res.status(502).json({
      status: "error",
      message: "Bad gateway / upstream fetch failure",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

function logRequestDetails(req, timestamp, message) {
  const logData = `Timestamp: ${timestamp}, IP: ${
    req.ip
  }, User-Agent: ${req.get("User-Agent")}, Message: ${message}\n`;
  fsPromise
    .appendFile("logs.txt", logData)
    .catch((err) => console.error("Error writing to log file", err));
}
