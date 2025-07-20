const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("LeetCode API is running 🚀"));

app.use("/api/user", userRoutes); // Authenticated routes

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
