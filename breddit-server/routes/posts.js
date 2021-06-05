const express = require("express");
const {
  getPost,
  addPost,
  getPosts,
  getCommentsForPosts,
  postCommentInPost,
} = require("../api/post-api");
const { getUserIdFromToken } = require("../utils/jwt-utils");

const router = express.Router();
const passport = require("passport");
const multer = require("multer");

// TODO restrict size
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploaded");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("image"),
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // TODO reststric if user is in sub
    // TODO check if video or file empty
    await addPost(
      req.body.title,
      req.body.content,
      req.file.filename,
      req.body.video_url,
      Date.now(),
      req.body.subreddit_id,
      req.body.user_id
    )
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      });
  }
);

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
