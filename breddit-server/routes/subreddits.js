const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getAllSubreddits,
  getUsersSubreddits,
  joinUserToSubreddit,
} = require("../api/subreddit-api");
const {
  getUserIdFromToken,
  extractTokenFromHeader,
} = require("../utils/jwt-utils");

router.get("/", async (req, res) => {
  await getAllSubreddits()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));
    if (userId !== Number(req.params.userId))
      res
        .status(401)
        .json({ message: "User not authorized to perform this action" });
    else
      await getUsersSubreddits(req.params.userId)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Something went wrong" });
        });
  }
);

router.post(
  "/:subredditId/join",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));
    // TODO prevent from multiple joining
    await joinUserToSubreddit(req.params.subredditId, userId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  }
);

module.exports = router;