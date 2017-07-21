import API from '../../apiList'
import * as types from './mutation-types'
// 获取用户信息
export const request_user = ({commit}, param) => {
  API.getUser(param)
  .then(response => {
    let res = response.data
    console.log(res.result);
    commit(types.FETCH_USER, res.result);
  })
}
