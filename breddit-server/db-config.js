const { Pool } = require("pg");

const dotenv = require("dotenv").config({
  path: `${__dirname}/.env`,
});

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

const pool = new Pool({
  connectionString: connectionString,
});

module.exports = { pool };
