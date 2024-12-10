// backend/db.js
const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "meeting_manage2",
  port: 3309
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database as id ' + db.threadId);
});

module.exports = db;
