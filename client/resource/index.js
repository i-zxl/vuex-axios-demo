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
          return new Promise((resolve, reject) => {
              Axios.get(item.url, params).then((response) => {
                resolve(response);
              }, (response) => {
                reject(response);
              })
          })
          // return Axios.get(item.url, params)
          break;
        case 'post':
          return new Promise((resolve, reject) => {
              Axios.post(item.url, params).then((response) => {
                resolve(response);
              }, (response) => {
                reject(response);
              })
          })
          // return Axios.get(item.url, params)
          break;
      }
    }
  })
  return sourceList;
}
export default resource;
