import pool from "../config/db.js";

export const saveContact = async (name, email, message) => {
  const result = await pool.query(
    "INSERT INTO contact (name, email, message) VALUES ($1, $2, $3) RETURNING *",
    [name, email, message]
  );
  return result.rows[0];
};
