export const baseUrl = window.location.origin;
export const redirectUrl = `${baseUrl}/callback`;

export const LOGTO_APPID = import.meta.env.VITE_LOGTO_APPID || ""; // Register the sample app in Logto dashboard
export const LOGTO_ENDPOINT = import.meta.env.VITE_LOGTO_ENDPOINT || ""; // Replace with your own Logto endpoint
export const BASE_URL = import.meta.env.VITE_API_URL || ""; // Replace with your own Logto endpoint

export const ITEMS_PER_PAGE: number = import.meta.env.VITE_BOOKS_ITEMS_PER_PAGE;
export const GOOGLE_BOOKS_ITEMS_PER_PAGE: number = import.meta.env.VITE_GOOGLE_BOOKS_ITEMS_PER_PAGE;
export const GOOGLE_BOOKS_API: number = import.meta.env.VITE_GOOGLE_BOOKS_API;

export const TOKEN_KEY = "token";
