import axios from "axios";

export const listMessageType = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-message-type`
  );
};

export const createMessageType = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-message-type`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getMessageType = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/message-type/${_id}`
  );
};

export const removeMessageType = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/delete-message-type/${_id}`
  );
};

export const updateMessageType = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-message-type/${_id}`,
    values
  );
};
