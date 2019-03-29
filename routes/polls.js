// create all routs or at least try to
"use strict";

const express = require('express');
const router  = express.Router();
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const email = require('../email_settings');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email.modules.email,
    pass: email.modules.password
  }
});

function generateRandomString() {
  return crypto.randomBytes(3).toString('hex');
}

module.exports = (knex) => {
  router.post("/new", (req, res) => {
    let data = req.body.data;
    let submission_url_id = generateRandomString();
    let admin_url_id = generateRandomString();
    knex('polls').insert({creator_email: data[0], title: data[1], timestamp: new Date(), 
      submission_url_id: submission_url_id, admin_url_id: admin_url_id})
      .returning('id')
      .then( (id) => {
        let choices_data = [];
        for (let i = 2; i < data.length; i+=2) {
          let choice = {};
          choice['poll_id'] = id[0];
          choice['title'] = data[i];
          choice['description'] = data[i+1];
          choices_data.push(choice);
        }
        knex('choices').insert(choices_data)
          .then((result) => {
            let html = `<div><ul><li>Share link: http://localhost:8080/fill_poll.html?key=${submission_url_id}</li>
            <li>Admin link: http://localhost:8080/admin.html?adminkey=${admin_url_id}&key=${submission_url_id}</li></ul></div>`;
            let mailOptions = {
              from: '"Decision Maker App" <dcode416@gmail.com>', // sender address
              to: data[0], // list of receivers
              subject: "Thanks for creating a poll", // Subject line
              html: html // html body
            };
          
            transporter.sendMail(mailOptions, (err, info) => {
              res.send();
            })
          });
       })
  });

  router.get('/:id/', (req, res) => {
    let id = req.params.id;
    knex.select('id').from('polls')
    .where('submission_url_id', '=', id)
    .then(function(result) {
      knex.select('*').from('choices')
      .where('poll_id', '=', result[0].id)
      .then(function(choices){
        res.send(choices);
      });
    });
  });

  router.post('/:id/', (req, res) => {
    let name = req.body.name;
    let ranked_choices = req.body.choiceArr;
    let poll_id = req.body.poll_id;
    knex('submissions').insert({'poll_id': poll_id, 'timestamp': new Date(), 'name': name})
      .returning('id')
      .then( (id) => {
        for(let choice of ranked_choices) {
          choice['submission_id'] = id[0];
        }
        knex('submission_choices').insert(ranked_choices)
          .then( (result) => {
            res.send();
          });
       })
  });

  return router;
}