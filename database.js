const pgp = require('pg-promise')();
const QueryResultError = pgp.errors.QueryResultError;
const qrec = pgp.errors.queryResultErrorCode;
const { pguser, pgpass } = require('./config.js');
const db = pgp({
  user: pguser,
  host: 'localhost',
  database: 'postgres',
  password: pgpass,
  port: 5432,
  error: (err, e) => {
    if (err instanceof QueryResultError) {
        // A query returned unexpected number of records, and thus rejected;

        // we can check the error code, if we want specifics:
        if(err.code === qrec.noData) {
            // expected some data, but received none;
            console.log('Expected data but received none.')
        }

        // If you write QueryResultError into the console,
        // you will get a nicely formatted output.

        console.log(err);

        // See also: err, e.query, e.params, etc.
    }
  }
});

module.exports = db;