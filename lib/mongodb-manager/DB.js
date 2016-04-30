var MongoDB = require('mongodb').Db
  , Server = require('mongodb').Server
  , config = require('../../app/config')
  , MyError = require('../utils/error')
  , db = null; /***static variable shared by all instances*/

/**
* @author Macky Dieng
* @license MIT - http://opensource.org/licenses/MIT
* @copyright 2016 the author
*
* Represents a NodeMongodbManager
* @class
* @property {string} port - the database port
* @property {string} host - the database host name
* @property {string} name - the database name
*/
function DB() {

    /**Private variable, the database port*/
    var port = config.dbPort;

    /**Private variable, the database host*/
    var host = config.dbHost;

    /**Private variable, the database name*/
    var name = config.dbName;

    /**
    * Private helper function, allows to display errors
    * @param {string} msg - message to display in the error
    */
    var displayErrors = function(msg) {
      var err = {database:db, code:400, messgae:msg };
      console.log('Errors occurred on NodeMongodbManager...');
      console.log(err);
      console.log('You should maybe check parameters definition in the config.js file...');
      return;
    }
    /****Errors checking***/
    if(port==null) {
      displayErrors('Database port can\'t be null, port = '+port);
	  }
    if(host==null) {
      displayErrors('Database host can\'t be null, host = '+host);
    }
    if(name==null) {
      displayErrors('Database name can\'t be null, name = '+name);
    }
    /**
    * @method
    * Return mongodb database unique instance
    * @return {MongoDB}
    */
    this.getInstance = function() {
        if(db!=null) return db; //do not create a new db instance if there is one that exists
				db = new MongoDB(name, new Server(host, port, {auto_reconnect: true}), {w: 1});
        db.open(function(e, d) {
        	if (e) console.log(e);
        	else console.log('connected to database :: ' + config.dbName);
        });
				return db;
    }
}

module.exports = DB;
