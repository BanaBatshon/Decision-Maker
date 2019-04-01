# Decision Maker

## Project Description

Decision Maker is a web app that helps groups of friends to vote on a preferred choice (using ranked voting), for example: "What movie should we see next Friday?".

A user can create a poll with limiteless choices. When a poll is finished being createed, the user is given two links: an administrative link (which lets them access the results) and a submission link (which the user sends to their friends). The links are also sent to the poll creator via email.

When a user visits the submission link, they enter their name and will then rank the choices (by drag and drop) and then submits the poll. Each time a submission is received, the creator is notified with an email.

The results are ranked using the Borda Count method: <https://en.wikipedia.org/wiki/Borda_count/>

## Final Product

### Home Page
---

!["Screenshot of Home page"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/homepage.png)


### How It Works Section
---

!["Screenshot of How It Works section"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/how-it-works-section.png)


### Create Poll
---

!["Screenshot of Create Poll"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/create-poll-page.png)


### Poll Creation Email
---

!["Screenshot of Poll Creation Email"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/poll-creation-email.png)


### Poll Submision 
---

!["Screenshot of Poll Submission"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/poll-submission-page.png)


### Post Poll Submission
---

!["Screenshot of Post Poll Submission"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/poll-post-submission-page.png)


### New Poll Response Submitted Email
---

!["Screenshot of New Poll Response Submitted Email"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/new-poll-response-submitted-email.png)


### Poll Details
---

!["Screenshot of Poll Details"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/poll-details-page.png)


### Poll Details Chart
---

!["Screenshot of Poll Details Chart"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/poll-details-chart.png)


### Error Page
---

!["Screenshot of Error Page"](https://github.com/BanaBatshon/Decision-Maker/blob/master/docs/error-page.png)


## Getting Started

1. Clone this repository: `git clone git@github.com:BanaBatshon/Decision-Maker.git`
2. Install dependencies: `npm i`
3. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
4. Create the `email_settings.js` by using `email_settings.js.example` as a reference: `cp email_settings.js.example example_settings.js`
- Email settings is for the server to send emails from the email account saved in `email_settings.js`
- Use a gmail account for the email settings. You must turn on "Less Secure" in the gmail security settings. <https://support.google.com/accounts/answer/6010255?hl=en>
5. Install gulp globally `npm install -g gulp`
6. Compiles SASS to CSS and optimize JS files: `gulp build`
7. Run migrations to create database and tables: `npm run knex migrate:latest`
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`

## Dependencies

- body-parser
- bootstrap
- canvas
- del
- dotenv
- express
- jquery
- knex
- knex-logger
- morgan
- node-sass-middleware"
- nodemailer
- pg
- popper.js

## Dev Dependencies

- stream-exhaust
- true-case-path
- browser-sync
- gulp
- gulp-rename
- gulp-sass
- gulp-terser
- nodemon

## Database

- postgreSQL


