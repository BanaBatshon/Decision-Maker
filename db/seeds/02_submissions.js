//insert dummy data for submissions
exports.seed = function(knex, Promise) {
  return knex('submissions').del()
  .then(function () {
    return knex('polls').select('id');
  })
  .then(function(rows) {
    return Promise.all([
      knex('submissions').insert({poll_id: rows[0].id, timestamp: '10/07/1996', name: 'Bana'}),
      knex('submissions').insert({poll_id: rows[0].id, timestamp: '11/07/1996', name: 'Gurpreet'}),
      knex('submissions').insert({poll_id: rows[0].id, timestamp: '12/07/1996', name: 'Andrew'}),
    ])
  });
};