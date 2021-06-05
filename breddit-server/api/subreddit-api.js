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

exports.getUsersSubreddits = getUsersSubreddits;
exports.getAllSubreddits = getAllSubreddits;
