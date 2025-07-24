const { db } = require("../firebase/config");

exports.getAllProblems = async (req, res) => {
  try {
    const snapshot = await db.collection("problems").get();
    const problems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

exports.getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection("problems").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching problem" });
  }
};
