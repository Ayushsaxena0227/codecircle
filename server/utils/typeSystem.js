class TypeSystem {
  // Convert JavaScript value to language-specific format
  static serializeValue(value, type, language) {
    switch (language) {
      case "cpp":
        return this.serializeCpp(value, type);
      case "python":
        return this.serializePython(value, type);
      case "javascript":
        return this.serializeJavaScript(value, type);
      case "java":
        return this.serializeJava(value, type);
      default:
        return JSON.stringify(value);
    }
  }

  static serializeCpp(value, type) {
    if (type === "int" || type === "long" || type === "double") {
      return String(value);
    }

    if (type === "string") {
      return `"${value}"`;
    }

    if (type === "boolean" || type === "bool") {
      return value ? "true" : "false";
    }

    if (type === "vector<int>") {
      return `{${value.join(", ")}}`;
    }

    if (type === "vector<string>") {
      return `{${value.map((s) => `"${s}"`).join(", ")}}`;
    }

    if (type === "vector<vector<int>>") {
      return `{${value.map((row) => `{${row.join(", ")}}`).join(", ")}}`;
    }

    // Handle custom types or complex structures
    return this.serializeComplex(value, type, "cpp");
  }

  static serializePython(value, type) {
    if (type === "int" || type === "float") {
      return String(value);
    }

    if (type === "str" || type === "string") {
      return `"${value}"`;
    }

    if (type === "bool" || type === "boolean") {
      return value ? "True" : "False";
    }

    if (
      type.includes("List") ||
      type.includes("list") ||
      type === "vector<int>" ||
      type === "vector<string>"
    ) {
      return JSON.stringify(value);
    }

    return JSON.stringify(value);
  }

  static serializeJavaScript(value, type) {
    return JSON.stringify(value);
  }

  static serializeJava(value, type) {
    if (type === "int" || type === "long" || type === "double") {
      return String(value);
    }

    if (type === "String") {
      return `"${value}"`;
    }

    if (type === "boolean") {
      return value ? "true" : "false";
    }

    if (type === "int[]") {
      return `{${value.join(", ")}}`;
    }

    return JSON.stringify(value);
  }

  // Handle complex nested types
  static serializeComplex(value, type, language) {
    // For TreeNode, ListNode, etc.
    if (type === "TreeNode") {
      return this.serializeTreeNode(value, language);
    }

    if (type === "ListNode") {
      return this.serializeListNode(value, language);
    }

    return JSON.stringify(value);
  }

  static serializeTreeNode(value, language) {
    // Handle tree serialization
    if (!value) return language === "cpp" ? "nullptr" : "null";

    // Convert array representation to tree construction code
    const treeArray = this.treeToArray(value);
    return JSON.stringify(treeArray);
  }

  static serializeListNode(value, language) {
    // Handle linked list serialization
    if (!value) return language === "cpp" ? "nullptr" : "null";

    const listArray = this.listToArray(value);
    return JSON.stringify(listArray);
  }

  // Convert output back to comparable format
  static deserializeOutput(output, type, language) {
    if (!output || output.trim() === "") return null;

    try {
      // Handle different output formats
      if (type === "vector<int>" || type === "List[int]" || type === "int[]") {
        // Parse array-like output: [1,2,3] or 1,2,3
        const cleaned = output.replace(/[\[\]]/g, "").trim();
        if (cleaned === "") return [];
        return cleaned.split(",").map((x) => parseInt(x.trim()));
      }

      if (
        type === "vector<string>" ||
        type === "List[str]" ||
        type === "String[]"
      ) {
        const cleaned = output.replace(/[\[\]"]/g, "").trim();
        if (cleaned === "") return [];
        return cleaned.split(",").map((x) => x.trim());
      }

      if (type === "int" || type === "long") {
        return parseInt(output.trim());
      }

      if (type === "double" || type === "float") {
        return parseFloat(output.trim());
      }

      if (type === "bool" || type === "boolean") {
        const cleaned = output.trim().toLowerCase();
        return cleaned === "true" || cleaned === "1";
      }

      if (type === "string" || type === "str") {
        return output.trim().replace(/^"|"$/g, "");
      }

      // Try to parse as JSON for complex types
      return JSON.parse(output);
    } catch (error) {
      // If parsing fails, return raw output
      return output.trim();
    }
  }

  // Helper methods for tree/list conversion
  static treeToArray(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        result.push(node.val);
        queue.push(node.left);
        queue.push(node.right);
      } else {
        result.push(null);
      }
    }

    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) {
      result.pop();
    }

    return result;
  }

  static listToArray(head) {
    const result = [];
    let current = head;

    while (current) {
      result.push(current.val);
      current = current.next;
    }

    return result;
  }

  // Get type mapping for different languages
  static getTypeMapping(genericType, language) {
    const mappings = {
      cpp: {
        int: "int",
        string: "string",
        boolean: "bool",
        "array<int>": "vector<int>",
        "array<string>": "vector<string>",
        "matrix<int>": "vector<vector<int>>",
        TreeNode: "TreeNode*",
        ListNode: "ListNode*",
      },
      python: {
        int: "int",
        string: "str",
        boolean: "bool",
        "array<int>": "List[int]",
        "array<string>": "List[str]",
        "matrix<int>": "List[List[int]]",
        TreeNode: "Optional[TreeNode]",
        ListNode: "Optional[ListNode]",
      },
      javascript: {
        int: "number",
        string: "string",
        boolean: "boolean",
        "array<int>": "number[]",
        "array<string>": "string[]",
        "matrix<int>": "number[][]",
        TreeNode: "TreeNode",
        ListNode: "ListNode",
      },
      java: {
        int: "int",
        string: "String",
        boolean: "boolean",
        "array<int>": "int[]",
        "array<string>": "String[]",
        "matrix<int>": "int[][]",
        TreeNode: "TreeNode",
        ListNode: "ListNode",
      },
    };

    return mappings[language]?.[genericType] || genericType;
  }
}

module.exports = TypeSystem;
