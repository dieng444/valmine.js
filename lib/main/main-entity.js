var util = require('../utils/util')
var ValmineError = require('../utils/error');

/**
* Represents the main entity class
* @class MainEntity
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 Macky Dieng
* @param {Object} data - the data object with which to initialize the subclasses attributes
*/
function MainEntity(data) {

  /**
  * Initialize subclasses attributes
  * @method
  * @throws {ValmineError}
  * @returns {void}
  */
  this.init = function() {
    if(util.isEmpty(data))
      throw ValmineError.getInstance("Empty object passed to the entity constructor, check the data parameter of your entity");
    for(attr in data) {
      var method = 'set'+attr.charAt(0).toUpperCase() + attr.slice(1);
      for(key in this) {
        if (key == method && typeof this[key] === 'function') {
          this[key](data[attr]); /***Calling the setter method**/
        }
      }
    }
  }
  /****Do not touch the following method position***/
  this.init();
}

module.exports = MainEntity;
