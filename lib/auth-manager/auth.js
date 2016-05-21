var param = require('../../app/parameter')
  , ValmineError = require('../utils/error')
  , util = require('../utils/util')
  , instance = null;

/**
* A singleton authentication manager, allows to manage user connection
* @class AuthManager
* @author Macky Dieng
* @license MIT - {@link http://opensource.org/licenses/MIT}
* @copyright 2016 Macky Dieng
*
* @property {Object} providerModel - the model to use for check current user existence
* @property {string} loginField - the field representing user identifier in document
* @property {string} passwordField - the field representing user password in the document
* @property {string} logoutPath - logout redirection path
* @property {string} filter - filter to use for retrieve user in document collection
* @property {Object} instance - static instance variable, shared by all instances
*/
function AuthManager() {

  /***Private var, current user provider model*/
  var providerModel = new param.providerModel();

  /***Private var, login field in the document collection*/
  var loginField = param.loginField;

  /***Private var, password field in the document collection*/
  var passwordField = param.passwordField;

  /***Private var, logout redirection path*/
  var logoutPath = param.logoutPath;

  /***Private var, retrieving user filter**/
  var filter = {};

  /***Private var, the current user in the session**/
  var user = null;

  if(providerModel==null)
    throw ValmineError.getInstance("No provider model found, please check the parameter file to specify your provider.");
  if(loginField==null)
    throw ValmineError.getInstance("No login field found, please check the parameter file to specify your login field.");
  if(passwordField==null)
    throw ValmineError.getInstance("No password field found, please check the parameter file to specify your password field.");
  if(logoutPath==null)
    throw ValmineError.getInstance("No logout path found, please check the parameter file to specify your logout path.");

  /**
  * Sets the current user in the session
  * @private
  * @method setUser
  * @param {Object} _user : the new user to assign
  * @returns void
  */
  var setUser = function(_user) {
    user = _user
  }

  /**
  * Returns unique instance of this class
  * @method getInstance
  * @returns {AuthManager}
  */
  this.getInstance = function() {
    if(instance!=null)
      return instance;
    else instance = this;
    return instance;
  }

  /**
  * Sets the current user in the session
  * @method setUser
  * @param {Object} _user : the new user to assign
  * @returns {void}
  */
  this.setUser = function(_user) {
    user = _user
  }

  /**
  * Returns the current user in the session
  * @method getUser
  * @returns {Object}
  */
  this.getUser = function() {
    return user;
  }

  /**
  * Chekcs if current user is a valid user from database
  * @method checkAuthentication
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  * @param {function} callback - function to call after operation
  * @returns {boolean}
  */
  this.checkAuthentication = function(req, res, callback) {
    if(!req.body.hasOwnProperty(loginField))
      throw ValmineError.getInstance("The name of input login in current form don't match the loginField in the parameter file");
    if(!req.body.hasOwnProperty(passwordField))
      throw ValmineError.getInstance("The name of input password don't match the passwordField in the parameter file");
    if(util.isCallbackMissed(callback))
      throw ValmineError.getInstance(new TypeError(util.getParamErr('checkAuthentication','callback')));
    if(!res)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('checkAuthentication','res')));
    if(!req)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('checkAuthentication','req')));

    filter[loginField] = req.body[loginField],
    filter[passwordField] = req.body[passwordField];
    providerModel.findOneBy(filter, function(err,user) {
      if(!err && user!=null) {
        //req.session.user = user; //Creating a session for the current user
        setUser(user);
        callback(err,true);
      } else callback(err,false);
    })
  }

  /**
  * Checks if the current user is connected
  * @method isConnected
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  * @param {function} callback - function to call after checking
  * @returns {boolean}
  */
  this.isConnected = function(req, res, callback) {
    if(util.isCallbackMissed(callback))
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isConnected','callback')));
    if(!req)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isConnected','req')));
    if(!res)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isConnected','res')));
    //if(req.session.user!=null) suppose to be
    if(this.getUser()!=null)
      callback(true);
    else
      callback(false);
  }

  /**
  * Checks if the current user has some role
  * @method isGrantedRole
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  * @param {string} role - the role to be checked
  * @param {function} callback - function to call after operation
  * @returns {boolean}
  */
  this.isGrantedRole = function(req, res, role, callback) {
    if(!req)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isGrantedRole','req')));
    if(!res)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isGrantedRole','res')));
    if(!role)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isGrantedRole','role')));
    if(util.isCallbackMissed(callback))
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isGrantedRole','callback')));

    this.isConnected(req, res, function(yes) {
      if(yes) {
        //if(req.session.use.getRole()==role) suppose to be
        if(user.getRole()==role) callback(true);
        else callback(false);
      } else throw ValmineError.getInstance("You can't invoke isGrantedRole if there are no user logged");
    })
  }

  /**
  * Logout current user
  * @method logout
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  * @returns {void}
  */
  this.logout = function(req,res) {
    if(!req)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isGrantedRole','req')));
    if(!res)
      throw ValmineError.getInstance(new TypeError(util.getParamErr('isGrantedRole','res')));

    //req.session.user = null;
    setUser(null);
    res.redirect(logoutPath);
  }
}

module.exports = AuthManager;
