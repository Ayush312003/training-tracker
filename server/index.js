const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
var cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;
// app.use(cors());
app.use(express.json());

// cookie parser
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const { isAuthenticated, isAdmin } = require("./controllers/authControllers");
// importing routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

// Use the routes
app.use("/auth", authRoutes);
app.use("/admin", isAuthenticated, isAdmin, adminRoutes);
app.use("/user", isAuthenticated, userRoutes);

// checking token for expiration
app.use("/checkToken", isAuthenticated, (req, res) => {
  return res.status(200).json("Token verified");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
