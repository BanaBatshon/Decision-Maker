exports.up = function(knex, Promise) {
  return knex.schema.createTable('choices', function (table) {
    table.increments();
    table.bigInteger('poll_id').references('id').inTable('polls').onDelete('cascade');
    table.string('title');
    table.string('description');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('choices');
};