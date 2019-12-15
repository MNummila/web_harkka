var Message = require('../models/message');
var User = require('../models/user');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

exports.index = function(req, res) {
	res.render('index',{title: 'Microblog exercise.'});
};

// Display all messages
exports.message_list = function(req, res, next) {

	Message.find({}, 'content user')
		.populate('user')
		.exec(function(err, list_messages){
			if (err) {return next(err);}
			//Successful, render
			res.render('message_list', {title: 'List of all messages.',message_list: list_messages});
	});
};

// Display Message create form on GET.
exports.message_create_get = function(req, res, next) {

	async.parallel({
		users: function(callback){
			User.find(callback);
		},
	},function(err, results){
		if(err) {return next(err);}
		res.render('message_form', {title: 'Post message.',users: results.users});
		
	});
    
};

// Handle Message create on POST.
exports.message_create_post = [
	
	//Validate fields
	body('content').trim().isLength({ min: 1,max:100 }).withMessage('Message length between 1 & 100 characters.'),

	//sanitize fields
	sanitizeBody('content').escape(),

	//process
	(req, res, next) => {

		const errors = validationResult(req);

		var message = new Message(
				{
					content: req.body.content,
					user: req.body.user
				});
		//there are errors
		if (!errors.isEmpty()) {

			async.parallel({
				users: function(callback){
					User.find(callback);
				},
			},function(err, results){
				if(err){return next(err);}
				res.render('message_form',{title: 'Create message', message:req.body, users: results.users ,errors:errors.array()});
			});
			
			return;
		}
		else{

			message.save(function(err){
				if(err) {return next(err); }

				res.redirect(message.url);
			});
    	}
    }
];