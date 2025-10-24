import { 
    refreshCountriesService, 
    getAllCountriesService, 
    getCountryByNameService, 
    deleteCountryByNameService, 
    getStatusService, 
    getCountriesImageService 
} from "../services/services.js";

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
    try {
        const result = await getAllCountriesService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// GET /countries/:name
export const getCountryByName = async (req, res, next) => {
    try {
        const { name } = req.params;
        const result = await getCountryByNameService(name);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// DELETE /countries/:name
export const deleteCountryByName = async (req, res, next) => {
    try {
        const { name } = req.params;
        const result = await deleteCountryByNameService(name);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// GET /status
export const getStatus = async (req, res, next) => {
    try {
        const result = await getStatusService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// GET /countries/image
export const getCountriesImage = async (req, res, next) => {
    try {
        const result = await getCountriesImageService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
