require('dotenv').config();

// Setup mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, dbName: "IssueTracker"
});

// Define mongoose schema and model
const issueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    open: { type: Boolean, required: true },
    status_text: String
});


const getIssues = (project, query, done) => {
    let Issue = mongoose.model('Issue', issueSchema, project);

    Issue.find(query, (err, data) => {
        if (err) return console.error(err);
        done(null, data);
    })
}

// Define functions to create and save new issues
const addIssue = (project, issue_title, issue_text, created_by, assigned_to, status_text, done) => {
    let Issue = mongoose.model('Issue', issueSchema, project);

    let document = new Issue({ issue_title, issue_text, created_by, assigned_to, status_text, created_on: new Date(), updated_on: new Date(), open: true })
    document.save((err, data) => {
        done(err, data);
    });
};

const updateIssue = (project, _id, updateBody, done) => {
    let Issue = mongoose.model('Issue', issueSchema, project);

    updateBody.updated_on = new Date();

    Issue.findByIdAndUpdate(_id, updateBody, { new: true }, (err, data) => {
        done(err, data);
    });
};

const deleteIssue = (project, _id, done) => {
    let Issue = mongoose.model('Issue', issueSchema, project);

    Issue.findByIdAndDelete(_id, (err, data) => {
        done(err, data);
    });

}

module.exports = {
    addIssue,
    updateIssue,
    deleteIssue,
    getIssues
};