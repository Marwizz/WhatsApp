import axios from "axios";

// export const listMessageSend = async () => {
//   return await axios.get(
//     `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-message-send`
//   );
// };

export const createWhatsappTokens = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/create-whatsapp-token`,
    values,
  );
};

// export const listCustomer = async () => {
//   return await axios.get(
//     `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/list-customer`
//   );
// };

// export const getMessageSend = async (_id) => {
//   return await axios.get(
//     `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/message-send/${_id}`
//   );
// };

export const deleteWhatsappTokens = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/delete-whatsapp-token/${_id}`
  );
};

export const updateMessageSend = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/update-message-send/${_id}`,
    values
  );
};

export const getTitleByCustomerIdAndType = async (customerId,typeId ) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/title/${customerId}/${typeId}`,
  );
};


export const getMessageOptionsBySendId = async (messageSendId) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_ZIYA}/api/auth/message-options/${messageSendId}`,
  );
};