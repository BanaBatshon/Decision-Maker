exports.up = function(knex, Promise) {
  return knex.schema.createTable('polls', function (table) {
    table.increments();
    table.string('creator_email');
    table.date('timestamp');
    table.string('title');
    table.string('submission_url_id');
    table.string('admin_url_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('polls');
};
