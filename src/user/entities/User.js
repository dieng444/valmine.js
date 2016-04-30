/**************************************************
* Object User, represents a User                  *
***************************************************/
var MainEntity = require('../../../lib/main/main-entity');
var util = require('util');

/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* Represents a User
* @class
* @param {Object} data - the data object with which to initialize the class attributes
* @property {int} id - the current user id
* @property {string} firstName - the user firstName
* @property {string} lastName - the user lastName
* @property {string} description - the user description
* @property {string} picture - the user picture
* @property {string} coverImage - the user cover image
* @property {string} email - the user email
* @property {string} password - the user password
* @property {string} role - the user role
*/
function User(data) {

    /**Private var - the user identify*/
    var id = null;

    /**Private var - the user firstName*/
    var firstName;

    /**Private var - the user lastName*/
    var lastName;

    /**Private var - the user description*/
    var description;

    /***Private var - the user picture**/
    var picture = null;

    /***Private var - the user cover image**/
    var coverImage = null;

    /**Private var - the email*/
    var email;

    /**Private var - the user password*/
    var password;

    /**Private var - the user role*/
    var role;

    /**
    * @method
    * Allows to set user id
    * @param {int} id - the new id to assign
    */
    this.setId = function(_id) {
        id = _id;
    }

    /**
    * @method
    * Return current user id
    * @return {int}
    */
    this.getId = function() {
      return id;
    }

    /**
    * @method
    * Allows to set user firstName
    * @param {string} fname - new firstName to assign
    */
    this.setFirstName = function(fname) {
      firstName = fname;
    }

    /**
    * @method
    * Return the current user firstName
    * @return {string}
    */
    this.getFirstName = function() {
      return firstName;
    }

    /**
    * @method
    * Allows to set user lastName
    * @param {lname} - the new lastName to assign
    */
    this.setLastName = function(lname) {
      lastName = lname;
    }

    /**
    * @method
    * Return the current user lastName
    * @return {string}
    */
    this.getLastName = function() {
      return lastName;
    }

    /**
    * @method
    * Allows to set user description
    * @param {string} desc - the new description to assign
    */
    this.setDescription = function(desc) {
      description = desc;
    }

    /**
    * @method
    * Return user description
    * @return {string}
    */
    this.getDescription = function() {
      return description;
    }

    /**
    * @method
    * Allows to set user picture
    * @param {string} _picture - the new picture to assign
    */
    this.setPicture = function(_picture) {
      picture = _picture;
    }

    /**
    * @method
    * Returns the user picture
    * @return {string}
    */
    this.getPicture = function() {
      return picture;
    }

    /**
    * @method
    * Allows to set user cover image
    * @param {string} _coverImage - the new cover image to assign
    */
    this.setCoverImage = function(_coverImage) {
      coverImage = _coverImage;
    }

    /**
    * @method
    * Returns the user cover image
    * @return {string}
    */
    this.getCoverImage = function() {
      return coverImage;
    }

    /**
    * @method
    * Allows to set the user email
    * @param {string} email - the new email to assign
    */
    this.setEmail = function(mail) {
      email = mail;
    }

    /**
    * @method
    * Return the current user email
    * @return {string}
    */
    this.getEmail = function() {
      return email;
    }

    /**
    * @method
    * Allows to set the user password
    * @param {string} pwd - the new password to assign
    */
    this.setPassword = function(pwd) {
      password = pwd;
    }

    /**
    * @method
    * Return the current user password
    * @return {string}
    */
    this.getPassword = function() {
      return password;
    }

    /**
    * @method
    * Allows to set the user role
    * @param {string} _role - the new password to assign
    */
    this.setRole = function(_role) {
      role = _role;
    }

    /**
    * @method
    * Returns the user role
    * @return {string}
    */
    this.getRole = function() {
      return role;
    }

    /***Inheritance of the super entity class*/
    MainEntity.call(this,data);
}
/***Bind your Entity to the super Entity here, by completing the first parameter*/
util.inherits(User,MainEntity);
module.exports = User;
