import express from "express";
import cors from "cors";
import logger from "./middlewares/logger";
import errorHandler from "./middlewares/errorHandler";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import router from "./routes";

const swaggerDocument = YAML.load("./openapi.yaml");
const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(logger);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1", router);

app.use(errorHandler);

export default app;