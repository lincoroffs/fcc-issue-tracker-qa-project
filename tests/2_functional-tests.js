const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    let _id;

    this.timeout(5000);
    test('Create an issue with every field', function (done) {
        chai.request(server).post('/api/issues/apitest').send({
            issue_title: "test title",
            issue_text: "test issue text",
            created_by: "test suite",
            assigned_to: "no one",
            status_text: "testing"
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.issue_title, "test title", "Response body.issue_title should be correct");
                assert.equal(res.body.issue_text, "test issue text", "Response body.issue_text should be correct");
                assert.equal(res.body.created_by, "test suite", "Response body.created_by should be correct");
                assert.equal(res.body.assigned_to, "no one", "Response body.assigned_to should be correct");
                assert.equal(res.body.status_text, "testing", "Response body.status_text should be correct");

                done();
            })
    });

    test('Create an issue with only required fields', function (done) {
        chai.request(server).post('/api/issues/apitest').send({
            issue_title: "test title",
            issue_text: "test issue text",
            created_by: "test suite"
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.issue_title, "test title", "Response body.issue_title should be correct");
                assert.equal(res.body.issue_text, "test issue text", "Response body.issue_text should be correct");
                assert.equal(res.body.created_by, "test suite", "Response body.created_by should be correct");
                assert.equal(res.body.assigned_to, "", "Response body.assigned_to should be correct");
                assert.equal(res.body.status_text, "", "Response body.status_text should be correct");

                done();
            })
    });

    test('Create an issue with missing required fields', function (done) {
        chai.request(server).post('/api/issues/apitest').send({
            issue_title: "test title",
            issue_text: "test issue text"
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'required field(s) missing', "Response body.error should be correct");

                done();
            })
    });

    test('View issues on a project', function (done) {
        chai.request(server).get('/api/issues/apitest')
            .end((err, res) => {
                _id = res.body[0]._id;
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");

                done();
            })
    });

    test('View issues on a project with one filter', function (done) {
        chai.request(server).get('/api/issues/apitest').query({ open: true })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");

                done();
            })
    });

    test('View issues on a project with multiple filters', function (done) {
        chai.request(server).get('/api/issues/apitest').query({ open: true, issue_title: "test title" })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");

                done();
            })
    });

    test('Update one field on an issue', function (done) {
        chai.request(server).put('/api/issues/apitest').send({
            issue_title: "test title1",
            _id
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.result, 'successfully updated', "Response body.result should be successfull");
                assert.equal(res.body._id, _id, "Response body._id should be correct");
                done();
            })
    });

    test('Update multiple fields on an issue', function (done) {
        chai.request(server).put('/api/issues/apitest').send({
            issue_title: "test title1",
            issue_text: "test issue text1",
            _id
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.result, 'successfully updated', "Response body.result should be successfull");
                assert.equal(res.body._id, _id, "Response body._id should be correct");
                done();
            })
    });

    test('Update an issue with missing _id', function (done) {
        chai.request(server).put('/api/issues/apitest').send({
            issue_title: "test title1"
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'missing _id', "Response body.error should be missing _id");
                done();
            })
    });

    test('Update an issue with no fields to update', function (done) {
        chai.request(server).put('/api/issues/apitest').send({
            _id
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'no update field(s) sent', "Response body.error should be 'no update field(s) sent'");
                assert.equal(res.body._id, _id, "Response body._id should be correct");
                done();
            })
    });


    test('Update an issue with an invalid _id', function (done) {
        chai.request(server).put('/api/issues/apitest').send({
            issue_title: "test title1",
            _id: _id + "1"
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'could not update', "Response body.error should be 'could not update'");
                assert.equal(res.body._id, _id + "1", "Response body._id should be correct");
                done();
            })
    });


    test('Delete an issue', function (done) {
        chai.request(server).delete('/api/issues/apitest').send({
            _id
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.result, "successfully deleted", "Response body.result should be successfull");
                assert.equal(res.body._id, _id, "Response body._id should be correct");
                done();
            })
    });

    test('Delete an issue with an invalid _id', function (done) {
        chai.request(server).delete('/api/issues/apitest').send({
            _id: _id + "1"
        })
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'could not delete', "Response body.error should be 'could not delete'");
                assert.equal(res.body._id, _id + "1", "Response body._id should be correct");
                done();
            })
    });

    test('Delete an issue with missing _id', function (done) {
        chai.request(server).delete('/api/issues/apitest')
            .end((err, res) => {
                assert.equal(res.status, 200, "Response status should be 200");
                assert.equal(res.type, "application/json", "Response type should be 'application/json'");
                assert.equal(res.body.error, 'missing _id', "Response body.error should be missing _id");
                done();
            })
    });
});