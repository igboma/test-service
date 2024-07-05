const Datastore = require('@seald-io/nedb');
const db = new Datastore();

class Message {
	constructor() {
		db.ensureIndex({ fieldName: 'text', unique: true }, function (err) {
			if (err)
				console.log(err);
		});
	}

	find(query = {}, projection = {}, callback) {
        db.find(query, projection, callback);
    }

	findById(id, projection = {}, callback) {
        db.findOne({ _id: id }, projection, callback);
    }

	findByIdWithoutProj(id, callback) {
        db.findOne({ _id: id }, callback);
    }

	save(id, update, callback) {
        db.update({ _id: id }, update, {}, callback);
    }

	remove(id, callback) {
        db.remove({ _id: id }, {}, callback);
    }

	insert(data, callback) {
        data.isPalindrome = this.isTextPalindrome(data.text);
        db.insert(data, callback);
    }

	isTextPalindrome(text) {
		text = text || "";
		const cleanedText = text.replace(/[^A-Za-z0-9]/g, "").toLowerCase(); // remove all non alphanumric character
		return cleanedText === cleanedText.split("").reverse().join("");
	}
}

module.exports = Message;