import mysql from "mysql2";
import {
  refreshCountriesService,
  getAllCountriesService,
  getCountryByNameService,
  deleteCountryByNameService,
  getStatusService,
  getSummaryImageService,
} from "../services/services.js";
import { getLastRefreshTime } from "../utils/workers.js";

// POST /countries/refresh
export const refreshCountries = async (req, res, next) => {
  try {
    const result = await refreshCountriesService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET /countries
export const getAllCountries = async (req, res, next) => {
  const query = req.query;
  try {
    const result = await getAllCountriesService(query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET /countries/:name
export const getCountryByName = async (req, res, next) => {
  const { name } = req.params;

  try {
    const result = await getCountryByNameService(name);
    res.status(200).json(result[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE /countries/:name
export const deleteCountryByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const result = await deleteCountryByNameService(name);
    res.status(200).json({ status: "success", message: `${name} deleted`});
  } catch (error) {
    next(error);
  }
};

// GET /status
export const getStatus = async (req, res, next) => {
  try {
    const result = await getStatusService();
    console.log(result)
    res
      .status(200)
      .json({ total_countries: result[0].total_countries, last_refreshed_at: await getLastRefreshTime() });
  } catch (error) {
    next(error);
  }
};

// GET /countries/image
export const getSummaryImage = async (req, res, next) => {
  try {
    const result = await getSummaryImageService();

    if (result) {
      res.setHeader("Content-Type", "image/png");
      res.status(200).send(result);
    } else {
      res.status(404).send("Image not found.");
    }
  } catch (error) {
    next(error);
  }
};
