import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         throw error
//     }
// )