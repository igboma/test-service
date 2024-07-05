'use strict';

const Message = require('../models/message.model');

const model = new Message();

exports.getMessages = function (req, res) {
    model.find({}, { text: 1, isPalindrome: 1 }, function (err, messages) {
        if (err) {
            res.status(500).send({
                message: 'Database error finding messages.'
            });
            return;
        }
        res.json(messages);
    });
};

exports.getSingleMessage = function (req, res) {
    model.findById(req.params.id, { text: 1, isPalindrome: 1 }, function (err, message) {
        if (!message || err) {
            res.status(404).send({
                message: 'Message not found'
            });
            return;
        }
        res.json(message);
    });
};

exports.postMessage = function (req, res) {
    model.insert(req.body, function (err, savedMessage) {
        if (err) {
            res.status(500).send({
                message: 'Database error saving new message.'
            });
            return;
        }
        res.json(savedMessage);
    });
};

exports.deleteMessage = function (req, res) {
    model.findByIdWithoutProj(req.params.id, function (err, message) {
        if (!message || err) {
            res.status(404).send({
                message: 'Message not found'
            });
            return;
        }
        model.remove(req.params.id, function (err) {
            if (err) {
                res.status(500).send({
                    message: 'Database error deleting message.'
                });
                return;
            }
            res.json({
                message: 'The message has been removed.'
            });
        });
    });
};