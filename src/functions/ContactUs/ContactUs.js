import axios from "axios";

export const listContactUs = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-contact`
  );
};

export const removeInquiry = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/delete-inquiry/${_id}`
  );
};
