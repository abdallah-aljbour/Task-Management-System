const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  try {
    // 1. Request body (name, email, password)
    const { email, name, password } = req.body;

    // 2. Check if user already exists
    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // 3. Bcrypt the user password
    const bcryptPassword = await bcrypt.hash(password, 10);

    // 4. Insert new user
    const newUserResult = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    // 5. Return success response
    return res.status(201).json({
      message: "User created successfully",
      user: newUserResult.rows[0],
    });
  } catch (error) {
    // 6. Handle unexpected errors
    console.error(error);
    res.status(500).json({ error: "An error occurred during signup." });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    // const result = await pool.query(
    //   "SELECT * FROM USERS WHERE user_name = $1",
    //   [name]
    // );
    const result = await pool.query(
      "SELECT user_id, user_name, user_email, user_password FROM public.users WHERE user_name = $1",
      [name]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.user_password)) {
        const token = jwt.sign(
          { id: user.user_id, username: user.user_name },
          JWT_SECRET
        );
        res.json({ token });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
