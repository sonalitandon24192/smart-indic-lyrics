// load mongoose since we need it to define a model
var mongoose = require('mongoose');

var songSchema = mongoose.Schema(
    {
        text: { type: String, required: true },
        done: { type: Boolean, default: false }
    }, 
    { timestamps: true }
);

var Song = mongoose.model('song', songSchema);

module.exports = Song;
