const { pool } = require("../db-config");
const {
  getPostQuery,
  getCommentsForPostsQuery,
} = require("../utils/query-utils");

const getPosts = async () => {
  const res = await pool.query(getPostQuery());
  return res.rows;
};

const getPost = async (postId) => {
  const res = await pool.query(`${getPostQuery()} WHERE p.id = ${postId}`);
  return res.rows[0];
};

const getCommentsForPosts = async (postId) => {
  const res = await pool.query(getCommentsForPostsQuery(postId));
  return res.rows;
};

exports.getPost = getPost;
exports.getPosts = getPosts;
exports.getCommentsForPosts = getCommentsForPosts;
