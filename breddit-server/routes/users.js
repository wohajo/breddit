const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { pool } = require("../db-config");
const { getModeratedSubreddits } = require("../api/subreddit-api");
const {
  getUserIdFromToken,
  extractTokenFromHeader,
} = require("../utils/jwt-utils");
const { getUsersWithNicknameLike } = require("../api/user-api");

router.post(
  "/changePassword",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    if (
      req.body.newPassword === "" ||
      !req.body.newPassword ||
      !req.body.userId
    )
      res.status(400).json({ message: "Missing new password or user ID" });
    else {
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const userId = req.body.userId;
      await pool.query("UPDATE reddit_user SET password = $1 WHERE id = $2", [
        newHashedPassword,
        userId,
      ]);
      res.status(200).json({ message: "Password changed" });
    }
  }
);

router.get("/search/:searchQuery", async (req, res) => {
  await getUsersWithNicknameLike(req.params.searchQuery)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.get(
  "/moderated",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));
    await getModeratedSubreddits(userId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  }
);

module.exports = router;
