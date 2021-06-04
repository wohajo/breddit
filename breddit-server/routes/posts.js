const express = require("express");
const {
  getPost,
  getPosts,
  getCommentsForPosts,
  postCommentInPost,
} = require("../api/post-api");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { getUserIdFromToken } = require("../utils/jwt-utils");

router.get("/", async (req, res) => {
  await getPosts()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.get("/:postId", async (req, res) => {
  await getPost(req.params.postId)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.get("/:postId/comments", async (req, res) => {
  await getCommentsForPosts(req.params.postId)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    });
});

router.post(
  "/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(token.replace("Bearer ", ""));
    await postCommentInPost(req.params.postId, userId, req.body.content)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  }
);

module.exports = router;
