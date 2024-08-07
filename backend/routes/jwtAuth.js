const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");

//registering
router.post("/register", validInfo, async (req, res) => {
  //1.request body(name , email , password)
  const { email, name, password } = req.body;
  //2.check if user exit(if user exit then throw error)

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }
    //3.Bcrypt the user password

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    //4.inter new user inside database

    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );
    //5.genarating our new jwt token

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  const { email, password } = req.body;

  try {
    //1.request body(name , email , password)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    //2.check if user exit(if user exit then throw error)

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    //3.check incomming password is the same database password
    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    //4.give them jwt token
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
