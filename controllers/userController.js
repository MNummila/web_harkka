var User = require('../models/user');
var Message = require('../models/message');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

// Display all Users
exports.user_list = function(req, res, next){

	User.find({}, 'username')
		.exec(function(err ,list_users){
			if (err) {return next(err);}
			//Successful, render
			res.render('user_list', {title: 'List of all users.', user_list: list_users});
		});
};

// Display User create form on GET.
exports.user_create_get = function(req, res, next) {
    res.render('user_form',{title: 'Create user.'});
};

// Handle User create on POST.
exports.user_create_post = [
	
	//Validate fields
	body('username').trim().isLength({ min: 1,max:20 }).withMessage('Username length between 1 & 20 characters.')
		.isAlphanumeric().withMessage('Username has non-alphanumeric characters.'),

	//sanitize fields
	sanitizeBody('username').escape(),

	//process
	(req, res, next) => {

		const errors = validationResult(req);
		//there are errors
		if (!errors.isEmpty()) {
			res.render('user_form',{title: 'Create user', user:req.body,errors:errors.array()});
			return;
		}
		else{
			var user = new User(
				{
					username: req.body.username
				});
			user.save(function(err){
				if(err) {return next(err); }

				res.redirect(user.url);
			});
    	}
    }
];

// Display detail page for a specific user
exports.user_detail = function(req, res, next) {

    async.parallel({
        user: function(callback) {

            User.findById(req.params.id)
              .exec(callback);
        },
        user_messages: function(callback){
        	Message.find({'user': req.params.id},'content')
        	.exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user_detail', { title: 'User', user: results.user, user_messages: results.user_messages } );
    });

};