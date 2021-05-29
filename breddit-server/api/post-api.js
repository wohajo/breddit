const { pool } = require("../db-config");
const { getPostQuery } = require("../utils/query-utils");

const getPosts = async () => {
  const res = await pool.query(getPostQuery());
  return res.rows;
};

exports.getPosts = getPosts;
