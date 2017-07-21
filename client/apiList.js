/*
api list
 */
import resource from '../resource/index'
let list = [{
  key: 'getUser',
  url: '/api/users',
  method: 'get'
}];
export default resource(list);
