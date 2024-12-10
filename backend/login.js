// backend/login.js
const { check, validationResult } = require('express-validator');
const db = require('./db');

const loginValidation = [
  check('email', "Email length error").isEmail().isLength({ min: 10, max: 30 }),
  check('password', "Password length 8-10").isLength({ min: 8, max: 10 })
];

const loginHandler = (req, res) => {
  const sql = "SELECT * FROM admin WHERE nomA = ? AND passA = ?";
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      req.session.adminId = data[0].idA; 
      req.session.fname = data[0].fname;
      req.session.lname = data[0].lname;
      return res.json("Success");
    } else {
      return res.json("Failed"); 
    }
  });
};

module.exports = {
  loginValidation,
  loginHandler
};
