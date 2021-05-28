const { pool } = require("../db-config");

const getPosts = async () => {
  const res = await pool.query("SELECT * from post");
  return res.rows;
};

exports.getPosts = getPosts;
