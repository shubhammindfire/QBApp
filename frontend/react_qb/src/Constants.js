// server urls
export const BASE_SERVER_URL = "http://localhost:8000";
export const REGISTER_URL = BASE_SERVER_URL + "/api/users";
export const LOGIN_URL = BASE_SERVER_URL + "/api/login";
export const CONNECT_TO_QBO_URL = BASE_SERVER_URL + "/qb/connect";
export const GET_ALL_INVOICES = BASE_SERVER_URL + "/api/invoices";
export const GET_INVOICE_BY_ID = BASE_SERVER_URL + "/api/invoices"; // endpoint - /api/invoices/{id}

// react routes
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const PORTAL_ROUTE = "/portal";
export const PORTAL_CUSTOMERS_ROUTE = "/portal/customers";
export const PORTAL_ITEMS_ROUTE = "/portal/items";
export const PORTAL_INVOICES_ROUTE = "/portal/invoices";
export const PORTAL_INVOICE_DETAIL_ROUTE = "/portal/invoice/detail";
