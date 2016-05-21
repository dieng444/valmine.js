var MainEntity = require('../../../lib/main/main-entity');
var util = require('util');

/**
* Represents a Acme classe
* @class
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* @param {Object} data - the data object with which to initialize the class attributes
* @property {string} name - The current acme name
*/
function User(data) {

    /**Private var -acme name*/
    var name = null;

    /**
    * Changes the current acme name
    * @param {string} _name -  the new name to assign
    * @return {void}
    */
    this.setName = function(_name) {
      name = _name;
    }

    /**
    * Changes the current acme name
    * @return {string}
    */
    this.getName = function() {
      return name;
    }

    /***Inheritance of the super entity class*/
    MainEntity.call(this,data);
}

/***Bind your Entity to the super Entity here by completing the first parameter*/
util.inherits(Acme,MainEntity);

module.exports = Acme;
