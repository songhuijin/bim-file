import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
    baseURL: '/jeecg-boot', // 用于请求的服务器URL
    timeout: 9000 // 请求超时时间，如果超时，请求将被中断
})

// 添加响应拦截器
service.interceptors.response.use((response) => {
    return response.data
})

// 添加请求拦截器
// service.interceptors.request.use(config => {
//     const token =store.state.token
//     if(token) {
//         config.headers['X-Access-Token'] = token
//     }
//     return config
// })

export {
    service as axios
}