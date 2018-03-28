/*
axios resource
 */
import Axios from 'axios'

function resource(list) {
  let sourceList = {};
  list.forEach((item) => {
    sourceList[item.key] = (params) => {
      switch (item.method) {
        case 'get':
          return Axios.get(item.url, params)
          break;
        case 'post':
          return Axios.post(item.url, params)
          break;
      }
    }
  })
  return sourceList;
}
export default resource;
