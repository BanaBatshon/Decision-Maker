## Project Description

The purpose of this project is to create a decision maker application. The application allows the user to create a poll with limitless options (titles and descriptions), and share it with multiple people via email.

Those poeople then recieve and email allowing them to vote by dragging and dropping the options and ranking them from most to least favourable. 

When each person is done voting, the admin user gets notified via email. The admin can then view the results which are desplayed as a table as well as a pie chart. This application is mobile friendly!

## Project Setup

1. Create your own empty repo on GitHub
2. Clone this repository (do not fork)
  - Suggestion: When cloning, specify a different folder name that is relevant to your project
3. Remove the git remote: `git remote rm origin`
4. Add a remote for your origin: `git remote add origin <your github repo URL>`
5. Push to the new origin: `git push -u origin master`
6. Verify that the skeleton code now shows up in your repo on GitHub

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run gulp build inorder to be able to add style to trhe app
6. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
7. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`

## Dependencies

- Node 8.9.4
- NPM 3.8.x
- Ejs 2.4.1
- Jquery 3.3.1
- Bootstrap 4.3.1
- Canvas 2.4.1
- Node-sass 0.9.8
- Knex 0.11.7
- Postgres (Database) 6.0.2
