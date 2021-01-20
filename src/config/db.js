const { Pool } = require('pg');

module.exports = new Pool({
  user: '',
  password: '',
  host: 'localhost',
  port: 5433,
  database: 'launchstoredb',
});
