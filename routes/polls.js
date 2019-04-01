// create all routs or at least try to
"use strict";

const express = require('express');
const router = express.Router();
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

function CalculateSumPoints (numChoices) {
  let sumPoints = 0;
  let maxVote = numChoices;
  while (maxVote > 0) {
    sumPoints += maxVote;
    maxVote --;
  }
  return sumPoints;
}

function bordaCount(rankingArr, numChoices) {
  const sumOfPoints = CalculateSumPoints(numChoices)
  const percentagePerPoint = 100 / sumOfPoints;
  const points = [];
  for (let rank of rankingArr) {
    points.push(rank * percentagePerPoint);
  }
  return points.reduce((a, b) => a + b, 0) / points.length //finds final percentage
}

function sumRanks(rankingArr) {
  let finalRank = 0;
  for (let rank of rankingArr) {
    finalRank += rank;
  }
  return finalRank;
}

/**
 * Sort poll results by total points in descending order
 * @param {*} a 
 * @param {*} b 
 */
function sortPollResults(a, b) {
  if (a.points < b.points) {
    return 1;
  }
  if (a.points > b.points) {
    return -1;
  }
  return 0;
}

/**
 * Render email tempalte for each new poll submission
 * @param {string} name 
 * @param {string} adminURL 
 * @param {string} submissionURL 
 * @param {string} email 
 */
function renderNewPollSubmissionEmail(name, adminURL, submissionURL, email) {
  return `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>Decision Maker App</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"> <style>body{min-height: 100vh; color: #fff; font-family: "Lato", sans-serif;}section{background: #9D5C65}h1{font-size: 3em;}p{font-size: 1.3em;}button{background-color: #89817D; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;}.button{display: block; width: 115px; height: 25px; background: #89817D; padding: 15px 32px; text-align: center; border-radius: 5px; color: white; margin: 0 auto;}a{text-decoration: none; color: white; font-size: 1.2em;}a:hover, a:visited, a:link, a:active{text-decoration: none;}footer{background: #1A1B1D; color: #fff; font-size: 0.7em; padding: 1.5rem; text-align: center;}.container{margin: 0 auto; width: 500px; text-align: center; padding-top: 3rem; padding-bottom: 3rem;}</style></head><body> <main> <section> <div class="container"> <img src="http://hlhomes.ca/logos/icon_vertical.png"> <h1>${name} has made a poll submission!</h1> <p>Check to see how your poll is doing or share the poll with others! </p><p>Poll URL: http://localhost:8080/fill_poll.html?key=${submissionURL}</p><a class="button" href="http://localhost:8080/admin.html?key=${adminURL}">View Results</a> </div><footer> Note: This email was intended for ${email}. If you are not expecting this email, you can ignore it. </footer> </section> </main></body></html>`;
}

/**
 * Render email template for newly created polls
 * @param {string} adminURL 
 * @param {string} submissionURL 
 * @param {string} email 
 */
function renderNewPollCreatedEmail(adminURL, submissionURL, email) {
  return `<!DOCTYPE html><html><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>Decision Maker App</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"> <style>body{min-height: 100vh; color: #fff; font-family: "Lato", sans-serif;}section{background: #9D5C65}h1{font-size: 3em;}p{font-size: 1.3em;}button{background-color: #89817D; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;}.button{display: block; width: 115px; height: 25px; background: #89817D; padding: 15px 32px; text-align: center; border-radius: 5px; color: white; margin: 0 auto;}a{text-decoration: none; color: white; font-size: 1.2em;}a:hover, a:visited, a:link, a:active{text-decoration: none;}footer{background: #1A1B1D; color: #fff; font-size: 0.7em; padding: 1.5rem; text-align: center;}.container{margin: 0 auto; width: 500px; text-align: center; padding-top: 3rem; padding-bottom: 3rem;}</style></head><body> <main> <section> <div class="container"> <img src="http://hlhomes.ca/logos/icon_vertical.png"> <h1>Your poll has been created!</h1> <p>Check to see how your poll is doing or share the poll with others! </p><p>Poll URL: http://localhost:8080/fill_poll.html?key=${submissionURL}</p><a class="button" href="http://localhost:8080/admin.html?key=${adminURL}">View Results</a> </div><footer> Note: This email was intended for ${email}. If you are not expecting this email, you can ignore it. </footer> </section> </main></body></html>`;
}

