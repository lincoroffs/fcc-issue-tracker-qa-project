'use strict';
const myDb = require('../connection.js');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

      myDb.getIssues(project, req.query, (_, data) => {
        res.json(data)
      });

    })

    .post(function (req, res) {
      let project = req.params.project;

      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to || '';
      let status_text = req.body.status_text || '';

      myDb.addIssue(project, issue_title, issue_text, created_by, assigned_to, status_text, (err, data) => {
        if (err) {
          return res.json({ error: 'required field(s) missing' })
        }
        res.json({
          _id: data._id, issue_title: data.issue_title, issue_text: data.issue_text, created_on: data.created_on, updated_on: data.updated_on,
          created_by: data.created_by, assigned_to: data.assigned_to, open: data.open, status_text: data.status_text
        })
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      let body = req.body;
      let _id = req.body._id;

      if (_id == "" || !_id) {
        return res.json({ error: 'missing _id' })
      }

      function clean(myObj) {
        Object.keys(myObj).forEach((key) => (myObj[key] == '') && delete myObj[key]);
        return myObj
      }

      let updateBody = clean(body);
      delete updateBody['_id'];

      if (Object.keys(updateBody).length < 1) {
        return res.json({ error: 'no update field(s) sent', _id })
      }

      myDb.updateIssue(project, _id, updateBody, (err, data) => {
        if (!data || err) {
          return res.json({ error: 'could not update', _id })
        }
        res.json({ result: 'successfully updated', _id })
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let _id = req.body._id;

      if (_id == "" || !_id) {
        return res.json({ error: 'missing _id' })
      }

      myDb.deleteIssue(project, _id, (err, data) => {
        if (!data || err) {
          return res.json({ error: 'could not delete', _id })
        }
        res.json({ result: "successfully deleted", _id })
      })
    });
};