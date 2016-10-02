var MongoDB = require('mongodb').Db
  , Server = require('mongodb').Server
  , config = require('../../app/config')
  , ValmineError = require('../utils/error')
  , db = null;

/**
* Represents a MongodbManager
* @class DB
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 Macky Dieng
*
* @property {string} port - the database port
* @property {string} host - the database host name
* @property {string} name - the database name
* @property {DB} db -  the database unique instance shared by all instances
*/
function DB() {

    /**Private variable, the database port*/
    var port = config.dbPort;

    /**Private variable, the database host*/
    var host = config.dbHost;

    /**Private variable, the database name*/
    var name = config.dbName;

    /****Errors checking***/
    if(port==null) throw new ValmineError.getInstance('Database port can\'t be null, port = '+port);
    if(host==null) throw new ValmineError.getInstance('Database host can\'t be null, host = '+host);
    if(name==null) throw new ValmineError.getInstance('Database name can\'t be null, name = '+name);

    /**
    * Returns mongodb database unique instance
    * @method
    * @returns {MongoDB}
    */
    this.getInstance = function() {
      if(db!=null) return db; //do not create a new db instance if there is one that exists
      // default to a 'localhost' configuration:
      var connection_string = host+':'+port+'/'+name;
      // if OPENSHIFT env variables are present, use the available connection info:
      if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
        connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
      }
      db = mongojs(connection_string);
      console.log('connected to database :: ' + config.dbName);
      return db;
    }
}

module.exports = DB;
