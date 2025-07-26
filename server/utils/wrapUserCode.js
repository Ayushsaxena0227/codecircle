const wrapUserCode = (userCode, language, problem, inputStr) => {
  const functionName = problem.boilerplateFunctionName;

  if (language === "cpp") {
    return `
#include <iostream>
#include <vector>
using namespace std;

// === USER CODE START ===
${userCode}
// === USER CODE END ===

int main() {
    vector<int> nums = ${parseInput(inputStr, "cppArray")};
    int target = ${parseInput(inputStr, "cppTarget")};
    vector<int> result = ${functionName}(nums, target);
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << ",";
        cout << result[i];
    }
    return 0;
}`;
  }

  if (language === "python") {
    return `
# === USER CODE START ===
${userCode}
# === USER CODE END ===

def parse_input():
    arr = ${parseInput(inputStr, "pyArray")}
    target = ${parseInput(inputStr, "pyTarget")}
    return arr, target

if __name__ == "__main__":
    nums, target = parse_input()
    result = ${functionName}(nums, target)
    print(",".join(map(str, result)))
`;
  }

  if (language === "javascript") {
    return `
${userCode}

function parseInput() {
  const nums = ${parseInput(inputStr, "jsArray")};
  const target = ${parseInput(inputStr, "jsTarget")};
  return [nums, target];
}

const [nums, target] = parseInput();
const result = ${functionName}(nums, target);
console.log(result.join(","));
`;
  }

  return userCode; // fallback for other languages
};

const parseInput = (inputStr, type) => {
  // inputStr is like "[2,7,11,15],9"
  const parts = inputStr.split(",");
  const arrStr = inputStr.substring(0, inputStr.lastIndexOf(","));
  const targetStr = inputStr.substring(inputStr.lastIndexOf(",") + 1);

  switch (type) {
    case "cppArray":
      return `{${arrStr.replace(/\[|\]/g, "")}}`;
    case "cppTarget":
      return targetStr;
    case "pyArray":
      return arrStr;
    case "pyTarget":
      return targetStr;
    case "jsArray":
      return arrStr;
    case "jsTarget":
      return targetStr;
    default:
      return inputStr;
  }
};

module.exports = { wrapUserCode };
