import axios from "axios";
const path = import.meta.env.VITE_MAIN_PATH;

export const postRoles = async (roleData) => {
  try {
    const response = await axios.post(`${path}/roles`, roleData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getRoles = async () => {
  try {
    const response = await axios.get(`${path}/roles`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await axios.get(`${path}/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateRole = async (id, updatedData) => {
  try {
    const response = await axios.put(`${path}/roles/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`${path}/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
