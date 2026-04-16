import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
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