const express = require("express");
const { registerUser, login } = require("../controllers/authControllers");
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", login);
router.post("/logout", (req, res) => {
  // Invalidate authentication token or perform any cleanup necessary
  // For example, you could blacklist the token or remove it from the database of valid tokens
  // Then send a response indicating successful logout
  res.status(200).send("Logout successful");
});

module.exports = router;
