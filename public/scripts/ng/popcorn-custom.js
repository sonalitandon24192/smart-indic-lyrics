// var express = require('express');
// var Todo = require('../models/todo'); // load the todo model
//
// var router = express.Router();
// router.route('/')
//     .get(function(req, res) {
//         // use mongoose to get all todos in the database
//         Todo.find(function(err, todos) {
//           console.log(todos);
//
//             // if there is an error retrieving, send the error. nothing after res.send(err) will execute
//             if (err)
//                 res.send(err);
//
//             res.json(todos); // return all todos in JSON format
//         });
//     });

document.addEventListener("DOMContentLoaded", function () {
var pop = Popcorn("#greeting");

var wordTimes = {
"w1": { start: 1, end: 1.5 },
"w2": { start: 1.9, end: 2.5 },
"w3": { start: 3, end: 4 }
};

$.each(wordTimes, function(id, time) {
pop.footnote({
start: time.start,
end: time.end,
text: '',
target: id,
effect: "applyclass",
applyclass: "selected"
});
});
}, false);
