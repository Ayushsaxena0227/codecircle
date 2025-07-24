const { db } = require("../firebase/config");

const problems = [
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    tags: ["array", "hashmap"],
    testCases: [
      { input: "2,7,11,15\n9", output: "0,1" },
      { input: "3,2,4\n6", output: "1,2" },
    ],
  },
  {
    title: "Reverse Integer",
    description:
      "Given a signed 32-bit integer x, return x with its digits reversed.",
    difficulty: "medium",
    tags: ["math"],
    testCases: [
      { input: "123", output: "321" },
      { input: "-123", output: "-321" },
    ],
  },
];

async function seedProblems() {
  for (const problem of problems) {
    await db.collection("problems").add(problem);
  }
  console.log("Seeded problems to Firestore!");
}

seedProblems();
