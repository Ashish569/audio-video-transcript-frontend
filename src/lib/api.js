import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api"; // We can put to env later

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    //for auth token if needed later
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Common error patterns
    if (error.response) {
      const { status, data } = error.response;
      console.error(`API Error [${status}]:`, data?.error || error.message);

      return Promise.reject({
        message: data?.error || "Something went wrong",
        status,
        data,
      });
    } else if (error.request) {
      console.error("Network error:", error.message);
      return Promise.reject({
        message: "Network error – please check your connection",
      });
    } else {
      return Promise.reject({ message: error.message });
    }
  }
);

// Helper methods
export const uploadFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/upload", formData, {
    timeout: 0,
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

export const getStatus = (id) => api.get(`/status/${id}`);
export const getTranscription = (mediaId) =>
  api.get(`/transcription/${mediaId}`);
export const getAllFiles = () => api.get("/upload/files"); // if you implement this endpoint later
export default api;
