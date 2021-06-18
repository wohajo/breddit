const express = require("express");
const {
  getPost,
  addPost,
  getPosts,
  getCommentsForPosts,
  postCommentInPost,
  removeComment,
  getPostsFromSubreddit,
  getPageCountForAll,
  getPageCountForSubreddit,
  getBestPosts,
  getBestPostsFromSubreddit,
  getHotPosts,
  removePost,
  getPostsWithContentLike,
  getPostsWithTitleLike,
} = require("../api/post-api");
const {
  getUserIdFromToken,
  extractTokenFromHeader,
} = require("../utils/jwt-utils");

const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const { getModBySubNameAndId } = require("../api/subreddit-api");

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
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // TODO restrict if user is in sub
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));
    const f = req.file || null;

    if (f === null) {
      await addPost(
        req.body.title,
        req.body.content,
        null,
        req.body.video_url,
        new Date().toISOString(),
        req.body.subreddit_id,
        userId
      )
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    } else {
      await addPost(
        req.body.title,
        req.body.content,
        `${process.env.SERVER_HOST}/images/${req.file.filename}`,
        req.body.video_url,
        new Date().toISOString(),
        req.body.subreddit_id,
        userId
      )
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    }
  }
);

router.get("/", async (req, res) => {
  let limit = 10;
  let offset = req.query.page - 1 || 0;

  await getPosts(limit, offset * 10)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/search/contents/:query", async (req, res) => {
  if (req.params.query === "" || req.params.query === " ")
    res.status(400).json("Wrong query");
  else
    await getPostsWithContentLike(req.params.query)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.get("/search/title/:query", async (req, res) => {
  if (req.params.query === "" || req.params.query === " ")
    res.status(400).json("Wrong query");
  else
    await getPostsWithTitleLike(req.params.query)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.get("/best", async (req, res) => {
  let limit = 10;
  let offset = req.query.page - 1 || 0;

  await getBestPosts(limit, offset * 10)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/hot", async (req, res) => {
  let limit = 10;
  let offset = req.query.page - 1 || 0;

  await getHotPosts(limit, offset * 10)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/pageCount", async (req, res) => {
  await getPageCountForAll()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/subreddit/:subId", async (req, res) => {
  let limit = 10;
  let offset = req.query.page - 1 || 0;

  await getPostsFromSubreddit(req.params.subId, limit, offset * 10)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/subreddit/:subId/best", async (req, res) => {
  let limit = 10;
  let offset = req.query.page - 1 || 0;

  await getBestPostsFromSubreddit(req.params.subId, limit, offset * 10)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/subreddit/:subId/pageCount", async (req, res) => {
  await getPageCountForSubreddit(req.params.subId)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/:postId", async (req, res) => {
  await getPost(req.params.postId)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get("/:postId/comments", async (req, res) => {
  await getCommentsForPosts(req.params.postId)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.post(
  "/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));
    if (req.body.content.length === 0)
      res.status(400).json("Comment cannot be empty");
    else
      await postCommentInPost(req.params.postId, userId, req.body.content)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
  }
);

router.delete(
  "/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
    const modObj = await getModBySubNameAndId(req.query.subId, userIdToken);

    if (modObj !== undefined)
      await removeComment(req.params.postId, req.params.commentId)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    else res.status(401).json("You are not a moderator");
  }
);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let token = req.headers.authorization;
    const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
    const modObj = await getModBySubNameAndId(req.query.subId, userIdToken);

    if (modObj !== undefined)
      await removePost(req.params.postId)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    else res.status(401).json("You are not a moderator");
  }
);

module.exports = router;
