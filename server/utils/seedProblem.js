const { db } = require("../firebase/config");

const problems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "easy",
    tags: ["Array", "Hash Table"],
    boilerplateFunctionName: "twoSum",
    constraints: `• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    acceptanceRate: "49.1%",
    totalSubmissions: "8,234,567",
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "[3,3]\n6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
      },
    ],
    inputFormat: {
      line1: "Array of integers nums",
      line2: "Integer target",
    },
    outputFormat: "Array of two integers representing indices",
  },
  {
    title: "Reverse Integer",
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).`,
    difficulty: "medium",
    tags: ["Math"],
    boilerplateFunctionName: "reverseInteger",
    constraints: `• -2³¹ ≤ x ≤ 2³¹ - 1`,
    timeComplexity: "O(log x)",
    spaceComplexity: "O(1)",
    acceptanceRate: "25.8%",
    totalSubmissions: "3,456,789",
    testCases: [
      {
        input: "123",
        output: "321",
        explanation: "Simply reverse the digits of 123.",
      },
      {
        input: "-123",
        output: "-321",
        explanation: "Reverse the digits while preserving the sign.",
      },
      {
        input: "120",
        output: "21",
        explanation: "Leading zeros are dropped in the result.",
      },
    ],
    inputFormat: {
      line1: "Integer x",
    },
    outputFormat: "Reversed integer or 0 if overflow",
  },
  {
    title: "Valid Palindrome",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    difficulty: "easy",
    tags: ["Two Pointers", "String"],
    boilerplateFunctionName: "isPalindrome",
    constraints: `• 1 ≤ s.length ≤ 2 × 10⁵
• s consists only of printable ASCII characters.`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    acceptanceRate: "42.3%",
    totalSubmissions: "2,987,654",
    testCases: [
      {
        input: "A man, a plan, a canal: Panama",
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: "race a car",
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: " ",
        output: "true",
        explanation:
          'After removing non-alphanumeric characters, s becomes an empty string "", which is a palindrome.',
      },
    ],
    inputFormat: {
      line1: "String s",
    },
    outputFormat: "Boolean (true/false)",
  },
  {
    title: "Transpose Matrix",
    description: `Given a 2D integer array matrix, return the transpose of matrix.

The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices.`,
    difficulty: "easy",
    tags: ["Array", "Matrix", "Simulation"],
    boilerplateFunctionName: "transpose",
    constraints: `• m == matrix.length
• n == matrix[i].length
• 1 ≤ m, n ≤ 1000
• 1 ≤ matrix[i][j] ≤ 10⁵`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    acceptanceRate: "63.2%",
    totalSubmissions: "1,234,567",
    testCases: [
      {
        input: "[[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[1,4,7],[2,5,8],[3,6,9]]",
        explanation: "Transpose the 3x3 matrix.",
      },
      {
        input: "[[1,2,3],[4,5,6]]",
        output: "[[1,4],[2,5],[3,6]]",
        explanation: "Transpose the 2x3 matrix to get a 3x2 matrix.",
      },
    ],
    inputFormat: {
      line1: "2D array matrix",
    },
    outputFormat: "2D array representing the transposed matrix",
  },
  {
    title: "Factorial",
    description: `Given a non-negative integer n, return the factorial of n.

The factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n.

Note: 0! = 1 by definition.`,
    difficulty: "easy",
    tags: ["Math", "Recursion"],
    boilerplateFunctionName: "factorial",
    constraints: `• 0 ≤ n ≤ 12`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) iterative, O(n) recursive",
    acceptanceRate: "87.4%",
    totalSubmissions: "987,654",
    testCases: [
      {
        input: "5",
        output: "120",
        explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120",
      },
      {
        input: "0",
        output: "1",
        explanation: "0! = 1 by definition",
      },
      {
        input: "3",
        output: "6",
        explanation: "3! = 3 × 2 × 1 = 6",
      },
    ],
    inputFormat: {
      line1: "Integer n",
    },
    outputFormat: "Integer representing n!",
  },
];

async function seedProblems() {
  try {
    // Clear existing problems (optional)
    const existingProblems = await db.collection("problems").get();
    const batch = db.batch();

    existingProblems.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("🗑️ Cleared existing problems");

    // Add new problems
    for (const problem of problems) {
      await db.collection("problems").add(problem);
    }

    console.log("✅ Seeded problems to Firestore!");
  } catch (error) {
    console.error("❌ Error seeding problems:", error);
  }
}

seedProblems();
