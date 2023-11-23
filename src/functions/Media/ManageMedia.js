import axios from "axios";

export const listManageMedia = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-media`
  );
};

export const createManageMedia = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-media`,
    values,
    { 
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getManageMedia = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/get-media/${_id}`
  );
};

export const removeManageMedia = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/remove-media/${_id}`
  );
};

export const updateManageMedia = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-media/${_id}`,
    values
  );
};
