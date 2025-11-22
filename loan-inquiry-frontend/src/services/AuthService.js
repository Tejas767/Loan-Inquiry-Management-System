import api from "./api";

const BASE = "/api/auth";

// Call backend to register new user (Customer or Admin)
export const register = (username, password, role = "USER") =>
  api.post(`${BASE}/register`, { username, password, role });

// Call backend to login and get JWT token + role
export const login = (username, password) =>
  api.post(`${BASE}/login`, { username, password });
