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

const getUsersWithNicknameLike = async (searchQuery) => {
  const res = await pool.query(
    `SELECT id, nickname from reddit_user WHERE nickname LIKE $1`,
    [`%${searchQuery}%`]
  );
  return res.rows;
};

exports.getUserById = getUserById;
exports.getUserByUsername = getUserByUsername;
exports.getUsersWithNicknameLike = getUsersWithNicknameLike;
