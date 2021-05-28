const { pool } = require("../db-config");

const getUserByUsername = async (username) => {
  const res = await pool.query(
    `SELECT * from reddit_user WHERE nickname = $1`,
    [username]
  );
  if (res.rows.length > 0) return res.rows[0];
  else return null;
};
const getUserById = async (id) => {
  const res = await pool.query(`SELECT * from reddit_user WHERE id = $1`, [id]);
  if (res.rows.length > 0) return res.rows[0];
  else return null;
};

exports.getUserById = getUserById;
exports.getUserByUsername = getUserByUsername;
