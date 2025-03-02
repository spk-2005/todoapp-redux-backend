const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Sign in and Save user to DB
router.post("/signin", async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log("Received user data:", { name, email });

    let user = await User.findOne({ email });

    if (!user) {
      console.log("Creating new user in MongoDB");
      user = new User({ name, email });
      await user.save();
    } else {
      console.log("Found existing user in MongoDB");
    }

    res.json({ message: "User authenticated", user });
  } catch (error) {
    console.error("Error in /signin route:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;