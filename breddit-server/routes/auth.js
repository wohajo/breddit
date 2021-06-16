const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { pool } = require("../db-config");
const bcrypt = require("bcrypt");

router.post("/login", function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      if (info.status === 401) {
        return res.status(401).json({
          message: info.message,
        });
      } else {
        return res.status(500).json({
          message: info.message,
        });
      }
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user, process.env.SECRET, { expiresIn: "2d" });
      return res.json({ user, token });
    });
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  let error = null;
  const result = await pool.query("SELECT * FROM reddit_user");

  result.rows.forEach((user) => {
    if (req.body.username === user.nickname || req.body.email === user.email) {
      error = { message: "User with this username or email already exists" };
    }
  });

  if (
    req.body.username === "" ||
    req.body.email === "" ||
    req.body.password === "" ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password
  ) {
    error = { message: "Form not complete" };
  }

  if (!error) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await pool.query(
      "INSERT INTO reddit_user (nickname, activation_guid, activation_expire_date, password, email) VALUES ($1, NULL, NULL, $2, $3) RETURNING Id",
      [req.body.username, hashedPassword, req.body.email]
    );
    id = result.rows[0]["id"];
    res.json({ id: id });
  } else res.status(403).json(error);
});

module.exports = router;
