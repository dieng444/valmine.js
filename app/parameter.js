var UserModel = require('../src/user/models/UserModel');
/**
* Allows to specify app parameter
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 Macky Dieng
*/
module.exports = {
  providerModel: UserModel,
  loginField: 'email',
  passwordField: 'password',
  logoutPath: '/'
}
