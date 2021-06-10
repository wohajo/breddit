const { pool } = require("../db-config");
const {
  getAllSubredditsQuery,
  getUsersSubredditsQuery,
  getSubredditByNameQuery,
} = require("../utils/query-utils");

const getAllSubreddits = async () => {
  const res = await pool.query(getAllSubredditsQuery());
  return res.rows;
};

const getUsersSubreddits = async (userId) => {
  const res = await pool.query(getUsersSubredditsQuery(), [userId]);
  return res.rows;
};

const joinUserToSubreddit = async (subredditId, userId) => {
  const res = await pool.query(
    `INSERT INTO SUBREDDIT_USER (user_id, subreddit_id) VALUES ($1, $2) RETURNING id`,
    [userId, subredditId]
  );

  return res.rows[0];
};

const removeUserFromSubreddit = async (subredditId, userId) => {
  const res = await pool.query(
    `DELETE FROM SUBREDDIT_USER WHERE user_id = $1 AND subreddit_id = $2`,
    [userId, subredditId]
  );

  return res.rows[0];
};

const getSubredditByName = async (subName) => {
  const res = await pool.query(getSubredditByNameQuery(), [subName]);

  return res.rows[0];
};

exports.removeUserFromSubreddit = removeUserFromSubreddit;
exports.joinUserToSubreddit = joinUserToSubreddit;
exports.getUsersSubreddits = getUsersSubreddits;
exports.getAllSubreddits = getAllSubreddits;
exports.getSubredditByName = getSubredditByName;
