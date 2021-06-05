const { pool } = require("../db-config");
const {
  getAllSubredditsQuery,
  getUsersSubredditsQuery,
} = require("../utils/query-utils");

const getAllSubreddits = async () => {
  const res = await pool.query(getAllSubredditsQuery());
  return res.rows;
};

const getUsersSubreddits = async (userId) => {
  const res = await pool.query(getUsersSubredditsQuery(userId));
  return res.rows;
};

const joinUserToSubreddit = async (subredditId, userId) => {
  const res = await pool.query(
    `INSERT INTO SUBREDDIT_USER (user_id, subreddit_id) VALUES ($1, $2) RETURNING id`,
    [userId, subredditId]
  );

  return res.rows[0];
};

exports.joinUserToSubreddit = joinUserToSubreddit;
exports.getUsersSubreddits = getUsersSubreddits;
exports.getAllSubreddits = getAllSubreddits;
