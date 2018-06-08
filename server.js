const express = require('express');
const path = require('path');
var exphbs  = require('express-handlebars');
const app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var type;

const index = require('./routes/router');
const hbs = require('express-hbs');
const fs = require('fs');


var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



require('dotenv').config();

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.set('views', path.join(__dirname , '/views'));
app.set('view engine', '.hbs');


app.listen(8080, function (req, res) {
	console.log('Server listnening at 8080');
});


var options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
  	password: process.env.DB_PASSWORD,
  	database : process.env.DB_NAME
};

var sessionStore = new MySQLStore(options);


app.use(session({
	secret: 'askjnaqjcne',
	resave: false,
	store: sessionStore,
	saveUninitialized: false,
  	// cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.authenticate('local');

app.use(function(req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.username = req.user;
	next();
});

app.use(index);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error' , {title : "Some internal Error please try again later or contact administrator"});
});


passport.use(new LocalStrategy(
 	function(username, password, done) {
	const db = require('./dbconfig.js')

		console.log(username)
	   	query = db.query('SELECT * FROM users WHERE username = ? ', [username], function(err, results, fields) {
	   		if (err) {
	   			console.log('error')
	   			throw err};

	   		if (results.length === 0 ) {
	   			done(null, false , "Invalid Username");
	   		} else {

		   		const hash = results[0].password.toString();
		   		// console.log(results[0]);
		   		bcrypt.compare(password, hash, function (err, result) {
		   			if (result) {
		   				// console.log(result[0])
		   				type = results[0].type;
		   				return done(null, {user : results[0].username, type : results[0].type });
		   			} else {
		   				return done(null, false, "Invalid password");
		   			}
		   		});	
	   		}

	   	});
    }
));

