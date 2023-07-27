const AK = "Odc9QlyB0i1kzC3nxT4fCoaS"
const SK = "W8oMGBkoMPp1eAAbGkqfbHRrEiX9GAne"
const local_port = 3000
const config = module.exports = {
  dev: {
    port: local_port,
    axios: {
      api: {
        baseURL: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=',
        highURL: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate?access_token=',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      },
      cache: {
        baseURL: 'http://localhost:' + local_port + '/api/v1',
      }
    },
    name: 'resources',
    redis: {
      enabled: false,
      url: 'localhost',
      port: 6379,
    },
    domain: '',
    host: ''
  },
  prod: {
    axios: {
      api: {
        baseURL: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token=',
        highURL: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate?access_token=',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      },
      cache: {
        baseURL: 'https://www.xx.com/api/v1'
      }
    },
    name: 'resources',
    redis: {
      enabled: false,
      url: 'resource-guide-prod.s2b5kv.ng.0001.usw2.cache.amazonaws.com',
      port: 6379,
    },
    domain: 'https://www.xx.com',
    host: 'https://www.xx.com'
  }
}[process.env.NODE_ENV || 'dev']
const position = [
  '保健医', '医士', '医师', '副主任', '主任', '教授', '副院长', '院长', '院士'
]
const splitPre = ['大会主席', '会议讲者', '大会讲者', '大会主持', '讨论嘉宾', '讲者嘉宾', '班主任', '特邀讲者'];
const splitPro = ['会议日程', '会议议程', '大会日程', '大会议程', '课程表'];

module.exports = {
  axios: { data: (!!config.redis.enabled ? config.axios.cache : config.axios.api) },
  AK,
  SK,
  position,
  splitPre,
  splitPro
}
