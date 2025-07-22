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
