// scripts/seedProblems.js
const { db } = require("../firebase/config");

// Problem definitions using the new scalable structure
function cleanForFirestore(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      item === undefined ? null : cleanForFirestore(item)
    );
  } else if (obj && typeof obj === "object") {
    const out = {};
    for (const k in obj) {
      if (obj[k] === undefined) out[k] = null;
      else out[k] = cleanForFirestore(obj[k]);
    }
    return out;
  }
  return obj;
}

// Convert complex nested structures to JSON strings for Firestore compatibility
function prepareForFirestore(problem) {
  const prepared = { ...problem };

  // Convert testCases to JSON strings if they contain complex nested structures
  if (prepared.testCases) {
    prepared.testCases = prepared.testCases.map((testCase) => ({
      ...testCase,
      input: JSON.stringify(testCase.input),
      output: JSON.stringify(testCase.output),
      explanation: testCase.explanation,
    }));
  }

  return prepared;
}

const problems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "easy",
    tags: ["Array", "Hash Table"],
    functionName: "twoSum",
    returnType: "vector<int>",
    parameters: [
      {
        name: "nums",
        type: "vector<int>",
        description: "Array of integers",
      },
      {
        name: "target",
        type: "int",
        description: "Target sum",
      },
    ],
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        output: [0, 1],
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        output: [1, 2],
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: { nums: [3, 3], target: 6 },
        output: [0, 1],
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
      },
    ],
    boilerplate: {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
    
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`,
    },
    hints: [
      "A brute force approach would use two for loops.",
      "Think about using a hash map to store values and their indices.",
      "For each element, check if target - element exists in the hash map.",
    ],
    constraints: `• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    acceptanceRate: "49.1%",
    totalSubmissions: "8,234,567",
  },

  {
    title: "Valid Palindrome",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    difficulty: "easy",
    tags: ["Two Pointers", "String"],
    functionName: "isPalindrome",
    returnType: "boolean",
    parameters: [
      {
        name: "s",
        type: "string",
        description: "Input string to check",
      },
    ],
    testCases: [
      {
        input: { s: "A man, a plan, a canal: Panama" },
        output: true,
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: { s: "race a car" },
        output: false,
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: { s: " " },
        output: true,
        explanation:
          'After removing non-alphanumeric characters, s becomes an empty string "", which is a palindrome.',
      },
    ],
    boilerplate: {
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        // Your code here
        
    }
};`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Your code here
        pass`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // Your code here
    
};`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Your code here
        
    }
}`,
    },
    hints: [
      "Use two pointers from the beginning and end of the string.",
      "Skip non-alphanumeric characters and convert to lowercase.",
      "Compare characters at both pointers and move them towards each other.",
    ],
    constraints: `• 1 ≤ s.length ≤ 2 × 10⁵
• s consists only of printable ASCII characters.`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    acceptanceRate: "42.3%",
    totalSubmissions: "2,987,654",
  },

  {
    title: "Reverse Integer",
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).`,
    difficulty: "medium",
    tags: ["Math"],
    functionName: "reverse",
    returnType: "int",
    parameters: [
      {
        name: "x",
        type: "int",
        description: "Integer to reverse",
      },
    ],
    testCases: [
      {
        input: { x: 123 },
        output: 321,
        explanation: "Simply reverse the digits of 123.",
      },
      {
        input: { x: -123 },
        output: -321,
        explanation: "Reverse the digits while preserving the sign.",
      },
      {
        input: { x: 120 },
        output: 21,
        explanation: "Leading zeros are dropped in the result.",
      },
      {
        input: { x: 1534236469 },
        output: 0,
        explanation: "Reversed integer overflows, return 0.",
      },
    ],
    boilerplate: {
      cpp: `class Solution {
public:
    int reverse(int x) {
        // Your code here
        
    }
};`,
      python: `class Solution:
    def reverse(self, x: int) -> int:
        # Your code here
        pass`,
      javascript: `/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    // Your code here
    
};`,
      java: `class Solution {
    public int reverse(int x) {
        // Your code here
        
    }
}`,
    },
    hints: [
      "Extract digits using modulo and division operations.",
      "Build the reversed number digit by digit.",
      "Check for overflow before adding each digit.",
    ],
    constraints: `• -2³¹ ≤ x ≤ 2³¹ - 1`,
    timeComplexity: "O(log x)",
    spaceComplexity: "O(1)",
    acceptanceRate: "25.8%",
    totalSubmissions: "3,456,789",
  },

  {
    title: "Transpose Matrix",
    description: `Given a 2D integer array matrix, return the transpose of matrix.

