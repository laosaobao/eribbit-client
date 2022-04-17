import axios from 'axios'
import store from '@/store'
import router from '@/router'

//导出基准地址，因为可能有不是通过axios发请求的地方使用baseurl
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
    baseURL,
    timeout: 5000
})

//请求拦截器
instance.interceptors.request.use(config => {
    //判断是否有token

    //    获取用户信息对象
    const { profile } = store.state.user
    if (profile.token) {
        config.headers.Authorization = `Bearer ${profile.token}`
    }


    return config
}, error => {
    return Promise.reject(error)
})


//响应拦截器
//res=>res.data 直接返回data数据
instance.interceptors.response.use(res => res.data, error => {
    //401状态 token失效
    if (error.response && error.response.status === 401) {
        // 1、清空本地无效信息
        // 2、跳转登录页
        // 3、跳转需传参当前路由地址给登录页(登录完跳转原页面)
        store.commit('user/setUser', {})
        //需要转URI编码 因为fullPath获取原来完成路径，后面可能会带多个参数 /lujing?a=1&&b=2,
        // 和?redirectUrl冲突，直接传的话服务器解析可能会有问题，
        // 将fullPath进行编码，告诉服务器fullPath这段是前面redirectUrl参数的值
        // router.currentRoute得到的是ref()包装过的数据 需要加.value获取值
        const fullPath = encodeURI(router.currentRoute.value.fullPath)
        router.push('/login?redirectUrl=' + fullPath)
    }

    return Promise.reject(error)
})

//导出请求工具函数
//地址 请求方式
export default (url, method, submitData) => {
    return instance({
        url,
        method,
        // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
        // method参数：get,Get,GET  转换成小写再来判断
        // ['params']:submitData ===== params:submitData 这样理解
        //get请求用params传参 post用data传参
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    })
}