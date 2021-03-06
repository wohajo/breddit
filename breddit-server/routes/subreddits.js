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
  getSubModerators,
  getModBySubNameAndId,
  removeSubModerator,
  updateSubDescription,
  getSubsWithNameLike,
} = require("../api/subreddit-api");
const {
  getUserIdFromToken,
  extractTokenFromHeader,
} = require("../utils/jwt-utils");
const { isUserAlreadyInSub } = require("../utils/api-utils");

router.get("/", async (req, res) => {
  await getAllSubreddits()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.userId))
      res.status(400).json("User ID must be a number");
    else {
      let token = req.headers.authorization;
      const userId = getUserIdFromToken(extractTokenFromHeader(token));
      if (userId !== Number(req.params.userId))
        res.status(401).json("User not authorized to perform this action");
      else
        await getUsersSubreddits(req.params.userId)
          .then((result) => res.status(200).json(result))
          .catch((err) => {
            console.log(err);
            res.status(500).json("Something went wrong");
          });
    }
  }
);

router.get("/:subName", async (req, res) => {
  await getSubredditByName(req.params.subName)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json("Something went wrong");
    });
});

router.put(
  "/:subId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.subId))
      res.status(400).json("Subreddit ID must be a number");
    else {
      let token = req.headers.authorization;
      const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
      const modObj = await getModBySubNameAndId(req.params.subId, userIdToken);

      if (!req.body.description || req.body.description !== "")
        if (modObj !== undefined)
          await updateSubDescription(req.body.description, req.params.subId)
            .then((result) => res.status(200).json(result))
            .catch((err) => {
              console.log(err);
              res.status(500).json("Something went wrong");
            });
        else res.status(401).json("You are not a moderator");
    }
  }
);

router.get("/:subId/moderators", async (req, res) => {
  if (isNaN(req.params.subId))
    res.status(400).json("Subreddit ID must be a number");
  else
    await getSubModerators(req.params.subId)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.get("/search/:query", async (req, res) => {
  if (req.params.query === "" || req.params.query === " ")
    res.status(400).json("Wrong query");
  else
    await getSubsWithNameLike(req.params.query)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });
});

router.post(
  "/:subId/moderators/add/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.subId) || isNaN(req.params.userId))
      res.status(400).json("Subreddit and user ID must be a number");
    else {
      let token = req.headers.authorization;
      const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
      const modObj = await getModBySubNameAndId(req.params.subId, userIdToken);

      if (modObj !== undefined) {
        const newModObj = await getModBySubNameAndId(
          req.params.subId,
          req.params.userId
        );
        if (newModObj === undefined) {
          await makeUserModerator(req.params.userId, req.params.subId)
            .then((result) => res.status(200).json(result))
            .catch((err) => {
              console.log(err);
              res.status(500).json("Something went wrong");
            });
        } else {
          res.status(403).json("User is already a moderator");
        }
      } else {
        res.status(401).json("You are not a moderator");
      }
    }
  }
);

router.delete(
  "/:subId/moderators/remove/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.subId) || isNaN(req.params.userId))
      res.status(400).json("Subreddit and user ID must be a number");
    else {
      let token = req.headers.authorization;
      const userIdToken = getUserIdFromToken(extractTokenFromHeader(token));
      const modObj = await getModBySubNameAndId(req.params.subId, userIdToken);

      if (modObj !== undefined)
        await removeSubModerator(req.params.userId, req.params.subId)
          .then((result) => res.status(200).json(result))
          .catch((err) => {
            console.log(err);
            res.status(500).json("Something went wrong");
          });
      else res.status(401).json("You are not a moderator");
    }
  }
);

router.post(
  "/:subredditId/join",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.subredditId))
      res.status(400).json("Subreddit ID must be a number");
    else {
      let token = req.headers.authorization;
      const userId = getUserIdFromToken(extractTokenFromHeader(token));
      const isInSub = await isUserAlreadyInSub(userId, req.params.subredditId);

      if (isInSub) res.status(400).json("User already in subreddit");
      else
        await joinUserToSubreddit(req.params.subredditId, userId)
          .then((result) => res.status(200).json(result))
          .catch((err) => {
            console.log(err);
            res.status(500).json("Something went wrong");
          });
    }
  }
);

router.delete(
  "/:subredditId/leave",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (isNaN(req.params.subredditId))
      res.status(400).json("Subreddit ID must be a number");
    else {
      let token = req.headers.authorization;
      const userId = getUserIdFromToken(extractTokenFromHeader(token));

      await removeSubModerator(userId, req.params.subredditId).catch((err) => {
        console.log(err);
        res.status(500).json("Something went wrong");
      });

      await removeUserFromSubreddit(req.params.subredditId, userId)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(err);
          res.status(500).json("Something went wrong");
        });
    }
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
      res.status(409).json("This subreddit already exists");
    else if (
      !req.body.name ||
      !req.body.description ||
      req.body.name.length === 0 ||
      req.body.description.length === 0
    )
      res.status(403).json("You must provide name and description");
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
          res.status(500).json("Something went wrong");
        });
    }
  }
);

module.exports = router;
