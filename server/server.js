const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("LeetCode API is running"));
app.use("/api/user", userRoutes);
app.use("/api/problems", problemRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
