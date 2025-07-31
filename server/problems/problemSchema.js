// problems/problemSchema.js
// This defines the structure for any coding problem

const ProblemSchema = {
  // Basic problem info
  title: String,
  description: String,
  difficulty: String, // "easy" | "medium" | "hard"
  tags: [String],

  // Function signature info
  functionName: String,
  returnType: String, // "int", "string", "vector<int>", "boolean", etc.

  // Parameters with their types and names
  parameters: [
    {
      name: String, // e.g., "nums"
      type: String, // e.g., "vector<int>", "int", "string"
      description: String, // optional description
    },
  ],

  // Test cases
  testCases: [
    {
      input: Object, // Structured input instead of string
      output: Object, // Expected output
      explanation: String,
    },
  ],

  // Boilerplate code for each language
  boilerplate: {
    cpp: String,
    python: String,
    javascript: String,
    java: String,
    c: String,
  },

  // Metadata
  constraints: String,
  timeComplexity: String,
  spaceComplexity: String,
  acceptanceRate: String,
  totalSubmissions: String,
};

// Example problem using the new schema
const twoSumProblem = {
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
      input: {
        nums: [2, 7, 11, 15],
        target: 9,
      },
      output: [0, 1],
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: {
        nums: [3, 2, 4],
        target: 6,
      },
      output: [1, 2],
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      input: {
        nums: [3, 3],
        target: 6,
      },
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
  },
  constraints: `• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• -10⁹ ≤ target ≤ 10⁹
• Only one valid answer exists.`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  acceptanceRate: "49.1%",
  totalSubmissions: "8,234,567",
};

module.exports = { ProblemSchema, twoSumProblem };
