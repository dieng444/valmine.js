var util = require('../utils/util')
var MyError = require('../utils/error');

/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* Represents a the main entity of all the framework subs entity
* @class
* @param {Object} data - the data object with which to initialize the class attributes
*/
function MainEntity(data) {

  /**
  * Allows to initialize subclasses attributes
  * @method
  */
  this.init = function() {
    if(util.isEmpty(data))
      throw MyError.getInstance("Empty object passed to the entity constructor, check the data parameter of your entity");
    for(attr in data) {
      var method = 'set'+attr.charAt(0).toUpperCase() + attr.slice(1);
      for(key in this) {
        if (key == method && typeof this[key] === 'function') {
          this[key](data[attr]); /***Calling the setter here after parse**/
        }
      }
    }
  }
  /****Do not touch the following method position***/
  this.init();
}

module.exports = MainEntity;
