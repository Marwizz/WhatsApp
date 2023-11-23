import axios from "axios";

export const listCategory = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-category`
  );
};

export const createCategory = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-category`,
    values,
    { 
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getCategory = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/get-category/${_id}`
  );
};

export const removeCategory = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/remove-category/${_id}`
  );
};

export const updateCategory = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-category/${_id}`,
    values
  );
};
