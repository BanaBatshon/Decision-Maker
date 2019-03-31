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
    console.log(rows);
    const [submission_id, choice_id] = rows;

    // const submission_choices = [];
    // submission_id.forEach(submission => {
    //   choice_id.forEach(choice => {
    //     submission_choices.push({
    //       submission_id: submission.id,
    //       choice_id: choice.id,
    //       rank: Math.floor(Math.random() * (choice_id.length) + 1)
    //     });
    //   });
    // });

    // console.log(submission_choices);

    // return knex('submission_choices').insert(submission_choices);


    return Promise.all([
      knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][0].id, rank:1}),
      knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][1].id, rank:2}),
      knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][2].id, rank:3}),
      // knex('submission_choices').insert({submission_id: rows[0][0].id, choice_id: rows[1][3].id, rank:4}),
      knex('submission_choices').insert({submission_id: rows[0][1].id, choice_id: rows[1][0].id, rank:2}),
      knex('submission_choices').insert({submission_id: rows[0][1].id, choice_id: rows[1][1].id, rank:1}),
      knex('submission_choices').insert({submission_id: rows[0][1].id, choice_id: rows[1][2].id, rank:3}),
      // knex('submission_choices').insert({submission_id: rows[0][1].id, choice_id: rows[1][3].id, rank:1}),
      knex('submission_choices').insert({submission_id: rows[0][2].id, choice_id: rows[1][0].id, rank:1}),
      knex('submission_choices').insert({submission_id: rows[0][2].id, choice_id: rows[1][1].id, rank:3}),
      knex('submission_choices').insert({submission_id: rows[0][2].id, choice_id: rows[1][2].id, rank:2}),
      // knex('submission_choices').insert({submission_id: rows[0][2].id, choice_id: rows[1][3].id, rank:4})
    ])
  })
}