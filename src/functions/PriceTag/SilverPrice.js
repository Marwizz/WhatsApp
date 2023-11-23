import axios from "axios";

export const listSilverPrice = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-silver-price`
  );
};

export const createSilverPrice = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/silver-price-create`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getSilverPrice = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/silver-price/${_id}`
  );
};

export const removeSilverPrice = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/silver-price-delete/${_id}`
  );
};

export const updateSilverPrice = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/silver-price-update/${_id}`,
    values
  );
};
