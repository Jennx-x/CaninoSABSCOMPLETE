import axios from "axios";
const path = import.meta.env.VITE_MAIN_PATH;

export const postCompanies = async (companyData) => {
  try {
    const response = await axios.post(`${path}/companies`, companyData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCompanies = async () => {
  try {
    const response = await axios.get(`${path}/companies`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCompanyById = async (id) => {
  try {
    const response = await axios.get(`${path}/companies/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateCompany = async (id, updatedData) => {
  try {
    const response = await axios.put(`${path}/companies/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteCompany = async (id) => {
  try {
    const response = await axios.delete(`${path}/companies/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
