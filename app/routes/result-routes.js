 var express = require('express');
 var Result = require('../models/result');

 var router = express.Router();

 router.route('/')
   .post(function(req, res) {
     // create a todo, information comes from AJAX request from Angular
     console.log('POST - todo object (req.body):', req.body);

     Result.create(req.body, function(err, todo) {
       if (err)
         res.send(err);
     });
   });

module.exports = router; 
