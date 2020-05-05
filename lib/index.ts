import crypto from 'crypto'
import request from './request_utils'

interface initOption {
  clientId: string,
  clientSecret: string
}

interface params {
  [propName: string]: any
}

export default class PddSdk {
  private clientId: string
  private clientSecret: string
  constructor(option: initOption) {
    this.clientId = option.clientId
    this.clientSecret = option.clientSecret
  }

  async execute(apiName: string, requestParams: params): Promise<any> {
    const res = await request.post('/', this.getRequestParams(apiName, requestParams))
    if (Object.prototype.hasOwnProperty.call(res, 'error_response')) {
      return Promise.reject(res)
    }
    return res
  }

  /**
   * 获取请求参数
   */
  getRequestParams(apiName: string, requestParams: params) {
    const timestamp = Date.now().toString().slice(0, Date.now().toString().length - 3)
    const params: {[key: string]: any} = {
      timestamp,
      type: apiName,
      client_id: this.clientId,
      sign: this.sign({
        timestamp,
        type: apiName,
        client_id: this.clientId,
        ...requestParams
      }),
      ...requestParams
    }
    // 对象value为object类型 需要JSON.stringify处理为字符串
    for (const key in params) {
      params[key] = typeof params[key] === 'object' ? JSON.stringify(params[key]) :  params[key]
    }
    return params
  }

  /**
   * 签名
   */
  sign(params: object) {
    // 排序后请求参数
    const sortedParams = this.sort(params)
    // 排序后字请求符串
    const sortedStr = this.obj2str(sortedParams)
    // 加密后请求字符串
    const encryptedStr = this.encrypt(sortedStr)
    return encryptedStr
  }

  /**
   * MD5加密
   */
  encrypt(str: string): string {
    const hash = crypto.createHash('md5')
    hash.update(str)
    return hash.digest('hex').toUpperCase()
  }

  /**
   * 对象转key value拼接字符串
   */
  obj2str(params: params): string {
    const paramsStr = Object.keys(params).map(key => `${key}${typeof params[key] === 'object' ? JSON.stringify(params[key]) :  params[key]}`).join('')
    return `${this.clientSecret}${paramsStr}${this.clientSecret}`
  }

  /**
   * 按参数首字母升序排序
   * @param { params }
   * @returns { params }
   */
  sort(params: params): params {
    const sortedArr = Object.keys(params).sort()
    const sortedParams: params = {}
    sortedArr.forEach(item => sortedParams[item] = params[item])
    return sortedParams
  }

}
