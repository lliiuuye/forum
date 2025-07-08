console.log("auth router loaded");

const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  res.render("login", { user: req.session.user });
});

// router.post("/login", async (req, res) => {
//   const [users] = await db.query("SELECT * FROM users WHERE email = ?", [req.body.email]);
//   const user = users[0];
//   if (user && await bcrypt.compare(req.body.password, user.password)) {
//     req.session.user = user;
//     res.redirect("/");
//   } else {
//     res.send("登录失败");
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) {
    return res.send("邮箱未注册");
  }

  const user = rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.send("密码错误");
  }

  req.session.user = user;

  // 登录成功后，自动跳转
  if (user.is_admin) {
    return res.redirect("/admin");  // 管理员跳到后台
  } else {
    return res.redirect("/");  // 普通用户跳首页
  }
});


router.get("/register", (req, res) => {
  res.render("register", { user: req.session.user });
});

router.post("/register", async (req, res) => {
  const hashedPwd = await bcrypt.hash(req.body.password, 10);
  await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [req.body.name, req.body.email, hashedPwd]);
  res.redirect("/login");
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.send("登出失败");
    } else {
      res.redirect("/"); // 登出成功后跳回首页
    }
  });
});


module.exports = router;

