// routes/account.js
const express = require("express");
const router = express.Router();
const db = require("../db");



router.get("/", async (req, res) => {
  console.log("account page accessed");
  if (!req.session.user) {

    return res.redirect("/login");
  }

  const userId = req.session.user.id;

  const [posts] = await db.query(`
    SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC
  `, [userId]);

  res.render("account", { posts, user: req.session.user });
});

module.exports = router;