import axios from "axios";
const path = import.meta.env.VITE_MAIN_PATH;

export const postUsers = async (userData) => {
  try {
    const response = await axios.post(`${path}/users`, userData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${path}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${path}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (id, updatedData) => {
  try {
    const response = await axios.put(`${path}/users/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${path}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
