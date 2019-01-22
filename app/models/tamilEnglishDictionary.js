var mongoose = require('mongoose');

var vocabSchema = mongoose.Schema({
	nativeWord: {type: String, required: true},
	englishMeaning: { type: String, required: false },
	partOfSpeech: { type: String, required:false},
	sentences: { type: Array, required: false },
	image: {type: String, required: false}
});

var Vocab = mongoose.model('tamilenglishdict', vocabSchema);

module.exports = Vocab;