import axios from "axios";

export const listMessageReceive = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-message-receive`
  );
};

export const createMessageReceive = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-message-receive`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getMessageReceive = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/message-receive/${_id}`
  );
};

export const removeMessageReceive = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/delete-message-receive/${_id}`
  );
};

export const updateMessageReceive = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-message-receive/${_id}`,
    values
  );
};
