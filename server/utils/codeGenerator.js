// utils/codeGenerator.js
// Generates test wrapper code for any problem dynamically

const TypeSystem = require("./typeSystem");

class CodeGenerator {
  static generateTestCode(userCode, language, problem, testCase) {
    const { functionName, parameters } = problem;

    switch (language) {
      case "cpp":
        return this.generateCppCode(
          userCode,
          functionName,
          parameters,
          testCase
        );
      case "python":
        return this.generatePythonCode(
          userCode,
          functionName,
          parameters,
          testCase
        );
      case "javascript":
        return this.generateJavaScriptCode(
          userCode,
          functionName,
          parameters,
          testCase
        );
      case "java":
        return this.generateJavaCode(
          userCode,
          functionName,
          parameters,
          testCase
        );
      default:
        return userCode;
    }
  }

  static generateCppCode(userCode, functionName, parameters, testCase) {
    const includes = this.getCppIncludes(parameters);
    const paramDeclarations = this.getCppParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getCppFunctionCall(functionName, parameters);
    const outputFormat = this.getCppOutputFormat(parameters);

    return `${includes}
using namespace std;

${userCode}

int main() {
    try {
${paramDeclarations}
        
        Solution sol;
        auto result = sol.${functionCall};
        
${outputFormat}
    } catch (const exception& e) {
        cout << "Error: " << e.what();
    }
    
    return 0;
}`;
  }

  static generatePythonCode(userCode, functionName, parameters, testCase) {
    const imports = this.getPythonImports(parameters);
    const paramDeclarations = this.getPythonParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getPythonFunctionCall(functionName, parameters);
    const outputFormat = this.getPythonOutputFormat(parameters);

    return `${imports}

${userCode}

try:
${paramDeclarations}
    
    sol = Solution()
    result = sol.${functionCall}
    
${outputFormat}
except Exception as e:
    print(f"Error: {e}")`;
  }

  static generateJavaScriptCode(userCode, functionName, parameters, testCase) {
    const paramDeclarations = this.getJavaScriptParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getJavaScriptFunctionCall(
      functionName,
      parameters
    );
    const outputFormat = this.getJavaScriptOutputFormat(parameters);

    return `${userCode}

try {
${paramDeclarations}
    
    const result = ${functionCall};
    
${outputFormat}
} catch (error) {
    console.log("Error: " + error.message);
}`;
  }

  static generateJavaCode(userCode, functionName, parameters, testCase) {
    const imports = this.getJavaImports(parameters);
    const paramDeclarations = this.getJavaParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getJavaFunctionCall(functionName, parameters);
    const outputFormat = this.getJavaOutputFormat(parameters);

    return `${imports}

${userCode}

public class Main {
    public static void main(String[] args) {
        try {
${paramDeclarations}
            
            Solution sol = new Solution();
            var result = sol.${functionCall};
            
${outputFormat}
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`;
  }

  // C++ Helper Methods
  static getCppIncludes(parameters) {
    const includes = new Set(["#include <iostream>"]);

    parameters.forEach((param) => {
      if (param.type.includes("vector")) {
        includes.add("#include <vector>");
      }
      if (param.type.includes("string")) {
        includes.add("#include <string>");
      }
      if (param.type.includes("unordered_map") || param.type.includes("map")) {
        includes.add("#include <unordered_map>");
        includes.add("#include <map>");
      }
    });

    return Array.from(includes).join("\n");
  }

  static getCppParameterDeclarations(parameters, testCase) {
    return parameters
      .map((param) => {
        const value = TypeSystem.serializeValue(
          testCase.input[param.name],
          param.type,
          "cpp"
        );
        return `        ${param.type} ${param.name} = ${value};`;
      })
      .join("\n");
  }

  static getCppFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getCppOutputFormat(parameters) {
    // This is simplified - you'd determine return type from function signature
    return `        cout << result;`;
  }

  // Python Helper Methods
  static getPythonImports(parameters) {
    const imports = [];

    if (parameters.some((p) => p.type.includes("List"))) {
      imports.push("from typing import List, Optional");
    }

    imports.push("import json");

    return imports.join("\n");
  }

  static getPythonParameterDeclarations(parameters, testCase) {
    return parameters
      .map((param) => {
        const value = TypeSystem.serializeValue(
          testCase.input[param.name],
          param.type,
          "python"
        );
        return `    ${param.name} = ${value}`;
      })
      .join("\n");
  }

  static getPythonFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getPythonOutputFormat(parameters) {
    return `    print(json.dumps(result) if isinstance(result, (list, dict)) else result)`;
  }

  // JavaScript Helper Methods
  static getJavaScriptParameterDeclarations(parameters, testCase) {
    return parameters
      .map((param) => {
        const value = TypeSystem.serializeValue(
          testCase.input[param.name],
          param.type,
          "javascript"
        );
        return `    const ${param.name} = ${value};`;
      })
      .join("\n");
  }

  static getJavaScriptFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getJavaScriptOutputFormat(parameters) {
    return `    console.log(typeof result === 'object' ? JSON.stringify(result) : result);`;
  }

  // Java Helper Methods
  static getJavaImports(parameters) {
    const imports = new Set();

    parameters.forEach((param) => {
      if (param.type.includes("List")) {
        imports.add("import java.util.*;");
      }
    });

    return Array.from(imports).join("\n");
  }

  static getJavaParameterDeclarations(parameters, testCase) {
    return parameters
      .map((param) => {
        const value = TypeSystem.serializeValue(
          testCase.input[param.name],
          param.type,
          "java"
        );
        const javaType = TypeSystem.getTypeMapping(param.type, "java");
        return `            ${javaType} ${param.name} = ${value};`;
      })
      .join("\n");
  }

  static getJavaFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getJavaOutputFormat(parameters) {
    return `            System.out.println(result);`;
  }

  // Special handling for complex data structures
  static generateStructDefinitions(parameters, language) {
    const structs = [];

    parameters.forEach((param) => {
      if (param.type === "TreeNode") {
        structs.push(this.getTreeNodeDefinition(language));
      }
      if (param.type === "ListNode") {
        structs.push(this.getListNodeDefinition(language));
      }
    });

    return structs.join("\n\n");
  }

  static getTreeNodeDefinition(language) {
    switch (language) {
      case "cpp":
        return `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};`;
      case "python":
        return `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`;
      case "javascript":
        return `function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}`;
      case "java":
        return `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}`;
      default:
        return "";
    }
  }

  static getListNodeDefinition(language) {
    switch (language) {
      case "cpp":
        return `struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};`;
      case "python":
        return `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`;
      case "javascript":
        return `function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}`;
      case "java":
        return `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}`;
      default:
        return "";
    }
  }
}

module.exports = CodeGenerator;
