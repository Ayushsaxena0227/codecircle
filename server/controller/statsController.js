const { db } = require("../firebase/config");

exports.getPublicStats = async (req, res) => {
  try {
    const problemsSnap = await db.collection("problems").get();
    const usersSnap = await db.collection("users").get();
    const subSnap = await db.collectionGroup("submissions").get();

    res.json({
      problems: problemsSnap.size,
      users: usersSnap.size,
      submissions: subSnap.size,
    });
  } catch (e) {
    console.error("stats error:", e.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
