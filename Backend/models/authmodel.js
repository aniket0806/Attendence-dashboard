import pool from "../config/db.js";
export async function findUserByUsername(username) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, username,department_code, designation,usertype, password FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw new Error("Database error");
  }
}
