import getDbPool from "../db/db.js";    
const db = getDbPool();

// POST /countries/refresh repository
export const refreshCountriesRepository = async () => {
    try {
        const result = await db.query("SELECT * FROM countries");
        return result;
    } catch (error) {
        throw error;
    }
    return {};
};

// GET /countries repository
export const getAllCountriesRepository = async () => {
    try {
        const result = await db.query("SELECT * FROM countries");
        return result;
    } catch (error) {
        throw error;
    }
    return {};
};

// GET /countries/:name repository
export const getCountryByNameRepository = async (name) => {
    try {
        const result = await db.query("SELECT * FROM countries WHERE name = ?", [name]);
        return result;
    } catch (error) {
        throw error;
    }
    return {};
};

// DELETE /countries/:name repository
export const deleteCountryByNameRepository = async (name) => {
    try {
        const result = await db.query("DELETE FROM countries WHERE name = ?", [name]);
        return result;
    } catch (error) {
        throw error;
    }
    return {};
};

// GET /status repository
export const getStatusRepository = async () => {
    try {
        const result = await db.query("SELECT * FROM status");
        return result;
    } catch (error) {
        throw error;
    }
    return {};
};

// GET /countries/image repository
export const getCountriesImageRepository = async () => {
        try {
        const result = await db.query("SELECT * FROM countries_image");
        return result;
    } catch (error) {
        throw error;
    }
    return {};
};
