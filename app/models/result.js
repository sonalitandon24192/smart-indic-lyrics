// load mongoose since we need it to define a model
var mongoose = require('mongoose');

var resultSchema = mongoose.Schema({
        text: { type: String, required: false },
        done: { type: Boolean, default: false }
    }, 
    { timestamps: true });

var Result = mongoose.model('result', resultSchema);

module.exports = Result;