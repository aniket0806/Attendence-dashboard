//utils/ constants.js
export const HOST =  import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "/api/auth";

export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const DASHBOARD_ROUTE =  `${AUTH_ROUTES}/`;
export const DEPARTMENTS_WISE_ROUTE = (encodedDept) =>
  `${AUTH_ROUTES}/departmentsemployees?departmentCode=${encodedDept}`;

// MASTERS ROUTES

export const DEPARTMENT_ROUTE = `${AUTH_ROUTES}/department`;
export const EMPLOYEE_ROUTE = `${AUTH_ROUTES}/getallemployees`;
export const DESIGNATION_ROUTE = `${AUTH_ROUTES}/designation`;
export const WORKLOCATION_ROUTE = `${AUTH_ROUTES}/worklocation`;
// export const DASHBOARD_ROUTE =  `${AUTH_ROUTES}/`;