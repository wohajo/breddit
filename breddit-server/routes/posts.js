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
  getVotesForPost,
  voteDownForPost,
  voteUpForPost,
  deleteVoteFromPost,
} = require("../api/post-api");
const {
  getUserIdFromToken,
  extractTokenFromHeader,
} = require("../utils/jwt-utils");

const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const { getModBySubNameAndId } = require("../api/subreddit-api");
const { isUserAlreadyInSub } = require("../utils/api-utils");

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
    let token = req.headers.authorization;
    const userId = getUserIdFromToken(extractTokenFromHeader(token));

    if (
      !req.body.title ||
      req.body.title === "" ||
      !req.body.subreddit_id ||
      !req.body.subreddit_id === "" ||
      isNaN(req.body.subreddit_id)
    )
      res.status(400).json("Form not complete");

    const f = req.file || null;
    const isInSub = await isUserAlreadyInSub(userId, req.body.subreddit_id);

    if (!isInSub) {
      res.status(400).json("User not in subreddit");
    } else if (f === null) {
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
  if (isNaN(req.params.subId))
    res.status(400).json("Subreddit ID must be a number");
  else
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
  if (isNaN(req.params.subId))
    res.status(400).json("Subreddit ID must be a number");
  else
    await getBestPostsFromSubreddit(req.params.subId, limit, offset * 10)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.get("/subreddit/:subId/pageCount", async (req, res) => {
  if (isNaN(req.params.subId))
    res.status(400).json("Subreddit ID must be a number");
  else
    await getPageCountForSubreddit(req.params.subId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.get("/:postId", async (req, res) => {
  if (isNaN(req.params.postId))
    res.status(400).json("Post ID must be a number");
  else
    await getPost(req.params.postId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.get("/:postId/comments", async (req, res) => {
  if (isNaN(req.params.postId))
    res.status(400).json("Post ID must be a number");
  else
    await getCommentsForPosts(req.params.postId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.get("/:postId/votes", async (req, res) => {
  if (isNaN(req.params.postId))
    res.status(400).json("Post ID must be a number");
  else
    await getVotesForPost(req.params.postId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.post(
  "/:postId/votes/up",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.postId))
      res.status(400).json("Post ID must be a number");
    else {
      let token = req.headers.authorization;
      const userId = getUserIdFromToken(extractTokenFromHeader(token));
      await deleteVoteFromPost(req.params.postId, userId).catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
      await voteUpForPost(req.params.postId, userId)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    }
  }
);

router.post(
  "/:postId/votes/down",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.postId))
      res.status(400).json("Post ID must be a number");
    else {
      let token = req.headers.authorization;
      const userId = getUserIdFromToken(extractTokenFromHeader(token));
      await deleteVoteFromPost(req.params.postId, userId).catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
      await voteDownForPost(req.params.postId, userId)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    }
  }
);

router.delete(
  "/:postId/votes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.postId))
      res.status(400).json("Post ID must be a number");
    else {
      let token = req.headers.authorization;
      const userId = getUserIdFromToken(extractTokenFromHeader(token));
      await deleteVoteFromPost(req.params.postId, userId)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    }
  }
);

router.post(
  "/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.postId))
      res.status(400).json("Post ID must be a number");
    else {
      let token = req.headers.authorization;
      const userId = getUserIdFromToken(extractTokenFromHeader(token));
      if (!req.body.content || req.body.content.length === 0)
        res.status(400).json("Comment cannot be empty");
      else
        await postCommentInPost(req.params.postId, userId, req.body.content)
          .then((result) => res.status(200).json(result))
          .catch((err) => {
            console.log(err);
            res.status(500).json("Something went wrong");
          });
    }
  }
);

router.delete(
  "/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.postId) || isNaN(req.params.commentId))
      res.status(400).json("Post and comment ID must be a number");
    else {
      let token = req.headers.authorization;
      const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));

      if (!req.query.subId) res.status(400).json("Form not complete");

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
  }
);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.postId))
      res.status(400).json("Post ID must be a number");
    else {
      let token = req.headers.authorization;
      const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));

      if (!req.query.subId) res.status(400).json("Form not complete");

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
  }
);

module.exports = router;
