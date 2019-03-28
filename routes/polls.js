"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/new", (req, res) => {
    let data = req.body.data;
    knex('polls').insert({creator_email: data[0], timestamp: new Date(), 
      submission_url_id: 'rand0m', admin_url_id: 'rand0m'})
      .returning('id')
      .then( function (id) {
        knex('choices').insert({creator_email: data[0], timestamp: new Date(), 
          poll_id: id[0], title: data[2]})
          .returning('id')
          .then( function (result) {
              console.log(result)
           })
       })
  });

  return router;
}
