import axios from 'axios'

window.axios = axios
window.axios.defaults.baseURL = process.env.VUE_APP_API_URL
window.axios.defaults.headers.common['Content-Type'] = 'application/json'
window.axios.defaults.withCredentials = false