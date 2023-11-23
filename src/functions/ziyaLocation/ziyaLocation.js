import axios from "axios";

export const createZiyaLocation = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/location/ziya`,
      values
    );
  };
  
  export const removeZiyaLocation = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/location/remove-ziya/${_id}`
    );
  };
  
  export const listZiyaLocation = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/location/ziya`
    );
  };
  
  
  export const updateZiyaLocation = async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/location/update-ziya/${_id}`,
      values
    );
  };
  
  export const getZiyaLocation = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/location/get-ziya/${_id}`
    );
  };
  