The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices.`,
    difficulty: "easy",
    tags: ["Array", "Matrix", "Simulation"],
    functionName: "transpose",
    returnType: "vector<vector<int>>",
    parameters: [
      {
        name: "matrix",
        type: "vector<vector<int>>",
        description: "2D matrix to transpose",
      },
    ],
    testCases: [
      {
        input: {
          matrix: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        },
        output: [
          [1, 4, 7],
          [2, 5, 8],
          [3, 6, 9],
        ],
        explanation: "Transpose the 3x3 matrix.",
      },
      {
        input: {
          matrix: [
            [1, 2, 3],
            [4, 5, 6],
          ],
        },
        output: [
          [1, 4],
          [2, 5],
          [3, 6],
        ],
        explanation: "Transpose the 2x3 matrix to get a 3x2 matrix.",
      },
    ],
    boilerplate: {
      cpp: `class Solution {
public:
    vector<vector<int>> transpose(vector<vector<int>>& matrix) {
        // Your code here
        
    }
};`,
      python: `class Solution:
    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:
        # Your code here
        pass`,
      javascript: `/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function(matrix) {
    // Your code here
    
};`,
      java: `class Solution {
    public int[][] transpose(int[][] matrix) {
        // Your code here
        
    }
}`,
    },
    hints: [
      "Create a new matrix with swapped dimensions.",
      "For each element at position (i, j), place it at position (j, i) in the result.",
      "The new matrix will have dimensions [cols][rows] instead of [rows][cols].",
    ],
    constraints: `• m == matrix.length
• n == matrix[i].length
• 1 ≤ m, n ≤ 1000
• 1 ≤ matrix[i][j] ≤ 10⁵`,
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    acceptanceRate: "63.2%",
    totalSubmissions: "1,234,567",
  },

  {
    title: "Factorial",
    description: `Given a non-negative integer n, return the factorial of n.

The factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n.

Note: 0! = 1 by definition.`,
    difficulty: "easy",
    tags: ["Math", "Recursion"],
    functionName: "factorial",
    returnType: "int",
    parameters: [
      {
        name: "n",
        type: "int",
        description: "Non-negative integer",
      },
    ],
    testCases: [
      {
        input: { n: 5 },
        output: 120,
        explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120",
      },
      {
        input: { n: 0 },
        output: 1,
        explanation: "0! = 1 by definition",
      },
      {
        input: { n: 3 },
        output: 6,
        explanation: "3! = 3 × 2 × 1 = 6",
      },
    ],
    boilerplate: {
      cpp: `class Solution {
public:
    int factorial(int n) {
        // Your code here
        
    }
};`,
      python: `class Solution:
    def factorial(self, n: int) -> int:
        # Your code here
        pass`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var factorial = function(n) {
    // Your code here
    
};`,
      java: `class Solution {
    public int factorial(int n) {
        // Your code here
        
    }
}`,
    },
    hints: [
      "Can be solved iteratively or recursively.",
      "Base case: 0! = 1 and 1! = 1",
      "For iterative: multiply all numbers from 1 to n.",
    ],
    constraints: `• 0 ≤ n ≤ 12`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) iterative, O(n) recursive",
    acceptanceRate: "87.4%",
    totalSubmissions: "987,654",
  },

  // Example of a more complex problem with tree structure
  {
    title: "Maximum Depth of Binary Tree",
    description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    difficulty: "easy",
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    functionName: "maxDepth",
    returnType: "int",
    parameters: [
      {
        name: "root",
        type: "TreeNode",
        description: "Root of the binary tree",
      },
    ],
    testCases: [
      {
        input: { root: [3, 9, 20, null, null, 15, 7] },
        output: 3,
        explanation: "The maximum depth is 3.",
      },
      {
        input: { root: [1, null, 2] },
        output: 2,
        explanation: "The maximum depth is 2.",
      },
      {
        input: { root: [] },
        output: 0,
        explanation: "Empty tree has depth 0.",
      },
    ],
    boilerplate: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Your code here
        
    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        # Your code here
        pass`,
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    // Your code here
    
};`,
      java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        // Your code here
        
    }
}`,
    },
    hints: [
      "Think about the recursive nature of trees.",
      "The depth of a tree is 1 + maximum depth of its subtrees.",
      "Base case: if root is null, depth is 0.",
    ],
    constraints: `• The number of nodes in the tree is in the range [0, 10⁴].
• -100 ≤ Node.val ≤ 100`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is the height of the tree",
    acceptanceRate: "74.9%",
    totalSubmissions: "2,567,890",
  },
];

async function seedProblems() {
  try {
    console.log("🗑️ Clearing existing problems...");

    // Clear existing problems
    const existingProblems = await db.collection("problems").get();
    const batch = db.batch();

    existingProblems.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("✅ Cleared existing problems");

    console.log("📝 Adding new problems...");

    // Add new problems
    for (const problem of problems) {
      // Prepare the problem for Firestore (convert complex nested structures)
      const preparedProblem = prepareForFirestore(problem);

      const docRef = await db.collection("problems").add(
        cleanForFirestore({
          ...preparedProblem,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
      console.log(`✅ Added problem: ${problem.title} (ID: ${docRef.id})`);
    }

    console.log("🎉 Successfully seeded all problems to Firestore!");
    console.log(`📊 Total problems: ${problems.length}`);
  } catch (error) {
    console.error("❌ Error seeding problems:", error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedProblems()
    .then(() => {
      console.log("🏁 Seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

module.exports = { seedProblems, problems };
