import axios from "axios";

export const listGoldPrice = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-gold-price`
  );
};

export const createGoldPrice = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-price-create`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getGoldPrice = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-price/${_id}`
  );
};

export const removeGoldPrice = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-price-delete/${_id}`
  );
};

export const updateGoldPrice = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-price-update/${_id}`,
    values
  );
};
