const { pool } = require("../db-config");
const {
  getAllSubredditsQuery,
  getUsersSubredditsQuery,
  getSubredditByNameQuery,
  getModeratedSubredditsQuery,
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

const getModBySubNameAndId = async (subName, userId) => {
  const res = await pool.query(
    `SELECT * FROM subreddit_moderator WHERE subreddit_id = $1 AND user_id = $2`,
    [subName, userId]
  );

  return res.rows[0];
};

const makeUserModerator = async (userId, subredditId) => {
  const res = await pool.query(
    `INSERT INTO subreddit_moderator (user_id, subreddit_id) VALUES ($1, $2) RETURNING id`,
    [userId, subredditId]
  );

  return res.rows[0];
};

const removeSubModerator = async (userId, subredditId) => {
  const res = await pool.query(
    `DELETE FROM subreddit_moderator su WHERE su.user_id = $1 AND su.subreddit_id = $2`,
    [userId, subredditId]
  );

  return res.rows[0];
};

const createSubreddit = async (name, description) => {
  const res = await pool.query(
    `INSERT INTO subreddit (name, description) VALUES ($1, $2) RETURNING id`,
    [name, description]
  );

  return res.rows[0];
};

const getSubModerators = async (subId) => {
  const res = await pool.query(
    `SELECT ru.id, ru.nickname FROM reddit_user ru JOIN subreddit_moderator su ON su.user_id = ru.id WHERE su.subreddit_id = $1`,
    [subId]
  );

  return res.rows;
};

const getModeratedSubreddits = async (userId) => {
  const res = await pool.query(getModeratedSubredditsQuery(), [userId]);

  return res.rows;
};

const updateSubDescription = async (newDesc, subId) => {
  const res = await pool.query(
    `UPDATE subreddit SET description = $1 WHERE id = $2`,
    [newDesc, subId]
  );

  return res.rows[0];
};

exports.removeUserFromSubreddit = removeUserFromSubreddit;
exports.joinUserToSubreddit = joinUserToSubreddit;
exports.getUsersSubreddits = getUsersSubreddits;
exports.getAllSubreddits = getAllSubreddits;
exports.getSubredditByName = getSubredditByName;
exports.makeUserModerator = makeUserModerator;
exports.createSubreddit = createSubreddit;
exports.getModeratedSubreddits = getModeratedSubreddits;
exports.getSubModerators = getSubModerators;
exports.removeSubModerator = removeSubModerator;
exports.getModBySubNameAndId = getModBySubNameAndId;
exports.updateSubDescription = updateSubDescription;
