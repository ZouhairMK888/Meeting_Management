// server.js
const express = require("express");
const cors = require('cors');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const { loginValidation, loginHandler } = require('./login');
const { signupValidation, signupHandler } = require('./sign');
const meetingRoutes = require('./meetings');
const summaryRoutes = require('./summary'); 
const listRoutes = require('./list');
const adminRoutes = require('./admin'); 

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(bodyParser.json());

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    res.clearCookie('connect.sid');
    res.send('Logged out successfully');
  });
});

app.get('/form', (req, res) => {
  if (req.session.fname && req.session.lname) {
    return res.json({ valid: true, fname: req.session.fname, lname: req.session.lname });
  } else {
    return res.json({ valid: false });
  }
});

app.post('/login', loginValidation, loginHandler);
app.post('/signup', signupValidation, signupHandler);
app.use('/meetings', meetingRoutes);
app.use('/summary', summaryRoutes); 
app.use('/meetings', listRoutes);
app.use('/admin', adminRoutes); 

app.listen(8081, () => {
  console.log("Server running on port 8081");
});
