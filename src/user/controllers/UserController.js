
var multer = require('multer')
  , User = require('../entities/User')
  , Bucket = require('../../bucket/entities/Bucket')
  , UserModel = require('../models/UserModel')
  , BucketModel = require('../../bucket/models/BucketModel')
  , BucketManager = require('../../../lib/bucket-manager/manager')
  , Auth = require('../../../lib/auth-manager/auth')
  , util = require('../../../lib/utils/util');

function UserController() {

  var umodel = new UserModel()
    , bmodel = new BucketModel()
    , bmanager = new BucketManager()
    , auth = new Auth().getInstance();

    var storage =   multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, 'ui/public/uploads/images/');
      },
      filename: function (req, file, callback) {
        var newName = util.getUniqueFileName(file.originalname);
        callback(null,newName);
      }
    });
    var uploadPicture = multer({ storage : storage }).single('picture');

  this.registerAction = function(req, res) {
    var user = new User(req.body)
      , bucketName = user.getFirstName()+'.'+user.getLastName()+'.'+Date.now()
      , params = { Bucket: bucketName, ACL: 'private'};
    user.setRole('ROLE_USER');
    umodel.save(user,function(err, result) {
      if(!err) {
        var data = {name:bucketName, owner: result.lastInsertedId};
        var bucket = new Bucket(data);
        bmanager.createBucket(params, function(err, result) {
          if(!err) {
            bmodel.save(bucket, function(err,result) {
              if(!err)
                res.redirect('/account');
            });
          }
        });
      }
    });
  }
  this.loginAction = function(req , res) {
    auth.checkAuthentication(req, res, function(err,isOk) {
      if(isOk) {
        auth.isGrantedRole(req, res, 'ROLE_USER', function(yes) {
          if(yes) res.redirect('/profile');
        });
        auth.isGrantedRole(req, res, 'ROLE_ADMIN', function(yes) {
          if(yes) res.redirect('/admin');
        });
      } else {
        res.render('user/login',{errorMsg:"Identifiant ou mot de passe incorrect"});
      }
    });
  }
  this.logoutAction = function(req, res) {
    auth.logout(req,res);
  }
  this.userAlbumsAction = function(req, res) {
    umodel.findAllBy({firstName:"Baptiste"},function(albums) {
      console.log("list albums yes...");
      console.log(albums);
    });
  }
  this.updateAction = function(req,res) {
    auth.isConnected(req, res, function(response) {
      if(response) {
        umodel.findOne(auth.getUser().getId(), function(err, user) {
          if(user!=null) {
            uploadPicture(req , res, function(err) {
              var data = req.body;
              user.setFirstName(data.firstName);
              user.setLastName(data.lastName);
              user.setDescription(data.description);
              user.setEmail(data.email);
              user.setPassword(data.password);
              if(typeof req.file != 'undefined')
                user.setPicture(req.file.filename);
              umodel.save(user, function(err, result) {
                if(!err)
                  auth.setUser(user);
                res.redirect('/account');
              });
            });
          }
        });
      } else {
        res.redirect('/login');
      }
    })

  }
  this.accountAction = function(req,res) {
    auth.isConnected(req, res, function(response) {
      if(response)
        res.render('user/account',{user:auth.getUser()});
      else
        res.redirect('/login');
    });
  }
  this.profileAction = function(req,res) {
    auth.isConnected(req, res, function(response) {
      if(response)
        res.render('user/profile',{user:auth.getUser()});
      else
        res.redirect('/login');
    });
  }
}

module.exports = UserController;
