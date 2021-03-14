require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT_DATABASE,
  database: process.env.DATABASE,
});

module.exports = pool;
