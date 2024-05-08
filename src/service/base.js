import axios from 'axios'

const ERR_OK = 0
// 它的值取决于当前 Node.js 进程运行的环境变量 process.env.NODE_ENV。如果该变量的值为 'production'（即生产环境）
// 在开发环境中，请求的路径可能是相对于服务器根目录的，而在生产环境中，请求的路径可能需要指向一个完整的 URL 地址或者 CDN 资源地址。
const baseURL = process.env.NODE_ENV === 'production' ? 'http://ustbhuangyi.com/music-next/' : '/'

axios.defaults.baseURL = baseURL
// params 通常是指包含在请求 URL 中的一些参数。这些参数可以用于向服务器传递信息，以便服务器根据这些信息来处理请求并返回相应结果。
export function get(url, params) {
  // 在 HTTP 请求中，使用 GET 方法时，params 参数通常会被拼接到 URL 的末尾，形成类似于 ?  而在使用 POST 等方法时，params 参数通常会被放入请求体中进行传递。
  return axios.get(url, {
    params
  }).then((res) => {
    // res.data 通常是指用于获取服务器响应数据的一个属性或方法。该属性存储了从服务器返回的数据。
    const serverData = res.data
    // console.log(serverData)
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
    // 并在请求成功后通过 .then() 方法处理响应对象  .then() 方法来注册异步操作成功后要执行的回调函数；
    // 而对于异步操作失败的情况，则可以通过 .catch() 方法来注册要执行的错误处理函数。
  }).catch((e) => {
    console.log(e)
  })
}
