var express = require('express');
var router = express.Router();

// Require controller modules
var message_controller = require('../controllers/messageController');
var user_controller = require('../controllers/userController');

// Message routes

// GET home page
router.get('/', message_controller.index);

// GET request for list of all messages
router.get('/messages', message_controller.message_list);

// GET request for creating a message. NOTE This must come before routes that display Book (uses id).
router.get('/message/create', message_controller.message_create_get);

// POST request for creating message.
router.post('/message/create', message_controller.message_create_post);


// User routes

// GET request for creating User
router.get('/user/create', user_controller.user_create_get);

// POST request for creating User.
router.post('/user/create', user_controller.user_create_post);

// GET request for list of all Users.
router.get('/users', user_controller.user_list);

// GET request for one User.
router.get('/user/:id', user_controller.user_detail);

module.exports = router;