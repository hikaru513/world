var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request busy incomplete - email and password needed",
    });
  }

  const queryUsers = req.db.from("users").select("email").where("email", "=", email);
  queryUsers.then(users => {
    if (users.length > 0) {
      res.status(400).json({
        error: true,
        message: "user already exists"
      });
      return
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return req.db.from("users").insert({ email, hash })
  }).then(() => {
    res.status(201).json({ error: false, message: "User created" })
  })
});

module.exports = router;
