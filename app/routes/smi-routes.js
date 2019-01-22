var express = require('express');
var Song = require('../models/song'); // load the todo model

var router = express.Router();

router.route('/')
    .get(function(req, res) {
    	// use mongoose to get all songs in the database
        Song.find(function(err, songs) {
        	console.log('error' + err);
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(songs); // return all songs in JSON format
        });
    });

// expose the routes to our app with module.exports
module.exports = router; 
