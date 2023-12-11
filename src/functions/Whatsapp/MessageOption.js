import axios from "axios";

export const listMessageOption = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-message-option`
  );
};

export const createMessageOption = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-message-option`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getMessageOption = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/message-option/${_id}`
  );
};

export const removeMessageOption = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/delete-message-option/${_id}`
  );
};

export const updateMessageOption = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-message-option/${_id}`,
    values
  );
};
