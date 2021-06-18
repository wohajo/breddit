const { pool } = require("../db-config");

const isUserAlreadyInSub = async (userId, subId) => {
  const res = await pool.query(
    `SELECT * FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2`,
    [userId, subId]
  );
  return res.rows[0];
};

exports.isUserAlreadyInSub = isUserAlreadyInSub;
