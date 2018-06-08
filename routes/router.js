var express =  require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
var parser = require('body-parser');
var fs = require('fs');

var passport = require('passport');


router.use(parser.json());

router.get('/', function(req, res, next) {
	console.log(req.user);
	console.log(req.isAuthenticated());
  	res.render('index.hbs', { title: 'SKIT' });
});

router.get('/about', function (req, res, next) {
	res.render('about.hbs', {title: 'About'})
});

router.get('/administration', function (req, res, next) {
	res.render('administration.hbs', {title: 'Administration'})
});

router.get('/academics', function (req, res, next) {
	res.render('academics.hbs', {title: 'Academics'})
});

router.get('/infrastructure', function (req, res, next) {
	res.render('infrastructure.hbs', {title: 'Infrastructure'})
});

router.get('/contact', function (req, res, next) {
	res.render('contact.hbs', {title: 'Contact'})
});	

router.get('/contact/hi', function (req, res, next) {
	res.render('hello.hbs', {title: 'hi'})
});	

router.get('/login', function (req, res, next) {
	// console.log(req.session.message)
	res.render('login.hbs', {title: 'Log In form'})
});	

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		// console.log(user)
		if (!user) { 
			// console.log(info);
			req.session.message = info;
      		return res.redirect('/login'); 
      	}
      	// console.log(user);
		req.logIn(user.user, function(err) {
			if (err) return next(err);
			// // console.log(user)
			// req.locals.type = user.type;
			return res.redirect('/profile/users/' + user.user);
	});
})(req, res, next);
});

router.get('/logout' , function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

router.get('/register', function (req, res, next) {
	res.render('register.hbs', {title: 'Registration form'})
});	

router.post('/register', function(req, res, next) {
	const username = req.body.username;
	const dob = req.body.dob;
	const password = req.body.password;
	const type = req.body.type;

	const db = require('../dbconfig.js')

	bcrypt.hash(password, saltRounds, function(err, hash) {
		query = db.query('INSERT INTO users (username, dob, password, type) VALUES (?, ?, ?, ?)',[username, dob, hash, type], function (err, result, fields) {
			if (err) {
				// console.log(err);
				if (err.code === "ER_DUP_ENTRY") res.send({
					redirectTo: '/login',
					msg : 'User Already Exists'
				});
				var str = JSON.stringify(err);
				console.log(str)
				// if (err === ) {}
			} else {

					db.query('SELECT * FROM users ORDER BY ID DESC LIMIT 1', function(err, results, fields) {
					if (err) throw err;

					const userId = results[0].username;
					req.login(userId, function (err) {
						if (err) console.log(err);
						res.send({
							redirectTo: '/',
							msg: 'User Registerd Successfully'
						});
					});

				});
			}
		});
	});
});

router.get('/profile/users/:id', authenticationMiddleware() ,function (req, res, next) {
	const db = require('../dbconfig.js');
	let username = req.params.id;
	let table = 'student';

	var user;
	// console.log(username)
	var q  = 	"SELECT roll_no, firstName, lastName, date_format(DOB,'%d-%b-%Y') AS DOB, gender, dept_name AS dept, email, phone, year_info AS year " +
				" FROM " + table + ", departments, year " +
				" WHERE roll_no = '"+ username +"' AND " + table + ".dept_id = departments.dept_id AND "+table+".year_id = year.year_id;"
	var query = db.query(q , function (err, result, fields ) {
		if(err) throw  err;

		if (result.length === 0) {
			res.render('./profile.hbs', {title : "Profile does not exist Please register!" });
		}

		var str = JSON.stringify(result);
		user = JSON.parse(str)[0];
		// console.log(user)
		res.render('./profile.hbs' , { 
			title : "Profile" , 
			roll_no : user.roll_no, 
			firstName : user.firstName,
			lastName : user.lastName,
			dob : user.DOB,
			gender : user.gender,
			dept : user.dept,
			email : user.email,
			phone : user.phone,
			year : user.year
			});

	});

});


// router.put('/profile/:table/:id', function (req, res, next) {
// 	const db = require('../dbconfig.js')
// 	var id = req.params.id:
// 	var table = req.params.table;

// 	var q = "UPDATE " + table 
// });


router.get('/confirm/:type/:id/:dob', function (req, res) {
	const db = require('../dbconfig.js')
	var type = req.params.type, 
		id = req.params.id,
		dob = req.params.dob;

	var q = 'SELECT firstName, lastName, dept_name, email, phone  FROM ' + type + ' , departments WHERE roll_no = \'' + id + '\' AND DOB = \'' + dob + '\' AND ' + type +'.dept_id = departments.dept_id';
	query = db.query(q, function (err, result, fields) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			var str = JSON.stringify(result);
			var json = JSON.parse(str);
			res.send({confirm : json})
		}
	});
});


passport.serializeUser(function(userId, done) {
	console.log("ser")
  done(null, userId);
});

passport.deserializeUser(function(userId, done) {
	console.log("deser - " + userId)
    done(null, userId);
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}


module.exports = router;