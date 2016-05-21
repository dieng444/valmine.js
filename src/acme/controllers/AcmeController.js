var User = require('../entities/User')
  , UserModel = require('../models/UserModel');

function UserController() {

  var amodel = new UserModel()

  /**
  * Performs default action
  * @param Request req  - the current request object
  * @param Response res - the current response Object
  */
  this.defaultAction = function(req, res) {
    var acme = new Acme(req.body);
    amodel.save(acme,function(err, result) {
      if(!err) {
        console.log("acme "+ result.lastInsertedId+" added successfully");
      }
    });
  }
}
