const { pool } = require("../db-config");

const isUserAlreadyInSub = async (userId, subId) => {
  const res = await pool.query(
    `SELECT * FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2`,
    [userId, subId]
  );
  return res.rows[0];
};

const getSubIdOfPost = async (postId) => {
  const res = await pool.query(`SELECT subreddit_id FROM post WHERE id = $1`, [
    postId,
  ]);
  return res.rows[0];
};

exports.isUserAlreadyInSub = isUserAlreadyInSub;
exports.getSubIdOfPost = getSubIdOfPost;
