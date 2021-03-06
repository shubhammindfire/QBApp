// server urls
export const BASE_SERVER_URL = "http://localhost:8000";
export const REGISTER_URL = BASE_SERVER_URL + "/api/users";
export const LOGIN_URL = BASE_SERVER_URL + "/api/login";
export const CONNECT_TO_QBO_URL = BASE_SERVER_URL + "/qb/connect";
export const FETCH_DATA_FROM_QBO_URL =
    BASE_SERVER_URL + "/qb/fetch_data_from_qbo"; // actual endpoint - /qb/fetch_data_from_qbo/{userId}
export const GET_CURRENT_USER = BASE_SERVER_URL + "/api/user";
export const GET_ALL_INVOICES = BASE_SERVER_URL + "/api/invoices";
export const GET_INVOICE_BY_ID = BASE_SERVER_URL + "/api/invoices"; // actual endpoint - /api/invoices/{id}
export const DELETE_INVOICE_BY_ID = BASE_SERVER_URL + "/api/invoices"; // actual endpoint - /api/invoices/{id}
export const POST_INVOICE = BASE_SERVER_URL + "/api/invoices";
export const PATCH_INVOICE = BASE_SERVER_URL + "/api/invoices"; // actual endpoint - /api/invoices/{id}
export const GET_ALL_ITEMS = BASE_SERVER_URL + "/api/items";
export const GET_ITEM_BY_ID = BASE_SERVER_URL + "/api/items"; // actual endpoint - /api/items/{id}
export const GET_ALL_CUSTOMERS = BASE_SERVER_URL + "/api/customers";
export const GET_CUSTOMER_BY_ID = BASE_SERVER_URL + "/api/customers"; // actual endpoint - /api/customers/{id}

// react routes
export const BASE_REACT_ROUTE = "http://localhost:3000";
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const PORTAL_ROUTE = "/portal";
export const PORTAL_CUSTOMERS_ROUTE = "/portal/customers";
export const PORTAL_ITEMS_ROUTE = "/portal/items";
export const PORTAL_INVOICES_ROUTE = "/portal/invoices";
export const PORTAL_INVOICE_DETAIL_ROUTE = "/portal/invoice/detail";
