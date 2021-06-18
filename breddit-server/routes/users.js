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
const {
  getNewPostsForUser,
  getBestPostsForUser,
  getHotPostsForUser,
  getPostsForUserPageCount,
} = require("../api/post-api");

router.post(
  "/changePassword",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    if (
      req.body.newPassword === "" ||
      !req.body.newPassword ||
      !req.body.userId
    )
      res.status(400).json("Missing new password or user ID");
    else {
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const userId = req.body.userId;
      await pool.query("UPDATE reddit_user SET password = $1 WHERE id = $2", [
        newHashedPassword,
        userId,
      ]);
      res.status(200).json("Password changed");
    }
  }
);

router.get("/search/:searchQuery", async (req, res) => {
  await getUsersWithNicknameLike(req.params.searchQuery)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
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
        res.status(500).json("Something went wrong");
      });
  }
);

router.get(
  "/mycommunites/new",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
    let limit = 10;
    let offset = req.query.page - 1 || 0;

    await getNewPostsForUser(userIdToken, limit, offset * 10)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
  }
);

router.get(
  "/mycommunites/best",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
    let limit = 10;
    let offset = req.query.page - 1 || 0;

    await getBestPostsForUser(userIdToken, limit, offset * 10)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
  }
);

router.get(
  "/mycommunites/hot",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
    let limit = 10;
    let offset = req.query.page - 1 || 0;

    await getHotPostsForUser(userIdToken, limit, offset * 10)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
  }
);

router.get(
  "/mycommunites/pageCount",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));

    await getPostsForUserPageCount(userIdToken)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
  }
);

module.exports = router;
