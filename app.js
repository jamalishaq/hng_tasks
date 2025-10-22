const express = require("express");
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const cors = require("cors");
const app = express();
const YAML = require("yamljs");
const swaggerUI = require("swagger-ui-express");

const swaggerDocument = YAML.load("./openapi.yaml")

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(router);

app.use(errorHandler);

module.exports = app;