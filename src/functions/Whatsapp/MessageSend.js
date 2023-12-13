import axios from "axios";

export const listMessageSend = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-message-send`
  );
};

export const createMessageSend = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-message-send`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getMessageSend = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/message-send/${_id}`
  );
};

export const removeMessageSend = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/delete-message-send/${_id}`
  );
};

export const updateMessageSend = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-message-send/${_id}`,
    values
  );
};
