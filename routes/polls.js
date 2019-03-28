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
    knex('polls').insert({creator_email: data[0], title: data[1], timestamp: new Date(), 
      submission_url_id: generateRandomString(), admin_url_id: generateRandomString()})
      .returning('id')
      .then( function (id) {
        for (let i = 2; i < data.size; i++) {
          knex('choices').insert({creator_email: data[0], timestamp: new Date(), 
            poll_id: id[0], title: data[2]})
            .returning('id')
            .then( function (result) {
                console.log(result)
             })
        }
       })
  });

  return router;
}
