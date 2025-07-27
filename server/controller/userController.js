const { db } = require("../firebase/config");
exports.createUser = async (req, res) => {
  const { uid, email } = req.user;

  try {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        uid,
        email,
        createdAt: new Date().toISOString(),
        solvedProblems: [],
      });
      return res.status(201).json({ message: "User created in Firestore." });
    } else {
      return res.status(200).json({ message: "User already exists." });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const uid = req.user.uid;

    /* 1. basic profile -------------------------------------------- */
    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = userSnap.data(); // contains email, createdAt …

    /* 2. stats ----------------------------------------------------- */
    const subSnap = await db
      .collection("users")
      .doc(uid)
      .collection("submissions")
      .get();

    let total = 0,
      accepted = 0,
      last = null,
      solvedSet = new Set(),
      diffCount = { easy: 0, medium: 0, hard: 0 };

    subSnap.forEach((d) => {
      total += 1;
      const sub = d.data();
      if (!last || sub.timestamp.toMillis() > last)
        last = sub.timestamp.toMillis();

      if (sub.verdict === "Accepted") {
        accepted += 1;
        solvedSet.add(sub.problemId);
        if (sub.problemDifficulty) {
          const key = sub.problemDifficulty.toLowerCase();
          diffCount[key] = (diffCount[key] || 0) + 1;
        }
      }
    });

    res.json({
      profile: {
        uid,
        email: userData.email,
        createdAt: userData.createdAt,
      },
      stats: {
        submissions: total,
        accepted,
        problemsSolved: solvedSet.size,
        lastSubmission: last,
        solvedByDifficulty: diffCount,
      },
    });
  } catch (err) {
    console.error("overview error:", err.message);
    res.status(500).json({ error: "Failed to build overview" });
  }
};
