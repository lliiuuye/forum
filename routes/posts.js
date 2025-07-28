const express = require("express");
const router = express.Router();
const db = require("../db");


// 我的账户
// router.get("/account", async (req, res) => {
//   if (!req.session.user) {
//     return res.redirect("/login");
//   }

//   const userId = req.session.user.id;

//   const [posts] = await db.query(`
//     SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC
//   `, [userId]);

//   res.render("account", { posts, user: req.session.user });
// });


// 查看单个帖子
router.get("/:id", async (req, res) => {
  const [post] = await db.query(
    `SELECT posts.*, users.name AS author 
     FROM posts 
     LEFT JOIN users ON posts.user_id = users.id 
     WHERE posts.id = ?`,
    [req.params.id]
  );

  const [comments] = await db.query(
    `SELECT comments.*, users.name AS author 
     FROM comments 
     LEFT JOIN users ON comments.user_id = users.id 
     WHERE comments.post_id = ?`,
    [req.params.id]
  );

  res.render("post", { post: post[0], comments, user: req.session.user });
});

// 发帖子（需要登录）
router.post("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("请先登录才能发帖！");
  }

  const userId = req.session.user.id;
  const { title, content } = req.body;

  await db.query(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, userId]
  );

  res.redirect("/");
});

// 评论（需要登录）
router.post("/:id/comment", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("请先登录才能评论！");
  }

  const userId = req.session.user.id;
  const { comment } = req.body;
  const postId = req.params.id;

  await db.query(
    "INSERT INTO comments (post_id, content, user_id) VALUES (?, ?, ?)",
    [postId, comment, userId]
  );

  res.redirect("/posts/" + postId);
});


// 删除帖子
router.post("/:id/delete", async (req, res) => {
  const user = req.session.user;
  const postId = req.params.id;

  const [rows] = await db.query("SELECT user_id FROM posts WHERE id = ?", [postId]);
  if (rows.length === 0) {
    return res.status(404).send("帖子不存在");
  }

  const postOwnerId = rows[0].user_id;

  if (user && (user.id === postOwnerId || user.is_admin)) {
    // 先删除该帖的所有评论
    await db.query("DELETE FROM comments WHERE post_id = ?", [postId]);
    
    // 再删除帖子
    await db.query("DELETE FROM posts WHERE id = ?", [postId]);
    
    return res.redirect("/account");
  }

  res.status(403).send("你没有权限删除这个帖子");
});

// 发帖页面（显示发帖表单）
router.get("/new", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("new-post", { user: req.session.user });
});



module.exports = router;

