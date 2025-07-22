import axios from "axios";
const BASE_URL = import.meta.env.VITE_URL;

export const createUserInDB = async (token) => {
  try {
    await axios.post(
      `${BASE_URL}/api/user/create`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(" Failed to sync user to DB:", error);
  }
};
