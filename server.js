var express = require('express');
var request = require('request');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var mustache = require('mustache');
var Twitter = require('twitter');
var passport = require('passport')
	, TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');
var connect = require('connect')
var dotenv = require('dotenv');
var mongoose = require('mongoose');
dotenv.load();
var User = require('./models/user-model')

var testUser = new User({
	email: 'mina@gmail.com',
	password: '123'
})


var connection = mongoose.connect('mongodb://localhost:testDB',
	function(err){
		if (err) throw err;
		console.log('Successful connection!');
	});

testUser.save();

console.log(testUser);

// var app = connect();

// var client = new Twitter({
// 	consumer_key: '',
// 	consumer_secret: '',
// 	access_token_key: '',
// 	access_token_secret: ''
// });

app.use(session({ secret: 'SECRET' }));

var consumer_key = process.env.TWITTER_CONSUMER_KEY
var consumer_secret = process.env.TWITTER_CONSUMER_SECRET

passport.use(new TwitterStrategy({
	consumerKey: consumer_key,
	consumerSecret: consumer_secret,
	callbackURL: "http://127.0.0.1:3000/oauth_callback_route"
},
// function(token, tokenSecret, profile, done){
// 	done(null, profile);
// }
function(token, tokenSecret, profile, done) {
	User.findOne({
		'twitter.id_str': profile.id
	}, function(err, user) {
		if (err) { 
			return done(err); 
		}
		done(null, user);
	});
}
));

app.get('/', function (req, res){
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/oauth_callback_route', passport.authenticate('twitter', { successRedirect: '/views/show.html',
																	failureRedirect: '/views/index.html'}));

// app.get('/tweets', function (req, response){
// 	request.get('https://api.twitter.com/oauth/request_token', function(error, res, body){
// 		console.log('inside request')
// 		if (!error && response.statusCode == 200) {
//       		// var info = JSON.parse(body);
//       		console.log(body)
//   		}else{
//   			console.log(error)
//   		}
// 	});
// });


// app.get('/tweets', function (req, res){
// 	request('https://api.twitter.com/oauth/request_token', function);
// 	res.send(body);
// 	var parsedBody = JSON.parse(body); 

// 	fs.readFile(__dirname + '/views/show.html', function(err, data){
// 		var htmlString = data.toString();
// 		debugger
// 		var generatedHTML = mustache.render(htmlString, {'tweets': parsedBody.data});
// 		res.send(generatedHTML);
// 	});
// });

app.listen(3000);