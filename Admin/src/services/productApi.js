import axios from "axios";

const API_URL = "http://localhost:4000/api/product/upload";

export const uploadProduct = async (formData) => {
  // formData should be a FormData object
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllProducts = async () => {
  return axios.get("http://localhost:4000/api/product");
};

export const deleteProduct = async (id) => {
  return axios.delete(`http://localhost:4000/api/product/${id}`);
};
