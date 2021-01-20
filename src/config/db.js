const { Pool } = require('pg');

module.exports = new Pool({
  user: 'postgres',
  password: '7199208',
  host: 'localhost',
  port: 5433,
  database: 'launchstoredb',
});
