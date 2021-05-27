const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { pool } = require("../db-config");
const bcrypt = require("bcrypt");

router.post("/login", function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log(info);
      return res.status(400).json({
        message: info.message,
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, "your_jwt_secret", { expiresIn: "2d" });
      return res.json({ user, token });
    });
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  let error = null;
  const result = await pool.query("SELECT * FROM users");

  result.rows.forEach((user) => {
    if (req.body.username === user.username) {
      error = { message: "User with this username already exists" };
    }
  });

  if (!error) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING Id",
      [req.body.username, hashedPassword]
    );
    id = result.rows[0]["id"];
    res.json({ id: id });
  } else res.status(403).json(error);
});

module.exports = router;
