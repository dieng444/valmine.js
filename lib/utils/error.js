var util = require('./util');

/**
* Represents the error manager class
* @class ValmineError
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 Macky Dieng
*
* @param {string} message - message to display in the error
* @property {string} name - the error object name
*/
function ValmineError(message) {

  /***Name of the error object*/
  this.name = 'ValmineError';

  /***Message to display in current error*/
  this.message = message;

  /***Capturing the current error stack*/
  Error.captureStackTrace(this, ValmineError);
}

/**
* Returns a unique instance of the class
* @method getInstance (Error)
* @param {Object} params - parameters to use for instanciate the error
*/
ValmineError.getInstance = function(params) {
  if(!params) throw new ValmineError(new TypeError(util.getParamErr('getInstance','params')));
  var error = null;
  if(params instanceof Error) {
    error = new ValmineError(params.message);
    error.stack = params.stack;
  } else if (typeof params =='string') error = new ValmineError(params);
  else throw new Error("Unknow error type");
  return error;
}

/***Inheritance of the super class error*/
ValmineError.prototype = new Error;

module.exports = ValmineError;
