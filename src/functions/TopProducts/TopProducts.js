import axios from "axios";

export const listTopProducts = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-top-products`
  );
};

export const createTopProducts = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/top-products-create`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getTopProducts = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/top-products/${_id}`
  );
};

export const removeTopProducts = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/top-products-delete/${_id}`
  );
};

export const updateTopProducts = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/top-products-update/${_id}`,
    values
  );
};
