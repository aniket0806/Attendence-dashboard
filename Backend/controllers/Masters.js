import { getAllDepartments, getAllDesignation, getAllEmployees, getAllWorkLocation } from "../models/Masters.js";
export const getMastersEmployees = async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.status(200).json(employees);
    }
    catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
}
 export const getdepartments = async (req, res) => {
    try {
        const departments = await getAllDepartments();
        res.status(200).json(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
 }

 export const getdesignation = async (req, res) => {
    try {
        const designation = await getAllDesignation();
        res.status(200).json(designation);
    } catch (error) {
        console.error("Error fetching designation:", error);
        res.status(500).json({ error: "Failed to fetch designation" });
    }
 }

 export const getworklocation = async (req, res) => {
    try {
        const worklocation = await getAllWorkLocation();
        res.status(200).json(worklocation);
    } catch (error) {
        console.error("Error fetching worklocation:", error);
        res.status(500).json({ error: "Failed to fetch worklocation" });
    }
 }