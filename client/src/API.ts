import axios from "axios";

const baseUrl: string = "http://localhost:3333";

export const sendMessage = async (e: {
  userId: string;
  chatId: string;
  message: string;
}): Promise<any> => {
  try {
    const response = await axios.put(
      baseUrl + `/users/${e.userId}/chats/${e.chatId}`,
      { text: e.message }
    );
    return response.data;
  } catch (error) {
    return {
      errorMessage: "Error",
    };
  }
};

export const getUsers = async (): Promise<any> => {
  try {
    const response = await axios.get(baseUrl + `/users`);
    return response.data;
  } catch (error) {
    return {
      errorMessage: "Error",
    };
  }
};

export const getUser = async (e: { userId: string }): Promise<any> => {
  try {
    const response = await axios.get(baseUrl + `/users/${e.userId}`);
    return response.data;
  } catch (error) {
    return {
      errorMessage: "Error",
    };
  }
};

export const getChats = async (e: { userId: string }): Promise<any> => {
  try {
    const response = await axios.get(baseUrl + `/users/${e.userId}/chats`);
    return response.data;
  } catch (error) {
    return {
      errorMessage: "Error",
    };
  }
};

export const getDetailChats = async (e: {
  userId: string;
  chatId: string;
}): Promise<any> => {
  try {
    const response = await axios.get(
      baseUrl + `/users/${e.userId}/chats/${e.chatId}`
    );
    return response.data;
  } catch (error) {
    return {
      errorMessage: "Error",
    };
  }
};
