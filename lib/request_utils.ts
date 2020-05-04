import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://gw-api.pinduoduo.com/api/router', // api 的 base_url
  timeout: 40000 // request timeout
})

// request interceptor
axiosInstance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
axiosInstance.interceptors.response.use(
  
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
