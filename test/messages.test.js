'use strict';

const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../server'); // Update the path to your app

describe('Message Routes', function () {
    let messageId;

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
        const newMessage = { text: 'Hello World' };
        request(app)
            .post('/api/v1/messages')
            .send(newMessage)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('_id');
                expect(res.body.text).to.equal('Hello World');
                messageId = res.body._id;
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

    it('should return 404 for non-existent message', function (done) {
        request(app)
            .get('/api/v1/messages/nonexistentid')
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Message not found');
                done();
            });
    });
});