module.exports = (knex) => {
  router.post("/new", (req, res) => {
    let data = req.body.data;
    let submission_url_id = generateRandomString();
    let admin_url_id = generateRandomString();
    knex('polls').insert({
      creator_email: data[0], title: data[1], timestamp: new Date(),
      submission_url_id: submission_url_id, admin_url_id: admin_url_id
    })
      .returning('id')
      .then((id) => {
        let choices_data = [];
        for (let i = 2; i < data.length; i += 2) {
          let choice = {};
          choice['poll_id'] = id[0];
          choice['title'] = data[i];
          choice['description'] = data[i + 1];
          choices_data.push(choice);
        }
        knex('choices').insert(choices_data)
          .then((result) => {
            const emailTempate = renderNewPollCreatedEmail(admin_url_id, submission_url_id, data[0]);
            let mailOptions = {
              from: `"Decision Maker App" <${email.email}>`, // sender address
              to: data[0], // list of receivers
              subject: "Thanks for creating a poll", // Subject line
              html: emailTempate
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
      .then(function (result) {
        if (result.length === 0) {
          res.status(404).send('Not Found');
          return;
        }
        knex.select('*').from('choices')
          .where('poll_id', '=', result[0].id)
          .then(function (choices) {
            res.send({ 'choices': choices, 'title': result[0].title });
          });
      });
  });

  router.get('/:id/admin', (req, res) => {
    let admin_id = req.params.id;
    knex.select('*').from('polls')
      .where('admin_url_id', '=', admin_id)
      .then(function (poll) {
        knex('polls').join('submissions', { 'polls.id': 'submissions.poll_id' })
          .select('*')
          .where('polls.admin_url_id', '=', admin_id)
          .then((results) => {
            // no submissions, return just the poll details
            if (results.length === 0) {
              res.send({ 'poll_details': poll[0] });
              return;
            }

            // code below will run only if there are 1 or more submissions
            knex('submission_choices').join('choices', { 'submission_choices.choice_id': 'choices.id' })
              .select('choice_id', 'rank', 'title', 'description')
              .where('choices.poll_id', '=', results[0].poll_id)
              .orderBy('choice_id')
              .then(function (result, error) {
                const ranks = {};
                let size = 0;

                for (let row of result) {
                  if (ranks[row.choice_id] === undefined) {
                    size++;
                    ranks[row.choice_id] = { 'title': row.title, 'description': row.description, 'rank': [row.rank] };
                  } else {
                    ranks[row.choice_id]["rank"].push(row.rank)
                  }
                }

                //takes the rank array of eavh movie and converts it into a final percentage based on the borda count algorithm
                const percentageRanks = [];
                const pollResults = [];

                for (let choice in ranks) {
                  let rankingArr = ranks[choice]['rank'];
                  percentageRanks.push({ 'title': ranks[choice]['title'], 'percentage': bordaCount(rankingArr, size) });
                  pollResults.push({ 'title': ranks[choice]['title'], 'description': ranks[choice]['description'], 'points': sumRanks(rankingArr) });
                }
                res.send({ 'chart_data': percentageRanks, 'poll_details': results[0], 'table_data': pollResults.sort(sortPollResults) });
              })
          })
      });
  })

  router.post('/:id/', (req, res) => {
    let name = req.body.name;
    let ranked_choices = req.body.choiceArr;
    let poll_id = req.body.poll_id;

    knex('submissions').insert({ 'poll_id': poll_id, 'timestamp': new Date(), 'name': name })
      .returning('id')
      .then((id) => {
        for (let choice of ranked_choices) {
          choice['submission_id'] = id[0];
        }
        knex('submission_choices').insert(ranked_choices)
          .then((result) => {
            knex.select('admin_url_id', 'submission_url_id', 'creator_email').from('polls')
              .where('id', '=', poll_id)
              .then((links) => {
                const emailTempate = renderNewPollSubmissionEmail(name, links[0].admin_url_id, links[0].submission_url_id, links[0].creator_email);
                let mailOptions = {
                  from: `"Decision Maker App" <${email.email}>`,
                  to: links[0].creator_email,
                  subject: `${name} submitted your poll!`,
                  html: emailTempate
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