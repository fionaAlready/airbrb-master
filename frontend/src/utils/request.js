import Axios from 'axios'
const BaseUrl = 'http://localhost:5005'

const axios = Axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

axios.interceptors.request.use((config) => {
  // Read token for anywhere, in this case directly from localStorage
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axios;
