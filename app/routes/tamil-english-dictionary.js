var express = require('express');
var Vocab = require('../models/tamilEnglishDictionary');

var router = express.Router();

router.route('/')
    .get(function(req, res) {
        // use mongoose to get all songs in the database
        Vocab.find(function(err, meanings) {
            console.log('error' + err);
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            console.log('meanings' + meanings);
            res.json(meanings); // return all songs in JSON format
        });
    });

// expose the routes to our app with module.exports
module.exports = router; 
