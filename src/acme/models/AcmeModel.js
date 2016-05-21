var util = require('util');
var Acme = require('../entities/Acme');
var MainModel = require('../../../lib/main/main-model');

/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* Represents a AcmeModel class
* @constructor
*/
function UserModel() {

  /**
  * The collection to use for this model
  */
  var collection = 'acmes';

  /***
  * Calling the super model constructor
  */
  MainModel.call(this, collection, Acme);
}

/***Binding the current model to the super model*/
util.inherits(AcmeModel,MainModel);

module.exports = AcmeModel;
