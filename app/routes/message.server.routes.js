'use strict';

const express = require('express');
const router = express.Router();

const message = require('../controllers/message.server.controller');
router.get('/messages', message.getMessages);
router.post('/messages/', message.postMessage);
router.get('/messages/:id', message.getSingleMessage);
router.put('/messages/:id', message.putMessage);
router.delete('/messages/:id', message.deleteMessage);

module.exports = router;