var util = require('./util');
/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* Represents an Amazon Web Service(aws) BucketManager
* @class
* @param {string} message - message to display in the error
* @property {name} name - the error object name
*/
function MooseError(message) {

  /***Name of the error object*/
  this.name = 'MooseError';

  /***Message to display in current error*/
  this.message = message;

  /***Capturation of the current error stack*/
  Error.captureStackTrace(this, MooseError);
}

/**
* @method
* Allows to get MooseError instance
* @param {Object} params - parameter to use for instanciate the error
*/
MooseError.getInstance = function(params) {
  if (!params)
    throw new MooseError(new TypeError(util.getParamErr('getInstance','params')));
  var error = null;
  if(params instanceof Error) {
    error = new MooseError(params.message);
    error.stack = params.stack;
  } else if (typeof params =='string') {
    error = new MooseError(params);
  } else {
    throw new Error("Unknow type of error");
  }
  return error;
}
/***Inheritance of the super class error*/
MooseError.prototype = new Error;
module.exports = MooseError;
