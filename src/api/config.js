import axios from 'axios'
import store from '../redux/store/store'

const token = store.getState().main.token
const authorization = `Bearer ${token}`
export const URL = 'http://localhost:5000'

//Axios instance for requests requiring an authorization token
const customAxios = axios.create({
    baseURL: URL,
    headers: {
        Authorization: authorization
    }
})
// customAxios.interceptors.request.use(req=>{
//     console.log(store.getState().main.token)
//     console.log(req)
// })
export default customAxios