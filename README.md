# pdd-sdk

> 多多进宝NodeJS SDK

## 安装

``` bash
# install dependencies
npm install pdd-sdk --save
```

## 使用

``` javascript
const PddSdk = require('pdd-sdk')

const apiClient = new PddSdk({ client_id: 'your client_id', clientSecret: 'your clientSecret' })
// 以调用商品标准类目接口为例
// 商品标准类目接口文档(https://open.pinduoduo.com/application/document/api?id=pdd.goods.cats.get)
apiClient.execute('pdd.goods.cats.get', { parent_cat_id: 0 }).then((res) => {
  console.log(res)
})

```
