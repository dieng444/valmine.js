# valmine.js

Framewok MVC for node.js

![Valmine js](http://valminejs.mackydieng.fr/img/valminejs-welcome2.png)

Valmine.js is an MVC framework for node.js, the framework has several components, including the express framework of node.js uses for its routing system. The tool also uses the module twig for its templating system and the mongobd module for its ODM (Object Document Mapping) integrated. Its uniqueness lies in its simplicity but also in its facility to use.

## Install

__npm__ install valmine.js

## Documentation

[Official Documentation Site](http://valminejs.mackydieng.fr/)

##Quick use

### The entity

    var MainEntity = require('../../../lib/main/main-entity');
    var util = require('util');

    /*
    * @param {Object} data - the data object with which to initialize the class attributes
    * @property {int} id - the current user id
    * @property {string} firstName - the user first name
    * @property {string} lastName - the user last name
    */
    function User(data) {

        /**Private var - the user id*/
        var id = null;

        /**Private var - the user first name*/
        var firstName;

        /**Private var - the user last name*/
        var lastName;

        /**
        * @method
        * Modify the user id
        * @param {int} id - the new id to assign
        */
        this.setId = function(_id) {
            id = _id;
        }

        /**
        * @method
        * Returns current user id
        * @return {int}
        */
        this.getId = function() {
          return id;
        }

        /**
        * @method
        * Modify the user first name
        * @param {string} fname - new first name to assign
        */
        this.setFirstName = function(fname) {
          firstName = fname;
        }

        /**
        * @method
        * Returns the user first name
        * @return {string}
        */
        this.getFirstName = function() {
          return firstName;
        }

        /**
        * @method
        * Modify user last name
        * @param {lname} - the new last name to assign
        */
        this.setLastName = function(lname) {
          lastName = lname;
        }

        /**
        * @method
        * Returns the user last name
        * @return {string}
        */
        this.getLastName = function() {
          return lastName;
        }

        /***Inheritance of the super entity class*/
        MainEntity.call(this,data);
    }

    /***Bind your Entity to the super Entity here by completing the first parameter*/
    util.inherits(User,MainEntity);

    module.exports = User;

### The model

    var util = require('util');
    var User = require('../entities/User');
    var MainModel = require('../../../lib/main/main-model');

    /*
    * Represents a UserModel
    * @constructor
    */
    function UserModel() {

      /**
      * The collection to use for this model
      */
      var collection = 'users';

      /***
      * Calling the super model constructor
      */
      MainModel.call(this, collection, User);
    }

    /***Binding the current model to the super model*/
    util.inherits(UserModel,MainModel);

    module.exports = UserModel;

### The controller

    var User = require('../entities/User')
    , UserModel = require('../models/UserModel')
    , util = require('../../../lib/utils/util');

    function UserController() {

      var umodel = new UserModel();

      /**
      * Performs signup action
      * @param Request req  - the current request object
      * @param Response res - the current response Object
      */
      this.registerAction = function(req, res) {
        var user = new User(req.body);
        umodel.save(user,function(err, result) {
          if(!err) {
            console.log("User "+ result.lastInsertedId+" added successfully");
            //res.redirect('/login'); //We will uncomment this line after
          }
        });
      }
      /**
      * Render the current login
      */
      this.renderLoginAction = function(req,res) {
          res.render('login',{});
      }
    }
    module.exports = UserController;
  

### The view

    {% extends 'layout.twig'%}
    {%block title%}{{user.getFirstName}} {{user.getLastName}}{%endblock%}
    {%block login%}<a href="/logout" class="btn btn-primary">Logout</a> {%endblock%}
    {%block body%}
      <section id="user-block-body">
        <div class="col-lg-6 col-lg-offset-3">
            <h3>Welcome to your profile page Mr. <b>{{user.getFirstName}} {{user.getLastName}}</b></h3>
            <h3>your number is : <b>{{user.getId}}</b></h3>
            <h3>and your email is : <b>{{user.getEmail}}</b></h3>
        </div>
        <div class="col-lg-6 col-lg-offset-5"><a href="/account" class="btn btn-success">Edit your profile</a></div>
      </section>
    {%endblock%}



### The front controller

  
    var UserController = require('./src/user/controllers/UserController');
    var userCtrl = new UserController();

    /**
    * calls the registration action from user controller
    **/
    .post('/register', urlencodedParser, function(req,res) {
        userCtrl.registerAction(req,res);
    })
    .get('/login', function(req,res) {
        userCtrl.renderLoginAction(req,res);
    })

Read more on the [Official documentation](http://valminejs.mackydieng.fr/)
