var ValmineError = require('./error');

/**
* Represents the utility class
* @class Util
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 Macky Dieng
*/
var Util = {

  /**
  * Checks wheter given object is empty or not
  * @method
  * @param {Object} obj - object to check for
  * @returns {booelan}
  */
  isEmpty : function(obj) {
    for(var prop in obj) if(obj.hasOwnProperty(prop)) return false;
    return true && JSON.stringify(obj) === JSON.stringify({});
  },

  /**
  * Returns message for missing parameter error
  * @method
  * @param {string} func - the current function name
  * @param msg {string} message - message to display in the error
  * @returns {string}
  */
  getParamErr : function(func,param) {
    return 'Method '+func+' called without the '+param+' parameter';
  },

  /**
  * Checks wheter the parameter callback is specified in current function
  * @method
  * @param {string} callback - the callback to check for
  * @returns {boolean}
  */
  isCallbackMissed : function(callback) {
    if (!callback || typeof callback !=='function') return true;
    else return false;
  },

  /**
  * Builds an unique file name
  * @method
  * @param {string} file - the uploaded file to rename
  * @returns {string}
  */
  getUniqueFileName : function(file) {
    var newName = null;
    if(!file) ValmineError.getInstance(new TypeError(Util.getParamErr('getUniqueFileName','file')));
    var fileExt = (file).split('.').pop()
        , fileName = (file).split('.').shift()
        , cleanedFile = (fileName).replace(/ /gi,'_')
        , newName = cleanedFile+'_'+Date.now()+'.'+fileExt;
    return newName;
  },

  /**
  * Returns month string value
  * @method
  * @returns {array}
  */
  getStringMonth : function() {
    var month = new Array();
    month[0] = "Janvier";
    month[1] = "Février";
    month[2] = "Mars";
    month[3] = "Avril";
    month[4] = "Mai";
    month[5] = "Juin";
    month[6] = "Juillet";
    month[7] = "August";
    month[8] = "Septembre";
    month[9] = "Octobre";
    month[10] = "Novembre";
    month[11] = "Décembre";
    return month;
  },

  /**
  * Returns the message of given status code
  * @method
  * @returns {Object}
  */
  getStatusMessage : function(code) {
    var status = null;
    switch (code) {
      case 500:
        status = {title:'The resource you are loogking does not exists...', code:code}
        break;
      case 404:
        status = {title:'Page not found...', code:code}
        break;
    }
    return status;
  }
}

module.exports = Util;
