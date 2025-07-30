import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_URL;

/* create or merge user in Firestore */
export async function upsertUserWithToken(token) {
  try {
    await axios.post(`${BASE_URL}/user/create`, { token });
  } catch (e) {
    toast.error(e.response?.data?.message || "Server error");
    throw e;
  }
}
