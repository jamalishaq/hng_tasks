import { 
    refreshCountriesRepository, 
    getAllCountriesRepository, 
    getCountryByNameRepository, 
    deleteCountryByNameRepository, 
    getStatusRepository, 
    getCountriesImageRepository 
} from "../repositories/repositories.js";

// POST /countries/refresh service
export const refreshCountriesService = async () => {
    try {
        const result = await refreshCountriesRepository();
        return result;
    } catch (error) {
        throw error;
    }
};

// GET /countries service
export const getAllCountriesService = async () => {
    try {
        const result = await getAllCountriesRepository();
        return result;
    } catch (error) {
        throw error;
    }
};

// GET /countries/:name service
export const getCountryByNameService = async (name) => {
    try {
        const result = await getCountryByNameRepository(name);
        return result;
    } catch (error) {
        throw error;
    }
};

// DELETE /countries/:name service
export const deleteCountryByNameService = async (name) => {
    try {
        const result = await deleteCountryByNameRepository(name);
        return result;
    } catch (error) {
        throw error;
    }
};

// GET /status service
export const getStatusService = async () => {
    try {
        const result = await getStatusRepository();
        return result;
    } catch (error) {
        throw error;
    }
};

// GET /countries/image service
export const getCountriesImageService = async () => {
    try {
        const result = await getCountriesImageRepository();
        return result;
    } catch (error) {
        throw error;
    }
};
