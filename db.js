const mysql = require("mysql2/promise");
require("dotenv").config(); // 加载 .env 配置

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: process.env.DB_CHARSET || 'utf8mb4'
});

pool.getConnection().then((connection) => {
  connection.query('SET NAMES utf8mb4');
  connection.release();
});

module.exports = pool;
