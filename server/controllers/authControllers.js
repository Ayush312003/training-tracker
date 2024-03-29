const { client } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registers a new user with the provided name, email, and password.
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword)
      return res
        .status(400)
        .send({ error: "Name or email or password required" });

    if (password != confirmPassword)
      return res.status(400).send({ error: "Password does not match" });

    // if Email already exist
    let result = await client.query(
      "SELECT email from users where email = $1",
      [email]
    );

    if (result.rowCount != 0)
      return res.status(400).send({ error: "User already exist" });

    // create hash for password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    result = await client.query(
      "INSERT into users(name, email, password) values($1, $2, $3) RETURNING name, email, isAdmin",
      [name, email, hashedPassword]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({
      error: error.message,
    });
  }
};

// Handles user login by verifying email and password, and creating a JWT token upon successful authentication.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await client.query(
      "SELECT id, name, email, password, isadmin from users where email = $1",
      [email]
    );

    // If user not found
    if (result.rowCount == 0)
      return res.status(401).json({ error: "Invalid email or password" });

    // Check for password match
    const match = await bcrypt.compare(password, result.rows[0].password);

    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    const { id, name, userEmail, isadmin } = result.rows[0];

    // create token
    const token = jwt.sign(
      { id: id, name: name, email: userEmail, isAdmin: isadmin },
      `${process.env.JWT_SECRET_KEY}`,
      { expiresIn: "1d" }
    );
    let redirectUrl = "/user";
    if (isadmin) {
      redirectUrl = "/admin";
    }

    res.cookie("token", token);
    return res.status(200).json({
      id: id,
      name: name,
      isAdmin: isadmin,
      // token: token,
      redirectUrl: redirectUrl,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

// Middleware function to check if a user is authenticated by verifying the JWT token provided in the request.
const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      return res.status(401).json("Unauthorized Request: Token missing.");
    }

    const token = req.cookies.token;
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json("Token expired. Please login again");
    }
    return res.status(400).json("Token invalid. Please login again");
  }
};

// Middleware function to check if a user is an admin based on the user data attached to req.user.
const isAdmin = async (req, res, next) => {
  const user = req.user;

  try {
    if (!user.isAdmin) {
      return res.status(401).json({ error: "You are not authorized!!" });
    }
  } catch (error) {
    return res.send({ error: error.message });
  }

  next();
};

module.exports = {
  registerUser,
  login,
  isAuthenticated,
  isAdmin,
};
