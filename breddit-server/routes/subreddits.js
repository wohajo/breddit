const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getAllSubreddits,
  getUsersSubreddits,
  joinUserToSubreddit,
  removeUserFromSubreddit,
  getSubredditByName,
  makeUserModerator,
  createSubreddit,
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

router.get("/:subName", async (req, res) => {
  await getSubredditByName(req.params.subName)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
});

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

router.delete(
  "/:subredditId/leave",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // TODO delete user from mods aswell
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));
    await removeUserFromSubreddit(req.params.subredditId, userId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let subObject = {};
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));
    if ((await getSubredditByName(req.body.name)) !== undefined)
      res.status(409).json({ message: "This subreddit already exists" });
    else if (req.body.name.length === 0 || req.body.description.length === 0)
      res
        .status(403)
        .json({ message: "You must provide name and description" });
    else {
      await createSubreddit(req.body.name, req.body.description)
        .then((result) => {
          subObject = result;
          return makeUserModerator(userId, result.id);
        })
        .then(() => joinUserToSubreddit(subObject.id, userId))
        .then(() => res.status(200).json(subObject))
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Something went wrong" });
        });
    }
  }
);

module.exports = router;
