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
    user: email.email,
    pass: email.password
  }
});

function generateRandomString() {
  return crypto.randomBytes(3).toString('hex');
}

function bordaCount (rankingArr, numChoices) {
  const percentagePerPoint = (numChoices * (numChoices + 1)) / 2
  const points = [];
  for (let rank of rankingArr) {
    points.push(((numChoices + 1) - rank) * percentagePerPoint)
  }
  return points.reduce((a,b) => a + b, 0) / points.length //finds final percentage
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
            <li>Admin link: http://localhost:8080/admin.html?key=${admin_url_id}</li></ul></div>`;
            let mailOptions = {
              from: '"Decision Maker App" <dcode416@gmail.com>', // sender address
              to: data[0], // list of receivers
              subject: "Thanks for creating a poll", // Subject line
              html: html // html body
            };
          
            transporter.sendMail(mailOptions, (err, info) => {
              res.send([admin_url_id, submission_url_id]);
            })
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

  router.get('/:id/admin', (req,res) => {
    let admin_id = req.params.id;
    knex('submissions').join('polls', {'polls.id': 'submissions.poll_id'})
    .select('submissions.id')
    .where('polls.admin_url_id', '=', admin_id)
    .then((id) => {
      knex('submission_choices').join('choices', {'submission_choices.choice_id': 'choices.id'})
      .select('choice_id', 'rank', 'title')
      .where('submission_choices.submission_id', '=', id[0].id)
      .orderBy('title')
      .then(function(result) {
        const ranks = {};
        let size = 0;
        for (let row of result) {
          if (ranks[row.title] === undefined) {
            size ++;
            ranks[row.title] = [row.rank];
          } else {
            ranks[row.title].push(row.rank)
          }
        }
        //takes the rank array of eavh movie and converts it into a final percentage based on the borda count algorithm
        const percentageRanks = {};
        for (let choice in ranks) {
          let value = ranks[choice];
            percentageRanks[choice] = bordaCount(value, size);
        }
        res.send(percentageRanks);
      })
    });
  })

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
            knex.select('admin_url_id', 'submission_url_id', 'creator_email').from('polls')
            .where('id', '=', poll_id)
            .then((links) => {
              let html = `<div><p>${name} has completed your poll!</p><br>
              <p>Heres the link to your results/admin page: http://localhost:8080/admin.html?adminkey=${links[0].admin_url_id}&key=${links[0].submission_url_id}</p></div>`;
              let mailOptions = {
                from: '"Decision Maker App" <dcode416@gmail.com>', // sender address
                to: links[0].creator_email, // list of receivers
                subject: `${name} submitted your poll!`, // Subject line
                html: html // html body
              };
              transporter.sendMail(mailOptions, (err, info) => {
                res.send();
              })
            })
          });
       })
  });

  return router;
}