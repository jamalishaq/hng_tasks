import express from "express";
import { 
    refreshCountries, 
    getAllCountries, 
    getCountryByName, 
    deleteCountryByName, 
    getStatus, 
    getSummaryImage 
} from "../controllers/controller.js";

const router = express.Router();

// Countries routes
router.post("/countries/refresh", refreshCountries);
router.get("/countries", getAllCountries);
router.get("/status", getStatus);
router.get("/countries/image", getSummaryImage);
router.get("/countries/:name", getCountryByName);
router.delete("/countries/:name", deleteCountryByName);

export default router;