//insert dummy data for submission_choices
exports.seed = function(knex, Promise) {
  return knex('submission_choices').del()
  .then(function () {
    return Promise.all([
      knex('submissions').select('id'),
      knex('choices').select('id')
    ])
  })
  .then(function(rows) {
    return Promise.all([
      knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][0].id, rank:0}),
      knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][0].id, rank:1}),
      knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][0].id, rank:2}),
      knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][0].id, rank:3})
    ])
  })
}