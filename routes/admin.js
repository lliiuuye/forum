const express = require("express");
const router = express.Router();
const db = require("../db");

// 管理员页面：显示所有帖子
router.get("/", async (req, res) => {
  const user = req.session.user;
  if (!user || !user.is_admin) {
    return res.status(403).send("你没有权限访问此页面");
  }

  const [posts] = await db.query(`
    SELECT posts.*, users.name AS author 
    FROM posts 
    LEFT JOIN users ON posts.user_id = users.id 
    ORDER BY posts.is_pinned DESC, posts.created_at DESC;

  `);

  res.render("admin", { posts, user });
});

// 删除任意帖子（管理员）
router.post("/:id/delete", async (req, res) => {
  const user = req.session.user;
  if (!user || !user.is_admin) {
    return res.status(403).send("你没有权限执行此操作");
  }

  const postId = req.params.id;

  // 先删除评论
  await db.query("DELETE FROM comments WHERE post_id = ?", [postId]);

  // 再删除帖子
  await db.query("DELETE FROM posts WHERE id = ?", [postId]);

  res.redirect("/admin");
});

// 切换置顶状态
router.post("/:id/toggle-pin", async (req, res) => {
  const user = req.session.user;
  if (!user || !user.is_admin) {
    return res.status(403).send("你没有权限");
  }

  const postId = req.params.id;

  // 查询当前置顶状态
  const [rows] = await db.query("SELECT is_pinned FROM posts WHERE id = ?", [postId]);
  if (rows.length === 0) {
    return res.status(404).send("帖子不存在");
  }

  const currentStatus = rows[0].is_pinned;
  const newStatus = currentStatus ? 0 : 1;

  // 更新置顶状态
  await db.query("UPDATE posts SET is_pinned = ? WHERE id = ?", [newStatus, postId]);

  res.redirect("/admin");
});



module.exports = router;
