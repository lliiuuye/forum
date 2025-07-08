const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const db = require("./db");

const expressLayouts = require("express-ejs-layouts");



 dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


//app.use(express.static("public"));
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); // 使用绝对路径
// app.use('*.css', (req, res, next) => {
//   res.type('text/css');
//   next();
// });

app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);         // 启用布局
app.set("layout", "layout");     // 指定 layout.ejs 为默认布局

app.use(session({
  secret: "forumSecret",
  resave: false,
  saveUninitialized: true,
}));

// 路由模块
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));
app.use("/account", require("./routes/account"));
app.use("/admin", require("./routes/admin"));


// 启动
// app.listen(process.env.PORT || 3000, () => {
//   console.log("Forum running...");
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Forum running on port ${PORT}...`);
});


/* 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello with routes!");
});

const authRoutes = require("./routes/auth");

app.use("/", authRoutes);


app.listen(3000, () => {
  console.log("Forum running...");
});
 */
