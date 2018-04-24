import axios from 'axios'
import { localStorage } from 'globals'

const AuthInterceptor = axios.create()
AuthInterceptor.interceptors.request.use(config => {
  config.headers['App-Key'] = localStorage.getItem('appkey')
  config.headers['User-Token'] = localStorage.getItem('usertoken')

  return config
})

export default AuthInterceptor
