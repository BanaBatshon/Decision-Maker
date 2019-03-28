exports.up = function(knex, Promise) {
  return knex.schema.createTable('submissions', function (table) {
    table.increments();
    table.bigInteger('poll_id').references('id').inTable('polls').onDelete('cascade');
    table.date('timestamp');
    table.string('name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('submissions');
};