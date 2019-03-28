// create all routs or at least try to
"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // renders the home page
  router.get("/", (req, res) => {
    res.redirect('homepage')
  })
  
  //renders the create poll page
  router.get("/polls/new", (req, res) => {
    res.redirect('polls.html')
  });

  // post request for form
  router.post("/polls/id", (req,res) => {
  //   knex('polls')
  //   .insert({ creator_email: req.body.email, timestamp: new Date(), submission_url_id: generateRandomString(), admin_url_id: generateRandomString() })
  //   knex('choices')
  //   .insert({ title: req.body.title, description: req.body.description})
  // // res.redirect...admin 
  })

  router.get('/polls/id/admin/id', (req,res) => {
    // res.render('admin');
  })

  // lets the user update the poll
  router.get('/polls/id', (req,res) => {

  })

  return router;
}