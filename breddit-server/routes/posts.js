const express = require("express");
const { getPost, getPosts, getCommentsForPosts } = require("../api/post-api");
const router = express.Router();

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

module.exports = router;
