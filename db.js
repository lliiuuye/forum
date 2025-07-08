const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "forum_db",
  charset: 'utf8mb4'
});

pool.getConnection().then((connection) => {
  connection.query('SET NAMES utf8mb4');
  connection.release(); // 释放连接
});

module.exports = pool;

