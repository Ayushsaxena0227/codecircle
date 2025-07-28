const { db } = require("../firebase/config");

exports.toggleFavorite = async (req, res) => {
  const uid = req.user.uid;
  const problemId = req.params.problemId;

  if (!problemId) {
    return res.status(400).json({ error: "Problem ID is required" });
  }

  const favRef = db
    .collection("users")
    .doc(uid)
    .collection("favorites")
    .doc(problemId);

  try {
    const doc = await favRef.get();

    if (doc.exists) {
      await favRef.delete(); // unfavourite
      return res.json({ favored: false });
    } else {
      await favRef.set({ createdAt: Date.now() });
      return res.json({ favored: true });
    }
  } catch (err) {
    console.error("Favorite toggle error:", err.message);
    res.status(500).json({ error: "Could not update favorite" });
  }
};

exports.getFavorites = async (req, res) => {
  const uid = req.user.uid;

  try {
    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("favorites")
      .get();

    const ids = snap.docs.map((d) => d.id);
    res.json({ favorites: ids });
  } catch (err) {
    console.error("Get favorites error:", err.message);
    res.status(500).json({ error: "Failed to load favorites" });
  }
};
