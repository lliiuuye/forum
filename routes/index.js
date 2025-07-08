const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const [posts] = await db.query(`

    SELECT posts.*, users.name AS author 
    FROM posts 
    LEFT JOIN users ON posts.user_id = users.id 
    ORDER BY posts.is_pinned DESC, posts.created_at DESC;

  `);

  res.render("index", { posts, user: req.session.user });
});



module.exports = router;

