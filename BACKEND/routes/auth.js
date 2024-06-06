const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');

// Route 1 : for creating the user in the database
let success=true;
router.post(
  "/createuser",
  [
    // this is to set validation for specific inputs
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must have atleast five characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there is any error then console that
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // The user is created and stored in mongodb server and data came from req.body and asign to indexes in database
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry this user email already exist " });
      }
      const salt = await bcrypt.genSalt(10);
      const MyPassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: MyPassword,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, "JWT_SECRET");
      success = true;
      res.send({success, authToken });
    } catch (err) {
      success = false
      res.status(500).send({success,error: "Some error occur"});
    }
  }
);

// Route 2 : for logging in the user and send authentication token 

router.post(
  "/login",
  [
    // this is to set validation for specific inputs
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],

  async (req, res) => {
    // If there is any error then console that

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; //initilization of variables

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Try with correct credentials" });
      }

      const comparePassword =await bcrypt.compare(password, user.password,);

      if (!comparePassword) {
        return res.status(400).json({ error: "Try with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      
      const authToken = jwt.sign(data, "JWT_SECRET");
      success = true;
      res.send({success, authToken });
    } catch (error) {
      success= false;
      res.status(500).send({success, error: "Internal server error occur"});
    }
  }
);

// Route 3 : for getting the user details using auth tokes

router.post(
  "/getuser",fetchuser ,async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      success = true;
      res.send({success,user})
    } catch (error) {
      success= false;
      res.status(500).send({success, error: "Internal server error occur"});
    }
  }
);

module.exports = router;
