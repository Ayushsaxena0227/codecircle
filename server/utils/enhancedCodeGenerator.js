// utils/enhancedCodeGenerator.js
// Enhanced version that handles all types of problems including trees, linked lists, etc.

const TypeSystem = require("./typeSystem");
const DataStructureHandler = require("./datastructureHandler");

class EnhancedCodeGenerator {
  static generateTestCode(userCode, language, problem, testCase) {
    const { functionName, parameters, returnType } = problem;
    const requiredTypes = DataStructureHandler.getRequiredTypes(problem);

    switch (language) {
      case "cpp":
        return this.generateCppCode(
          userCode,
          functionName,
          parameters,
          returnType,
          testCase,
          requiredTypes
        );
      case "python":
        return this.generatePythonCode(
          userCode,
          functionName,
          parameters,
          returnType,
          testCase,
          requiredTypes
        );
      case "javascript":
        return this.generateJavaScriptCode(
          userCode,
          functionName,
          parameters,
          returnType,
          testCase,
          requiredTypes
        );
      case "java":
        return this.generateJavaCode(
          userCode,
          functionName,
          parameters,
          returnType,
          testCase,
          requiredTypes
        );
      default:
        return userCode;
    }
  }

  static generateCppCode(
    userCode,
    functionName,
    parameters,
    returnType,
    testCase,
    requiredTypes
  ) {
    const includes = this.getCppIncludes(parameters, returnType);
    const structDefinitions = this.getCppStructDefinitions(requiredTypes);
    const helperFunctions = DataStructureHandler.getHelperFunctions(
      "cpp",
      requiredTypes
    );
    const printHelpers = DataStructureHandler.getPrintHelpers(
      "cpp",
      requiredTypes
    );
    const paramDeclarations = this.getCppParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getCppFunctionCall(functionName, parameters);
    const outputFormat = this.getCppOutputFormat(returnType, requiredTypes);

    return `${includes}
using namespace std;

${structDefinitions}

${userCode}

${helperFunctions}

${printHelpers}

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

  static generatePythonCode(
    userCode,
    functionName,
    parameters,
    returnType,
    testCase,
    requiredTypes
  ) {
    const imports = this.getPythonImports(parameters, returnType);
    const classDefinitions = this.getPythonClassDefinitions(requiredTypes);
    const helperFunctions = DataStructureHandler.getHelperFunctions(
      "python",
      requiredTypes
    );
    const printHelpers = DataStructureHandler.getPrintHelpers(
      "python",
      requiredTypes
    );
    const paramDeclarations = this.getPythonParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getPythonFunctionCall(functionName, parameters);
    const outputFormat = this.getPythonOutputFormat(returnType, requiredTypes);

    return `${imports}

${classDefinitions}

${userCode}

${helperFunctions}

${printHelpers}

try:
${paramDeclarations}
    
    sol = Solution()
    result = sol.${functionCall}
    
    ${outputFormat}
except Exception as e:
    print(f"Error: {e}")`;
  }

  static generateJavaScriptCode(
    userCode,
    functionName,
    parameters,
    returnType,
    testCase,
    requiredTypes
  ) {
    const classDefinitions = this.getJavaScriptClassDefinitions(requiredTypes);
    const helperFunctions = DataStructureHandler.getHelperFunctions(
      "javascript",
      requiredTypes
    );
    const printHelpers = DataStructureHandler.getPrintHelpers(
      "javascript",
      requiredTypes
    );
    const paramDeclarations = this.getJavaScriptParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getJavaScriptFunctionCall(
      functionName,
      parameters
    );
    const outputFormat = this.getJavaScriptOutputFormat(
      returnType,
      requiredTypes
    );

    return `${classDefinitions}

${userCode}

${helperFunctions}

${printHelpers}

try {
${paramDeclarations}
    
    const result = ${functionCall};
    
    ${outputFormat}
} catch (error) {
    console.log("Error: " + error.message);
}`;
  }

  static generateJavaCode(
    userCode,
    functionName,
    parameters,
    returnType,
    testCase,
    requiredTypes
  ) {
    const imports = this.getJavaImports(parameters, returnType);
    const classDefinitions = this.getJavaClassDefinitions(requiredTypes);
    const helperFunctions = DataStructureHandler.getHelperFunctions(
      "java",
      requiredTypes
    );
    const printHelpers = DataStructureHandler.getPrintHelpers(
      "java",
      requiredTypes
    );
    const paramDeclarations = this.getJavaParameterDeclarations(
      parameters,
      testCase
    );
    const functionCall = this.getJavaFunctionCall(functionName, parameters);
    const outputFormat = this.getJavaOutputFormat(returnType, requiredTypes);

    return `${imports}

${classDefinitions}

${userCode}

${helperFunctions}

${printHelpers}

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
  static getCppIncludes(parameters, returnType) {
    const includes = new Set([
      "#include <iostream>",
      "#include <vector>",
      "#include <string>",
      "#include <queue>",
      "#include <climits>",
    ]);

    parameters.forEach((param) => {
      if (param.type.includes("unordered_map") || param.type.includes("map")) {
        includes.add("#include <unordered_map>");
        includes.add("#include <map>");
      }
      if (param.type.includes("set")) {
        includes.add("#include <set>");
        includes.add("#include <unordered_set>");
      }
    });

    return Array.from(includes).join("\n");
  }

  static getCppStructDefinitions(requiredTypes) {
    const definitions = [];

    if (requiredTypes.includes("TreeNode")) {
      definitions.push(DataStructureHandler.getTreeNodeDefinition("cpp"));
    }

    if (requiredTypes.includes("ListNode")) {
      definitions.push(DataStructureHandler.getListNodeDefinition("cpp"));
    }

    return definitions.join("\n\n");
  }

  static getCppParameterDeclarations(parameters, testCase) {
    if (!parameters || !Array.isArray(parameters)) {
      console.error("❌ Parameters is not an array:", parameters);
      return "// Error: No parameters defined";
    }
    return parameters
      .map((param) => {
        let value;

        if (DataStructureHandler.requiresSpecialHandling(param.type)) {
          value = DataStructureHandler.buildDataStructure(
            testCase.input[param.name],
            param.type,
            "cpp"
          );
        } else {
          value = TypeSystem.serializeValue(
            testCase.input[param.name],
            param.type,
            "cpp"
          );
        }

        return `        ${param.type}${
          param.type.includes("*")
            ? ""
            : param.type.includes("&")
            ? ""
            : "*".repeat(0)
        } ${param.name} = ${value};`;
      })
      .join("\n");
  }

  static getCppFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getCppOutputFormat(returnType, requiredTypes) {
    if (DataStructureHandler.requiresSpecialHandling(returnType)) {
      return DataStructureHandler.getOutputFormat(returnType, "cpp");
    }

    if (returnType.includes("vector")) {
      return `cout << "[";
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) cout << ",";
            cout << result[i];
        }
        cout << "]";`;
    }

    return "cout << result;";
  }

  // Python Helper Methods
  static getPythonImports(parameters, returnType) {
    const imports = new Set([
      "from typing import List, Optional",
      "import json",
    ]);

    return Array.from(imports).join("\n");
  }

  static getPythonClassDefinitions(requiredTypes) {
    const definitions = [];

    if (requiredTypes.includes("TreeNode")) {
      definitions.push(DataStructureHandler.getTreeNodeDefinition("python"));
    }

    if (requiredTypes.includes("ListNode")) {
      definitions.push(DataStructureHandler.getListNodeDefinition("python"));
    }

    return definitions.join("\n\n");
  }

  static getPythonParameterDeclarations(parameters, testCase) {
    return parameters
      .map((param) => {
        let value;

        if (DataStructureHandler.requiresSpecialHandling(param.type)) {
          value = DataStructureHandler.buildDataStructure(
            testCase.input[param.name],
            param.type,
            "python"
          );
        } else {
          value = TypeSystem.serializeValue(
            testCase.input[param.name],
            param.type,
            "python"
          );
        }

        return `    ${param.name} = ${value}`;
      })
      .join("\n");
  }

  static getPythonFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getPythonOutputFormat(returnType, requiredTypes) {
    if (DataStructureHandler.requiresSpecialHandling(returnType)) {
      return DataStructureHandler.getOutputFormat(returnType, "python");
    }

    return `print(json.dumps(result) if isinstance(result, (list, dict)) else result)`;
  }

  // JavaScript Helper Methods
  static getJavaScriptClassDefinitions(requiredTypes) {
    const definitions = [];

    if (requiredTypes.includes("TreeNode")) {
      definitions.push(
        DataStructureHandler.getTreeNodeDefinition("javascript")
      );
    }

    if (requiredTypes.includes("ListNode")) {
      definitions.push(
        DataStructureHandler.getListNodeDefinition("javascript")
      );
    }

    return definitions.join("\n\n");
  }

  static getJavaScriptParameterDeclarations(parameters, testCase) {
    return parameters
      .map((param) => {
        let value;

        if (DataStructureHandler.requiresSpecialHandling(param.type)) {
          value = DataStructureHandler.buildDataStructure(
            testCase.input[param.name],
            param.type,
            "javascript"
          );
        } else {
          value = TypeSystem.serializeValue(
            testCase.input[param.name],
            param.type,
            "javascript"
          );
        }

        return `    const ${param.name} = ${value};`;
      })
      .join("\n");
  }

  static getJavaScriptFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getJavaScriptOutputFormat(returnType, requiredTypes) {
    if (DataStructureHandler.requiresSpecialHandling(returnType)) {
      return DataStructureHandler.getOutputFormat(returnType, "javascript");
    }

    return `console.log(typeof result === 'object' ? JSON.stringify(result) : result);`;
  }

  // Java Helper Methods
  static getJavaImports(parameters, returnType) {
    const imports = new Set(["import java.util.*;"]);

    return Array.from(imports).join("\n");
  }

  static getJavaClassDefinitions(requiredTypes) {
    const definitions = [];

    if (requiredTypes.includes("TreeNode")) {
      definitions.push(DataStructureHandler.getTreeNodeDefinition("java"));
    }

    if (requiredTypes.includes("ListNode")) {
      definitions.push(DataStructureHandler.getListNodeDefinition("java"));
    }

    return definitions.join("\n\n");
  }

  static getJavaParameterDeclarations(parameters, testCase) {
    return parameters
      .map((param) => {
        let value;

        if (DataStructureHandler.requiresSpecialHandling(param.type)) {
          value = DataStructureHandler.buildDataStructure(
            testCase.input[param.name],
            param.type,
            "java"
          );
        } else {
          value = TypeSystem.serializeValue(
            testCase.input[param.name],
            param.type,
            "java"
          );
        }

        const javaType = TypeSystem.getTypeMapping(param.type, "java");
        return `            ${javaType} ${param.name} = ${value};`;
      })
      .join("\n");
  }

  static getJavaFunctionCall(functionName, parameters) {
    const paramNames = parameters.map((p) => p.name).join(", ");
    return `${functionName}(${paramNames})`;
  }

  static getJavaOutputFormat(returnType, requiredTypes) {
    if (DataStructureHandler.requiresSpecialHandling(returnType)) {
      return DataStructureHandler.getOutputFormat(returnType, "java");
    }

    return `System.out.println(result);`;
  }
}

module.exports = EnhancedCodeGenerator;
