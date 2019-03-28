exports.seed = function(knex, Promise) {
  return knex('polls').del()
  .then(function() {
    return Promise.all([
      knex('polls').insert({creator_email: 'example@example.com', timestamp: '11/11/2019 03:30:55', submission_url_id: '8Uy9Ol', admin_url_id: 'pUlNf4'})
    ])
  });
};

// insert dummy data into all other tables