import axios from "axios";

export const listMediaPlayList = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-playlist`
  );
};

export const createMediaPlayList = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-playlist`,
    values
  );
};

export const updateMediaPlayList = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-playlist/${_id}`,
    values
  );
};

export const getMediaPlayList = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/get-playlist/${_id}`
  );
};

export const removeMediaPlayList = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/remove-playlist/${_id}`
  );
};
