
exports.up = function(knex, Promise) {
  return knex.schema.createTable('submission_choices', function (table) {
    table.increments();
    table.bigInteger('submission_id').references('id').inTable('submissions');
    table.bigInteger('choice_id').references('id').inTable('choices');
    table.integer('rank');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('submission_choices');
};
