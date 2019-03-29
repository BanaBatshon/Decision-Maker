// create all routs or at least try to
"use strict";

const express = require('express');
const router  = express.Router();
const crypto = require('crypto');

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
      .then( function (id) {
        let choices_data = [];
        for (let i = 2; i < data.length; i+=2) {
          let choice = {};
          choice['poll_id'] = id[0];
          choice['title'] = data[i];
          choice['description'] = data[i+1];
          choices_data.push(choice);
        }
        knex('choices').insert(choices_data)
          .then( function (result) {
            res.send([submission_url_id, admin_url_id]);
          });
       })
  });

  router.get('/:id/', (req, res) => {
    let id = req.params.id;
    knex.select('id', 'title').from('polls')
    .where('submission_url_id', '=', id)
    .then(function(result) {
      knex.select('*').from('choices')
      .where('poll_id', '=', result[0].id)
      .then(function(choices){
        res.send({'choices': choices, 'title': result[0].title});
      });
    });
  });

  router.post('/:id/', (req, res) => {
    let name = req.body.name;
    let ranked_choices = req.body.choiceArr;
    let poll_id = req.body.poll_id;
    knex('submissions').insert({'poll_id': poll_id, 'timestamp': new Date(), 'name': name})
      .returning('id')
      .then( function (id) {
        for(let choice of ranked_choices) {
          choice['submission_id'] = id[0];
        }
        knex('submission_choices').insert(ranked_choices)
          .then( function (result) {
            res.send();
          });
       })
  });

  return router;
}