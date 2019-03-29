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

  // post request for form
  router.post("/:id", (req,res) => {
  //   knex('polls')
  //   .insert({ creator_email: req.body.email, timestamp: new Date(), submission_url_id: generateRandomString(), admin_url_id: generateRandomString() })
  //   knex('choices')
  //   .insert({ title: req.body.title, description: req.body.description})
  // // res.redirect...admin 
  })

  router.get('/', (req,res) => {

  knex('submission_choices').select('choice_id', 'rank').orderBy('choice_id').then(function(result) {
    const ranks = {};
    for (let row of result) {
      if (ranks[row.choice_id] === undefined) {
        ranks[row.choice_id] = [row.rank]
      } else {
        ranks[row.choice_id].push(row.rank)
      }
    }
    console.log(ranks);
  })
    // res.render('admin');
  })

  // lets the user update the poll
  router.get('/:id', (req,res) => {

  })

  return router;
}