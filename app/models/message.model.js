const Datastore = require('@seald-io/nedb');
const db = new Datastore();

class Message {
	constructor() {
		db.ensureIndex({ fieldName: 'text', unique: true }, function (err) {
			if (err)
				console.log(err);
		});
	}

	find(query = {}, projection = {}, options = {}, callback) {
		let cursor = db.find(query, projection);
		if (options.sort) {
			cursor = cursor.sort(options.sort);
		}
		if (options.skip) {
			cursor = cursor.skip(options.skip);
		}
		if (options.limit) {
			cursor = cursor.limit(options.limit);
		}
		cursor.exec(callback);
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
		data.dateAdded = new Date();
		db.insert(data, callback);
	}

	findByIdAndUpdate(id, update, options, callback) {
		if (options.new) {
			db.update({ _id: id }, { $set: update }, {}, (err, numReplaced) => {
				if (err ) {
					return callback(err);
				};
				if(numReplaced === 0){
					callback(null, numReplaced);
				}
				else{
					db.findOne({ _id: id }, {}, callback);
				}
			});
		} else {
			db.update({ _id: id }, { $set: update }, {}, callback);
		}
	}

	isTextPalindrome(text) {
		text = text || "";
		const cleanedText = text.replace(/[^A-Za-z0-9]/g, "").toLowerCase(); // remove all non alphanumric character
		return cleanedText === cleanedText.split("").reverse().join("");
	}
}

module.exports = Message;