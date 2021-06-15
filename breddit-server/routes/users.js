const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { pool } = require("../db-config");

router.post(
  "/changePassword",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    if (
      req.body.newPassword === "" ||
      !req.body.newPassword ||
      !req.body.userId
    )
      res.status(400).json({ message: "Missing new password or user ID" });
    else {
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const userId = req.body.userId;
      await pool.query("UPDATE reddit_user SET password = $1 WHERE id = $2", [
        newHashedPassword,
        userId,
      ]);
      res.status(200).json({ message: "Password changed" });
    }
  }
);

module.exports = router;
