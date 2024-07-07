'use strict';

const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const app = require('../server'); // Update the path to your app
const Message = require('../app/models/message.model');

describe('Message Routes', function () {
    let messageId;

    before(function (done) {
        const newMessage = { text: 'Hello World' };
        request(app)
            .post('/api/v1/messages')
            .send(newMessage)
            .end(function (err, res) {
                if (err) return done(err);
                messageId = res.body._id;
                done();
            });
    });

    let sandbox;

    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should GET all messages', function (done) {
        request(app)
            .get('/api/v1/messages')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('should POST a new message', function (done) {
        const newMessage = { text: 'Hello World 2' };
        request(app)
            .post('/api/v1/messages')
            .send(newMessage)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('_id');
                expect(res.body.text).to.equal('Hello World 2');
                done();
            });
    });

    it('should return error for POST message without text', function (done) {
        const newMessage = {};
        request(app)
            .post('/api/v1/messages')
            .send(newMessage)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Text field is required');
                done();
            });
    });

    it('should return error for POST message with duplicate text', function (done) {
        const newMessage = { text: 'Hello World' };
        request(app)
            .post('/api/v1/messages')
            .send(newMessage)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Text must be unique');
                done();
            });
    });

    it('should GET a single message by ID', function (done) {
        request(app)
            .get(`/api/v1/messages/${messageId}`)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('_id', messageId);
                expect(res.body.text).to.equal('Hello World');
                done();
            });
    });

    it('should return 404 for GET non-existent message', function (done) {
        request(app)
            .get('/api/v1/messages/nonexistentid')
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Message not found');
                done();
            });
    });

    it('should return 400 for GET message with undefined ID', function (done) {
        request(app)
            .get('/api/v1/messages/undefined')
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'id field is required');
                done();
            });
    });

    it('should PUT (update) a message by ID', function (done) {
        const updatedMessage = { text: 'Updated Hello World' };
        request(app)
            .put(`/api/v1/messages/${messageId}`)
            .send(updatedMessage)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('_id', messageId);
                expect(res.body.text).to.equal('Updated Hello World');
                done();
            });
    });

    it('should return 404 for PUT (update) non-existent message', function (done) {
        const updatedMessage = { text: 'Updated Hello World' };
        request(app)
            .put('/api/v1/messages/nonexistentid')
            .send(updatedMessage)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Message not found');
                done();
            });
    });
    

    it('should return 400 for PUT (update) message without text', function (done) {
        request(app)
            .put(`/api/v1/messages/${messageId}`)
            .send({})
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Text field is required');
                done();
            });
    });

    it('should DELETE a message by ID', function (done) {
        request(app)
            .delete(`/api/v1/messages/${messageId}`)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'The message has been removed.');
                done();
            });
    });

    it('should return 404 for DELETE non-existent message', function (done) {
        request(app)
            .delete('/api/v1/messages/nonexistentid')
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Message not found');
                done();
            });
    });

    it('should return 400 for DELETE message with undefined ID', function (done) {
        request(app)
            .delete('/api/v1/messages/undefined')
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'id field is required');
                done();
            });
    });

    // Simulate database error for GET all messages
    it('should handle database error for GET all messages', function (done) {
        sandbox.stub(Message.prototype, 'find').yields(new Error('Database error'));
        request(app)
            .get('/api/v1/messages')
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Database error finding messages.');
                done();
            });
    });

    // Simulate database error for POST message
    it('should handle database error for POST message', function (done) {
        sandbox.stub(Message.prototype, 'insert').yields(new Error('Database error'));
        const newMessage = { text: 'Hello World' };
        request(app)
            .post('/api/v1/messages')
            .send(newMessage)
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Database error saving new message.');
                done();
            });
    });

    // Simulate database error for GET single message by ID
    it('should handle database error for GET single message by ID', function (done) {
        sandbox.stub(Message.prototype, 'findById').yields(new Error('Database error'));
        request(app)
            .get(`/api/v1/messages/${messageId}`)
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Database error finding the message.');
                done();
            });
    });

    // Simulate database error for PUT (update) message by ID
    it('should handle database error for PUT (update) message by ID', function (done) {
        sandbox.stub(Message.prototype, 'findByIdAndUpdate').yields(new Error('Database error'));
        const updatedMessage = { text: 'Updated Hello World' };
        request(app)
            .put(`/api/v1/messages/${messageId}`)
            .send(updatedMessage)
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Database error updating the message.');
                done();
            });
    });

    // Simulate database error for DELETE message by ID
    it('should handle database error for DELETE message by ID', function (done) {
        sandbox.stub(Message.prototype, 'findByIdWithoutProj').yields(null, { _id: messageId });
        sandbox.stub(Message.prototype, 'remove').yields(new Error('Database error'));
        request(app)
            .delete(`/api/v1/messages/${messageId}`)
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Database error deleting the message.');
                done();
            });
    });
});
