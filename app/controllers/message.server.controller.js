'use strict';

const Message = require('../models/message.model');
const messages = require('../helper/contants'); // Adjust the path as necessary
const model = new Message();

exports.getMessages = function (req, res) {
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10
    const offset = parseInt(req.query.offset) || 0; // Default offset to 0
    const sortBy = req.query.sortBy || 'dateAdded'; // Default sort field
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Sort order: 1 for ascending, -1 for descending

    const query = {};
    const projection = { text: 1, isPalindrome: 1 };

    model.find(query, projection, { skip: offset, limit: limit, sort: { [sortBy]: sortOrder } }, function (err, messageResponse) {
        if (err) {
            console.error(err);
            res.status(500).send({ message: messages.databaseErrorFindingMessages });
            return;
        }
        res.json(messageResponse);
    });
};

exports.getSingleMessage = function (req, res) {
    const id = req.params.id;
    if (!id || id === 'undefined') {
        return res.status(400).send({ message: messages.idFieldRequired });
    }

    model.findById(id, { text: 1, isPalindrome: 1 }, function (err, message) {
        if (err) {
            console.error(err);
            res.status(500).send({ message: messages.databaseErrorFindingMessage });
            return;
        }
        if (!message) {
            res.status(404).send({ message: messages.messageNotFound });
            return;
        }
        res.json(message);
    });
};

exports.postMessage = function (req, res) {
    if (!req.body.text) {
        return res.status(400).send({ message: messages.textFieldRequired });
    }

    model.insert(req.body, function (err, savedMessage) {
        if (err) {
            console.error(err);
            if (err.errorType === 'uniqueViolated') {
                res.status(400).send({ message: messages.textMustBeUnique });
            } else {
                res.status(500).send({ message: messages.databaseErrorSavingMessage });
            }
            return;
        }
        res.json(savedMessage);
    });
};

exports.putMessage = function (req, res) {
    if (!req.params.id || req.params.id === 'undefined') {
        return res.status(400).send({ message: messages.idFieldRequired });
    }
    if (!req.body.text) {
        return res.status(400).send({ message: messages.textFieldRequired });
    }

    model.findByIdAndUpdate(req.params.id, { text: req.body.text }, { new: true }, function (err, updatedMessage) {
        if (err) {
            console.error(err);
            res.status(500).send({ message: messages.databaseErrorUpdatingMessage });
            return;
        }
        if (!updatedMessage) {
            res.status(404).send({ message: messages.messageNotFound });
            return;
        }
        res.json(updatedMessage);
    });
};

exports.deleteMessage = function (req, res) {
    if (!req.params.id || req.params.id === 'undefined') {
        return res.status(400).send({ message: messages.idFieldRequired });
    }

    model.findByIdWithoutProj(req.params.id, function (err, message) {
        if (err) {
            console.error(err);
            res.status(500).send({ message: messages.databaseErrorFindingMessage });
            return;
        }

        if (!message) {
            res.status(404).send({ message: messages.messageNotFound });
            return;
        }

        model.remove(req.params.id, function (err) {
            if (err) {
                console.error(err);
                res.status(500).send({ message: messages.databaseErrorDeletingMessage });
                return;
            }
            res.json({ message: messages.messageRemoved });
        });
    });
};
