import axios from "axios";

export const listCategoryProducts = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-category-products`
  );
};

export const createCategoryProducts = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-category-products`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getCategoryProducts = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/get-category-products/${_id}`
  );
};

export const removeCategoryProducts = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/remove-category-products/${_id}`
  );
};

export const updateCategoryProducts = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-category-products/${_id}`,
    values
  );
};
