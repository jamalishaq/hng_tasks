const db = require("../connectDB");
const { InternalServerError, NotFoundError } = require("../utils/AppError");

const createTable = () => {
  const sql = `
        CREATE TABLE IF NOT EXISTS strings (
            id TEXT PRIMARY KEY, 
            
            value TEXT NOT NULL, 
            
            properties JSON, 
            
            created_at TEXT 
        );
    `;
  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating table "strings":', err.message);
    } else {
      console.log('Table "strings" ensured/created.');
    }
  });
};

const insertString = ({ id, value, properties, created_at }) => {
  const sqlInsert = `INSERT INTO strings (id, value, properties, created_at) VALUES (?, ?, ?, ?);`;
  const sqlFetch = `SELECT * FROM strings where id = ?;`;

  return new Promise((resolve, reject) => {
    db.run(sqlInsert, [id, value, JSON.stringify(properties), created_at], (err) => {
      if (err) {
        const serverError = new InternalServerError({
          details: "Error saving data",
          message: err.message,
        });
        reject(serverError);
      } else {
        db.get(sqlFetch, [id], (err, row) => {
          if (err) {
            const serverError = new InternalServerError({
              details: "Error saving data",
              message: err.message,
            });
            reject(serverError);
          } else {
            if (row) {
              resolve({
                ...row,
                properties: JSON.parse(row.properties)
              })
            } else {
              resolve(row);
            }
          }
        });
      }
    });
  });
};

const deleteString = async (value) => {
  const sql = `DELETE FROM strings WHERE value = ?;`;

  return new Promise((resolve, reject) => {
    db.run(sql, [value], (err) => {
      if (err) {
        const serverError = new InternalServerError({
          details: "Error deleting data",
          message: err.message,
        });
        reject(serverError);
      } else {
        resolve();
      }
    });
  }); 
};

const fetchStrings = ({
  is_palindrome = "",
  min_length = "",
  max_length = "",
  word_count = "",
  contains_character = "",
} = {}) => {
  let sql = "SELECT * FROM strings";
  const conditions = [];
  const params = [];

  if (is_palindrome !== "") {
    const boolValue =
      is_palindrome === "true" || is_palindrome === true ? 1 : 0;
    conditions.push(`json_extract(properties, '$.is_palindrome') = ?`);
    params.push(boolValue);
  }

  if (min_length !== "" && !isNaN(parseInt(min_length))) {
    conditions.push(`json_extract(properties, '$.length') >= ?`);
    params.push(parseInt(min_length));
  }

  if (max_length !== "" && !isNaN(parseInt(max_length))) {
    conditions.push(`json_extract(properties, '$.length') <= ?`);
    params.push(parseInt(max_length));
  }

  if (word_count !== "" && !isNaN(parseInt(word_count))) {
    conditions.push(`json_extract(properties, '$.word_count') = ?`);
    params.push(parseInt(word_count));
  }

  if (contains_character) {
    conditions.push(
      `json_valid(json_extract(properties, '$.character_frequency_map."${contains_character}"'))`
    );
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(
          new InternalServerError({
            details: "Error fetching strings",
            message: err.message,
          })
        );
      } else {
        const results = rows.map((row) => {
          return {
          ...row,
          properties: JSON.parse(row.properties),
        }
        });
        resolve(results);
      }
    });
  });
}

const fetchSingleString = (value) => {
  const sql = `SELECT * FROM strings  WHERE value = ?;`;
  return new Promise((resolve, reject) => {
    db.get(sql, [value], (err, row) => {
      if (err) {
        const serverError = new InternalServerError({
          details: "Error saving data",
          message: err.message,
        });
        reject(serverError);
      } else {
        if (row) {
          resolve({
            ...row,
            properties: JSON.parse(row.properties)
          });
        } else {
          resolve(row);
        }
      }
    });
  });
};

module.exports = {
  createTable,
  insertString,
  deleteString,
  fetchStrings,
  fetchSingleString,
};
