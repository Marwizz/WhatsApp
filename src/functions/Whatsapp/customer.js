import axios from "axios";

export const listCustomer = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-customer`
  );
};

export const createCustomer = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-customer`,
    values,
  );
};

export const getCustomer = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/customer/${_id}`
  );
};

export const DeleteCustomer = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/delete-customer/${_id}`
  );
};

export const updateCustomer = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-customer/${_id}`,
    values
  );
};
