import axios from "axios";

export const listGoldKarat = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-gold-Karat`
  );
};

export const createGoldKarat = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-Karat-create`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getGoldKarat = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-Karat/${_id}`
  );
};

export const removeGoldKarat = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-Karat-delete/${_id}`
  );
};

export const updateGoldKarat = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/gold-Karat-update/${_id}`,
    values
  );
};
