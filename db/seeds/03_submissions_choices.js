//insert dummy data for submission_choices
exports.seed = function(knex, Promise) {
  return knex('submission_choices').del()
  .then(function () {
    return Promise.all([
      knex('submissions').select('id'),
      knex('choices').select('id','title')
    ])
  })
  .then(function(rows) {
    const [submission_id, choice_id] = rows;
    const submission_choices = [];
    submission_id.forEach(submission => {
      const options = [];
      while(options.length < choice_id.length) {
        let rank = (Math.floor(Math.random() * choice_id.length) + 1)
        if (options.indexOf(rank) === -1) {
          options.push( rank );
        }
      }
      let i = 0;
      choice_id.forEach(choice => {
        submission_choices.push({
          submission_id: submission.id,
          choice_id: choice.id,
          rank: options[i]
        });
        i ++;
      });
    });
    
    return knex('submission_choices').insert(submission_choices);

  })
  .then(function() {
    return Promise.all(
      knex('submission_choices').select('choice_id', 'rank').orderBy('choice_id')
    )
  })
  .then( function(result) {
    console.log(result);
})
}