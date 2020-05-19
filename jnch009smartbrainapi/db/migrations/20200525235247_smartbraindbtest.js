exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('name', 100).notNullable();
      table.text('email').notNullable().unique();
      table.integer('score').notNullable().defaultTo(0);
      table.timestamp('joined').notNullable().defaultTo(knex.fn.now());
    })
    .createTable('login', function (table) {
      table.increments('id');
      table.string('hash',100).notNullable();
      table.text('email').notNullable().unique();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users').dropTable('login');
};
