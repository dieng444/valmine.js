var express = require('express')
    , bodyParser = require('body-parser')
    , urlencodedParser = bodyParser.urlencoded({ extended: false })
    , twig = require('twig')

var app = express();
var port = 3000; /***Specify here the port that you want to use*/

app.use(express.static(__dirname + '/ui'))
app.use(express.static(__dirname + '/resources'))
app.use(express.static(__dirname + '/node_modules'))
app.use(bodyParser.json());
app.set('views', __dirname + '/resources/views/')
app.set('view engine', 'twig')

/********************************************
* Add all your news routes below            *
********************************************/



.get('*', function(req, res) { res.render('404', { title: 'Page Not Found...', code:'404'}); });

app.listen(port);

console.log("The server listening on the port " + port);
