const { pool } = require("../db-config");
const {
  addPostQuery,
  getPostQuery,
  getPostsQuery,
  getCommentsForPostsQuery,
  postCommentQuery,
  getPostsFromSubredditQuery,
  getBestPostsQuery,
  getBestPostsFromSubredditQuery,
  getHotPostsQuery,
  getHotFromSubredditQuery,
  getNewestPostsFromUserSubsQuery,
  getBestPostsFromUserSubsQuery,
  getHotPostsFromUserSubsQuery,
  getPostCountFromUsersSubsQuery,
} = require("../utils/query-utils");

const getPosts = async (limit, offset) => {
  const res = await pool.query(getPostsQuery(), [limit, offset]);
  return res.rows;
};

const getBestPosts = async (limit, offset) => {
  const res = await pool.query(getBestPostsQuery(), [limit, offset]);
  return res.rows;
};

const getHotPosts = async (limit, offset) => {
  const res = await pool.query(getHotPostsQuery(), [limit, offset]);
  return res.rows;
};

const getPostsForUserPageCount = async (userId) => {
  const res = await pool.query(getPostCountFromUsersSubsQuery(), [userId]);
  return res.rows[0];
};

const getNewPostsForUser = async (userId, limit, offset) => {
  const res = await pool.query(getNewestPostsFromUserSubsQuery(), [
    userId,
    limit,
    offset,
  ]);
  return res.rows;
};

const getBestPostsForUser = async (userId, limit, offset) => {
  const res = await pool.query(getBestPostsFromUserSubsQuery(), [
    userId,
    limit,
    offset,
  ]);
  return res.rows;
};

const getHotPostsForUser = async (userId, limit, offset) => {
  const res = await pool.query(getHotPostsFromUserSubsQuery(), [
    userId,
    limit,
    offset,
  ]);
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

const getBestPostsFromSubreddit = async (subId, limit, offset) => {
  const res = await pool.query(getBestPostsFromSubredditQuery(), [
    subId,
    limit,
    offset,
  ]);
  return res.rows;
};

const getHotPostsFromSubreddit = async (subId, limit, offset) => {
  const res = await pool.query(getHotFromSubredditQuery(), [
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

const getPageCountForAll = async () => {
  const res = await pool.query(
    `SELECT ((COUNT(id)/10) + 1) as page_count FROM post`
  );
  return res.rows[0];
};

const getPageCountForSubreddit = async (subId) => {
  const res = await pool.query(
    `SELECT ((COUNT(id)/10) + 1) as page_count FROM post WHERE post.subreddit_id = $1`,
    [subId]
  );
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

const removeComment = async (postId, commentId) => {
  const res = await pool.query(
    `DELETE FROM comment WHERE post_id = $1 AND id = $2`,
    [postId, commentId]
  );
  return res.rows[0];
};

const removePost = async (postId) => {
  const res = await pool.query(`DELETE FROM post WHERE id = $1`, [postId]);
  return res.rows[0];
};

exports.addPost = addPost;
exports.getPost = getPost;
exports.getPosts = getPosts;
exports.getCommentsForPosts = getCommentsForPosts;
exports.postCommentInPost = postCommentInPost;
exports.getPostsFromSubreddit = getPostsFromSubreddit;
exports.getPageCountForAll = getPageCountForAll;
exports.getPageCountForSubreddit = getPageCountForSubreddit;
exports.getBestPosts = getBestPosts;
exports.getBestPostsFromSubreddit = getBestPostsFromSubreddit;
exports.getHotPosts = getHotPosts;
exports.getHotPostsFromSubreddit = getHotPostsFromSubreddit;
exports.removeComment = removeComment;
exports.removePost = removePost;

exports.getHotPostsForUser = getHotPostsForUser;
exports.getNewPostsForUser = getNewPostsForUser;
exports.getBestPostsForUser = getBestPostsForUser;
exports.getPostsForUserPageCount = getPostsForUserPageCount;
