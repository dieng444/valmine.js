var DB = require('../mongodb-manager/DB')
  , ObjectID = require('mongodb').ObjectID
  , util = require('../utils/util')
  , MooseError = require('../utils/error');

/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* Represents the  main model of all the framework subs models
* @class
* @param {string} collection - the collection of the current manager
* @param {Object} Entity - The entity of the current manager
*
* @property {string} db - The database instance to use
* @property {string} idKey - The field to use for identify document in database collection
* @property {string} listEntity - List of persisted objects
* @property {Array} listEntity - List of persisted objects
* @property {string} filter - Object filter for custome query
*/
function MainModel(collection, Entity) {

  /***
  * The database instance variable
  */
  var db = new DB().getInstance();

  /***
  * The field to use for identify document in database collection
  */
  var idKey = '_id';

  /***
  * List of persisted objects
  */
  var listEntity = new Array();

  /***
  * Object filter for custome query
  */
  var filter = {};

  /****Erros checking****/
  if(collection==null)
    throw MooseError.getInstance('You must specify the collection to use in your current manager');
  if(Entity==null)
    throw MooseError.getInstance('You must specify entity to use in your current manager');
  /**
  * Private helper method, allows to parse document coming from database
  * @method
  * @param {Object} doc - document to parse
  * @return {Object}
  **/
  var getParsedDoc = function(doc) {
    doc.id = doc._id; /***Creating correct attr id since doc._id generated by mongodb***/
    delete doc._id; /***Now we can delete the _id on the document***/
    var entity = new Entity(doc);
    return entity;
  }
  /**
  * Allows to retrive a single object in collection from database
  * @method
  * @throws {MooseError}
  * @param {object} id - the unique identify of object to retrive
  * @param {function} callback - function to call after the treatment
  */
  this.findOne = function(id,callback) {
    if (!id || typeof id == 'function')
        throw MooseError.getInstance(new TypeError(util.getParamErr('findOne','id')));
    if(util.isCallbackMissed(callback))
        throw MooseError.getInstance(new TypeError(util.getParamErr('findOne','callback')));
    filter[idKey] = new ObjectID(id);/****Getting the document id from MongoDB ObjectID constructor****/
    db.collection(collection).findOne(filter,{}, function(err, doc) {
      if(err) console.log(err);
      if (doc!=null) {
        var entity = getParsedDoc(doc);
        callback(err,entity);
      } else {
        callback(err,doc);
        filter = [];
      }
    });
    filter = [];
  }
  /**
  * Allows to retrive one object in collection by filter
  * @method
  * @throws {MooseError}
  * @param {Object}  filter - filter to use for the request
  * @param {function} callback - function to call after the treatment
  */
  this.findOneBy = function(filter,callback) {
    if (!filter || typeof filter=='function')
        throw MooseError.getInstance(new TypeError(util.getParamErr('findOneBy','filter')));
    if(util.isCallbackMissed(callback))
        throw MooseError.getInstance(new TypeError(util.getParamErr('findOneBy','callback')));
    db.collection(collection).findOne(filter,{}, function(err, doc) {
      if(err) console.log(err);
      if(doc !== null) {
        var entity = getParsedDoc(doc);
        callback(err,entity);
      } else {
        callback(err,doc);
      }
    });
  }
  /**
  * Allows to retrive all entries of given collection
  * @method
  * @throws {MooseError}
  * @param {function} callback - function to call after the treatment
  **/
  this.findAll = function(callback) {
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('findAll','callback')));
    db.collection(collection).find(filter).toArray(function(err, docs) {
      if(err) console.log(err);
      if(docs.length > 0) {
        var objects = new Array();
        for(i in docs) {
          var entity = getParsedDoc(docs[i]);
          objects.push(entity);
        }
        callback(err,objects);
      } else {
        callback(err,docs);
      }
    });
  }
  /**
  * Allows to retrieve many objects in collection by filter
  * @method
  * @throws {MooseError}
  * @param {Object}  filter - the filter to use for the request
  * @param {function} callback - function to call after the treatment
  */
  this.findAllBy = function(filter, callback) {
    if(!filter || typeof filter == 'function')
      throw MooseError.getInstance(new TypeError(util.getParamErr('findAllBy','filter')));
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('findAllBy','callback')));
    db.collection(collection).find(filter).toArray(function(err, docs) {
      if(err) console.log(err);
      if(docs.length > 0) {
        var objects = new Array();
        for(i in docs) {
          var entity = getParsedDoc(docs[i]);
          objects.push(entity);
        }
        callback(err,objects);
      } else {
        callback(err,docs);
      }
    });
  }
  /**
  * Private method, allows to parse all gieven objects and prepare them
  * for insertion in database
  * @method
  * @throws {MooseError}
  * @param {function} callback - function to call when everything went well
  */
  var oParser = function(entity, callback) {
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('oParser','callback')));
    var data = {}
      , attribut = null
      , getter = null
      , objectId = null;
    for(method in entity) {
      if(/set/.test(method)) {
        attribut = method.substring(3,method.length); /***Will return "FirstName" from "setFirstNam"**/
        attribut = attribut.charAt(0).toLowerCase() + attribut.slice(1); /***Will return "firstName" from "FirstName"*/
        getter = 'get'+attribut.charAt(0).toUpperCase() + attribut.slice(1); //Will return "getFirstName" from firstName
        if (getter!='getId') { /***Object id is null here so o.getId() will return null*/
          if(typeof entity[getter]=='undefined')
            throw MooseError.getInstance('undefined method '+getter+', please checks the method definition in your class')
          else data[attribut] = entity[getter]();
        }
        else
          objectId = entity[getter](); //Storing separatly the object id for update mode
      }
    }
    if(util.isEmpty(data))
      throw MooseError.getInstance('Setters of all objects must imperatively be preceded by the string "set"');
      data = {id: objectId, d: data};
    callback(data); //When everything went well, callback is called for accessing the data
  }
  /**
  * Allows to save all persited objects
  * @method
  * @throws {MooseError}
  */
  this.save = function(entity,callback) {
    if(!entity)
      throw MooseError.getInstance(new TypeError(util.getParamErr('save','entity')));
    if(util.isEmpty(entity))
      throw MooseError.getInstance('You are trying to save empty entity');
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('save','callback')));
    oParser(entity, function(obj) {
        if(obj.id!==null) { //Update mode, object id is not null (objec already exists)
          filter[idKey] = new ObjectID(obj.id);
          db.collection(collection).updateOne(filter,{$set:obj.d},function(err, res) {
            if(err) console.error(err);
            callback(err,res);
          });
        } else { //insert mode, object id is null (new object)
          db.collection(collection).insertOne(obj.d, function(err, res) {
            if(err) console.error(err);
            callback(err, {lastInsertedId:res.insertedId});
          });
        }
    });
  }
  /**
  * Allows to remove an specific object
  * @method
  * @throws {MooseError}
  * @param {Object} obj - the object to remove
  * @param {funtion} callback - the function to call when everything went well
  */
  this.remove = function(obj, callback) {
    if (!obj)
      throw MooseError.getInstance(new TypeError(util.getParamErr('remove','object')));
    if (obj['getId'] !==null && typeof obj.getId === 'function')
      filter[idKey] = new ObjectID(obj.getId());
    else
      throw MooseError.getInstance("The current object passed for delete does'nt have an getId method");
    if(util.isCallbackMissed(callback))
      throw MooseError.getInstance(new TypeError(util.getParamErr('remove','callback')));
    db.collection(collection).removeOne(filter, {w:1}, function(err, res) {
      if(err) console.log(err);
      callback(err,res);
    });
  }
  /**
  * Allows to retrieve many object by custome filter
  * @param {Object} filter - the filter to execute for the custome query
  * @param {funtion} callback - the function to call when everything went well
  */
  this.findByCustomefilter = function(filter, callback) {

  }
}

module.exports = MainModel;