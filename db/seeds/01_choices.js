//insert dummy data for choices
exports.seed = function(knex, Promise) {
  return knex('choices').del()
  .then(function () {
    return knex('polls').select('id');
  })
  .then(function(rows) {
    return Promise.all([
      knex('choices').insert({poll_id: rows[0].id, title: 'movie1', description: 'romcom'}),
      knex('choices').insert({poll_id: rows[0].id, title: 'movie2', description: 'drama'}),
      knex('choices').insert({poll_id: rows[0].id, title: 'movie3', description: 'horror'}),
      knex('choices').insert({poll_id: rows[0].id, title: 'movie4', description: 'action'}),
    ])
  });
};