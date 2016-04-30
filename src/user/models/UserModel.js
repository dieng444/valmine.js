var util = require('util');
var User = require('../entities/User');
var MainModel = require('../../../lib/main/main-model');

/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* Represents a UserModel
* @constructor
*/
function UserModel() {

  /**
  * The collection to use for this manager
  */
  var collection = 'users';

  /***
  * Calling the super manager constructor
  */
  MainModel.call(this, collection, User);
}
/*******************
* Bind your manager to the super manager here by completing the first parameter
*******************/
util.inherits(UserModel,MainModel);
/******Exporting the module**********/
module.exports = UserModel;
