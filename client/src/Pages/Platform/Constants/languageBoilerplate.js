// languageBoilerplate.js
// -----------------------------------------------------------------------------
// Boiler-plates for all supported languages
// -----------------------------------------------------------------------------

export const boilerplates = {
  /* ------------------------------------------------------------------------ */
  /*  JavaScript                                                              */
  /* ------------------------------------------------------------------------ */
  javascript: {
    twoSum: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  // Your code goes here
  return [];
};`,

    reverseInteger: `/**
 * @param {number} x
 * @return {number}
 */
var reverseInteger = function(x) {
  // Your code goes here
  return 0;
};`,

    isPalindrome: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
  // Your code goes here
  return false;
};`,

    transpose: `/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function(matrix) {
  // Your code goes here
  return [];
};`,

    factorial: `/**
 * @param {number} n
 * @return {number}
 */
var factorial = function(n) {
  // Your code goes here
  return 1;
};`,
  },

  /* ------------------------------------------------------------------------ */
  /*  Python                                                                  */
  /* ------------------------------------------------------------------------ */
  python: {
    twoSum: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code goes here
        return []`,

    reverseInteger: `class Solution:
    def reverseInteger(self, x: int) -> int:
        # Your code goes here
        return 0`,

    isPalindrome: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Your code goes here
        return False`,

    transpose: `from typing import List

class Solution:
    def transpose(self, matrix: List[List[int]]) -> List[List[int]]:
        # Your code goes here
        return []`,

    factorial: `class Solution:
    def factorial(self, n: int) -> int:
        # Your code goes here
        return 1`,
  },

  /* ------------------------------------------------------------------------ */
  /*  C++                                                                     */
  /* ------------------------------------------------------------------------ */
  cpp: {
    twoSum: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code goes here
        return {};
    }
};`,

    reverseInteger: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int reverseInteger(int x) {
        // Your code goes here
        return 0;
    }
};`,

    isPalindrome: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Your code goes here
        return false;
    }
};`,

    transpose: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> transpose(vector<vector<int>>& matrix) {
        // Your code goes here
        return {};
    }
};`,

    factorial: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    long long factorial(int n) {
        // Your code goes here
        return 1;
    }
};`,
  },
};

/* -------------------------------------------------------------------------- */
/* Helper: return the correct boiler-plate or a generic fallback              */
/* -------------------------------------------------------------------------- */
export const getBoilerplate = (language, problemFunctionName) => {
  if (boilerplates[language] && boilerplates[language][problemFunctionName]) {
    return boilerplates[language][problemFunctionName];
  }

  /* Generic templates when we don’t have a problem-specific stub */
  const fallbacks = {
    javascript: `function solution() {
  // Your code goes here
}`,
    python: `class Solution:
    def solution(self):
        # Your code goes here
        pass`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // Your code goes here
};`,
  };

  return fallbacks[language] || fallbacks.cpp;
};
