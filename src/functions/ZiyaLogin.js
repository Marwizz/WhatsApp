import axios from "axios";

export const listZiyaLogin = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/ziya-list-login`
  );
};
