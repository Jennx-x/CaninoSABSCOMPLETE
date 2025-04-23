import axios from "axios";
const path = import.meta.env.VITE_MAIN_PATH;

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${path}/login`, credentials);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("fullName", response.data.fullName);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(`${path}/users/check-email`, {
      params: { email },
    });
    return response.data.exists;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  const parts = token.split(".");
  console.log(parts);
  
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("fullName");
};
