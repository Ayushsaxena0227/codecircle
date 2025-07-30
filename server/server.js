require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const executeRoute = require("./routes/execute");
const submissionRoute = require("./routes/submissionRoutes");
const favoriteRoutes = require("./routes/favouriteRoute");
// const sessionRoutes = require("./routes/sessionRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send(" API is running"));
app.use("/api/user", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/execute", executeRoute);
app.use("/api/submit", submissionRoute);
app.use("/api/favorites", favoriteRoutes);
// app.use("/api/sessions", sessionRoutes);
app.use("/api/public/stats", statsRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
