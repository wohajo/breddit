const { pool } = require("../db-config");
const {
  addPostQuery,
  getPostQuery,
  getPostsQuery,
  getCommentsForPostsQuery,
  postCommentQuery,
  getPostsFromSubredditQuery,
} = require("../utils/query-utils");

const getPosts = async (limit, offset) => {
  const res = await pool.query(getPostsQuery(), [limit, offset]);
  return res.rows;
};

const getPostsFromSubreddit = async (subId, limit, offset) => {
  const res = await pool.query(getPostsFromSubredditQuery(), [
    subId,
    limit,
    offset,
  ]);
  return res.rows;
};

const addPost = async (
  title,
  content,
  image_path,
  video_url,
  creation_date,
  subreddit_id,
  user_id
) => {
  const res = await pool.query(`${addPostQuery()}`, [
    title,
    content,
    image_path,
    video_url,
    creation_date,
    subreddit_id,
    user_id,
  ]);
  return res.rows[0];
};

const getPost = async (postId) => {
  const res = await pool.query(getPostQuery(), [postId]);
  return res.rows[0];
};

const getCommentsForPosts = async (postId) => {
  const res = await pool.query(getCommentsForPostsQuery(), [postId]);
  return res.rows;
};

const postCommentInPost = async (postId, userId, content) => {
  const res = await pool.query(postCommentQuery(), [
    content,
    null,
    userId,
    postId,
  ]);
  return res.rows[0];
};

exports.addPost = addPost;
exports.getPost = getPost;
exports.getPosts = getPosts;
exports.getCommentsForPosts = getCommentsForPosts;
exports.postCommentInPost = postCommentInPost;
exports.getPostsFromSubreddit = getPostsFromSubreddit;
