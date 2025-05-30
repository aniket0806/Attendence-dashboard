

// models/MasterModel.js
import pool from "../config/db.js";

export async function getAllEmployees() {
  try {
    const [rows] = await pool.query(`
      SELECT 
  id AS emp_id,
  name,
  username,
  profile_img,
  mobile_no,
  department_code,
  designation
FROM users



    `);
    return rows;
  } catch (error) {
    throw error;
  }
}
export async function getAllDepartments() {
  try{
    const [rows] = await pool.query(`
      SELECT 
      id,
     department_name,
     department_code,
     total_employees
     FROM department
    `);
    return rows;
  }
    catch (error) {
      throw error;
    }
  }

export async function getAllDesignation() {
  try {
    const [rows] = await pool.query(`
      SELECT 
      id,
      designation,
      designation_code,
      short_code,
      designation_other
      FROM designation
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function getAllWorkLocation() {
  try {
    const [rows] = await pool.query(`
      SELECT 
      id,
      org_code,
      wl_code,
      worklocation,
      office_pic,
      latitude,
      longitude
      FROM worklocation
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}