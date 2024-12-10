// backend/sign.js
const { check, validationResult } = require('express-validator');
const db = require('./db');

const signupValidation = [
  check('fname', "First name length error").isLength({ min: 1, max: 50 }),
  check('lname', "Last name length error").isLength({ min: 1, max: 50 }),
  check('email', "Email length error").isEmail().isLength({ min: 10, max: 50 }),
  check('password', "Password length 8-10").isLength({ min: 8, max: 10 })
];

const signupHandler = (req, res) => {
  const sql = "INSERT INTO admin (fname, lname, nomA, passA) VALUES (?, ?, ?, ?)";
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.json({ errors: errors.array() });
  }

  const { fname, lname, email, password } = req.body;

  db.query(sql, [fname, lname, email, password], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.json({ error: "Database error" });
    }
    return res.json("Success");
  });
};

module.exports = {
  signupValidation,
  signupHandler
};
