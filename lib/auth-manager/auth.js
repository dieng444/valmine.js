var param = require('../../app/parameter')
  , MooseError = require('../utils/error')
  , util = require('../utils/util')
  , instance = null; //static variable, shared by all instances
/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* A singleton authentification manager, allows to manage user connection
* @class
* @property {Object} providerModel - the model to use for check current user existence
* @property {string} loginField - the field representing user login in document
* @property {string} passwordField - the field representing password in the document
* @property {string} logoutPath - the path to redirect to when user logout
* @property {string} filter - filter to use for retrieve user in document collection
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
    throw MooseError.getInstance("No provider model found, please check the parameter file to specify your provider.");
  if(loginField==null)
    throw MooseError.getInstance("No login field found, please check the parameter file to specify your login field.");
  if(passwordField==null)
    throw MooseError.getInstance("No password field found, please check the parameter file to specify your password field.");
  if(logoutPath==null)
    throw MooseError.getInstance("No logout path found, please check the parameter file to specify your logout path.");

    /**
    * @private
    * @method
    * Allows to set the current user in the session
    * @param {Object} _user : the new user to assign
    */
    var setUser = function(_user) {
      user = _user
    }

    this.getInstance = function() {
      if(instance!=null)
        return instance;
      else instance = this;
      return instance;
    }
    /**
    * @public
    * @method
    * Allows to set the current user in the session
    * @param {Object} _user : the new user to assign
    */
    this.setUser = function(_user) {
      user = _user
    }

    /**
    * @method
    * Returns the current user in the session
    * @return {Object}
    */
    this.getUser = function() {
      return user;
    }

  /**
  * @method
  * Chekcs if current user is a valid user from database
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  * @param {function} callback - function to call after checking
  * @return {boolean}
  */
  this.checkAuthentication = function(req, res, callback) {
    if(!req.body.hasOwnProperty(loginField))
      throw MooseError.getInstance("Your form input login name don't match the loginField in the parameter file");
    if(!req.body.hasOwnProperty(passwordField))
      throw MooseError.getInstance("Your form input password name don't match the passwordField in the parameter file");
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('checkAuthentication','callback')));
    if(!res)
      throw MooseError.getInstance(new TypeError(util.getParamErr('checkAuthentication','res')));
    if(!req)
      throw MooseError.getInstance(new TypeError(util.getParamErr('checkAuthentication','req')));

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
  * @method
  * Checks if the current user is connected
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  * @param {function} callback - function to call after checking
  * @return {boolean}
  */
  this.isConnected = function(req, res, callback) {
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('isConnected','callback')));
    if(!req)
      throw MooseError.getInstance(new TypeError(util.getParamErr('isConnected','req')));
    if(!res)
      throw MooseError.getInstance(new TypeError(util.getParamErr('isConnected','res')));
    //if(req.session.user!=null) suppose to be
    if(this.getUser()!=null)
      callback(true);
    else
      callback(false);
  }
  /**
  * @method
  * Checks if the current user has some role
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  * @param {string} role - the role to be checked
  * @param {function} callback - function to call after checking
  * @return {boolean}
  */
  this.isGrantedRole = function(req, res, role, callback) {
    if(!req)
      throw MooseError.getInstance(new TypeError(util.getParamErr('isGrantedRole','req')));
    if(!res)
      throw MooseError.getInstance(new TypeError(util.getParamErr('isGrantedRole','res')));
    if(!role)
      throw MooseError.getInstance(new TypeError(util.getParamErr('isGrantedRole','role')));
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('isGrantedRole','callback')));

    this.isConnected(req, res, function(yes) {
      if(yes) {
        //if(req.session.use.getRole()==role) suppose to be
        if(user.getRole()==role) callback(true);
        else callback(false);
      } else throw MooseError.getInstance("You can't invoke isGrantedRole if there are no user logged");
    })
  }

  /**
  * @method
  * Allows to logout current user
  * @param {Request} req - Express current request
  * @param {Response} res - Express current response
  */
  this.logout = function(req,res) {
    if(!req)
      throw MooseError.getInstance(new TypeError(util.getParamErr('isGrantedRole','req')));
    if(!res)
      throw MooseError.getInstance(new TypeError(util.getParamErr('isGrantedRole','res')));

    //req.session.user = null;
    setUser(null);
    res.redirect(logoutPath);
  }
}

module.exports = AuthManager;
