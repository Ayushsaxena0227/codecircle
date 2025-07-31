// utils/dataStructureHandler.js
// Handles complex data structures like trees, linked lists, etc.

class DataStructureHandler {
  // Convert array representation to actual tree/list structures
  static buildDataStructure(value, type, language) {
    switch (type) {
      case "TreeNode":
        return this.buildTreeNode(value, language);
      case "ListNode":
        return this.buildListNode(value, language);
      default:
        return value;
    }
  }

  // Build tree from array representation
  static buildTreeNode(arr, language) {
    if (!arr || arr.length === 0) {
      return language === "cpp" ? "nullptr" : "null";
    }

    switch (language) {
      case "cpp":
        return this.buildTreeNodeCpp(arr);
      case "python":
        return this.buildTreeNodePython(arr);
      case "javascript":
        return this.buildTreeNodeJavaScript(arr);
      case "java":
        return this.buildTreeNodeJava(arr);
      default:
        return "null";
    }
  }

  static buildTreeNodeCpp(arr) {
    if (!arr || arr.length === 0) return "nullptr";

    return `buildTree({${arr
      .map((val) => (val === null ? "INT_MIN" : val))
      .join(", ")}})`;
  }

  static buildTreeNodePython(arr) {
    if (!arr || arr.length === 0) return "None";

    return `build_tree([${arr
      .map((val) => (val === null ? "None" : val))
      .join(", ")}])`;
  }

  static buildTreeNodeJavaScript(arr) {
    if (!arr || arr.length === 0) return "null";

    return `buildTree([${arr
      .map((val) => (val === null ? "null" : val))
      .join(", ")}])`;
  }

  static buildTreeNodeJava(arr) {
    if (!arr || arr.length === 0) return "null";

    return `buildTree(new Integer[]{${arr
      .map((val) => (val === null ? "null" : val))
      .join(", ")}})`;
  }

  // Build linked list from array representation
  static buildListNode(arr, language) {
    if (!arr || arr.length === 0) {
      return language === "cpp" ? "nullptr" : "null";
    }

    switch (language) {
      case "cpp":
        return this.buildListNodeCpp(arr);
      case "python":
        return this.buildListNodePython(arr);
      case "javascript":
        return this.buildListNodeJavaScript(arr);
      case "java":
        return this.buildListNodeJava(arr);
      default:
        return "null";
    }
  }

  static buildListNodeCpp(arr) {
    return `buildList({${arr.join(", ")}})`;
  }

  static buildListNodePython(arr) {
    return `build_list([${arr.join(", ")}])`;
  }

  static buildListNodeJavaScript(arr) {
    return `buildList([${arr.join(", ")}])`;
  }

  static buildListNodeJava(arr) {
    return `buildList(new int[]{${arr.join(", ")}})`;
  }

  // Generate helper functions for building data structures
  static getHelperFunctions(language, requiredTypes) {
    const helpers = [];

    if (requiredTypes.includes("TreeNode")) {
      helpers.push(this.getTreeBuildHelper(language));
    }

    if (requiredTypes.includes("ListNode")) {
      helpers.push(this.getListBuildHelper(language));
    }

    return helpers.join("\n\n");
  }

  static getTreeBuildHelper(language) {
    switch (language) {
      case "cpp":
        return `TreeNode* buildTree(vector<int> vals) {
    if (vals.empty()) return nullptr;
    
    TreeNode* root = new TreeNode(vals[0]);
    queue<TreeNode*> q;
    q.push(root);
    
    int i = 1;
    while (!q.empty() && i < vals.size()) {
        TreeNode* node = q.front();
        q.pop();
        
        if (i < vals.size() && vals[i] != INT_MIN) {
            node->left = new TreeNode(vals[i]);
            q.push(node->left);
        }
        i++;
        
        if (i < vals.size() && vals[i] != INT_MIN) {
            node->right = new TreeNode(vals[i]);
            q.push(node->right);
        }
        i++;
    }
    
    return root;
}`;

      case "python":
        return `def build_tree(vals):
    if not vals:
        return None
    
    root = TreeNode(vals[0])
    queue = [root]
    i = 1
    
    while queue and i < len(vals):
        node = queue.pop(0)
        
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            queue.append(node.left)
        i += 1
        
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            queue.append(node.right)
        i += 1
    
    return root`;

      case "javascript":
        return `function buildTree(vals) {
    if (!vals || vals.length === 0) return null;
    
    const root = new TreeNode(vals[0]);
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < vals.length) {
        const node = queue.shift();
        
        if (i < vals.length && vals[i] !== null) {
            node.left = new TreeNode(vals[i]);
            queue.push(node.left);
        }
        i++;
        
        if (i < vals.length && vals[i] !== null) {
            node.right = new TreeNode(vals[i]);
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}`;

      case "java":
        return `private TreeNode buildTree(Integer[] vals) {
    if (vals == null || vals.length == 0) return null;
    
    TreeNode root = new TreeNode(vals[0]);
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    int i = 1;
    while (!queue.isEmpty() && i < vals.length) {
        TreeNode node = queue.poll();
        
        if (i < vals.length && vals[i] != null) {
            node.left = new TreeNode(vals[i]);
            queue.offer(node.left);
        }
        i++;
        
        if (i < vals.length && vals[i] != null) {
            node.right = new TreeNode(vals[i]);
            queue.offer(node.right);
        }
        i++;
    }
    
    return root;
}`;

      default:
        return "";
    }
  }

  static getListBuildHelper(language) {
    switch (language) {
      case "cpp":
        return `ListNode* buildList(vector<int> vals) {
    if (vals.empty()) return nullptr;
    
    ListNode* head = new ListNode(vals[0]);
    ListNode* current = head;
    
    for (int i = 1; i < vals.size(); i++) {
        current->next = new ListNode(vals[i]);
        current = current->next;
    }
    
    return head;
}`;

      case "python":
        return `def build_list(vals):
    if not vals:
        return None
    
    head = ListNode(vals[0])
    current = head
    
    for i in range(1, len(vals)):
        current.next = ListNode(vals[i])
        current = current.next
    
    return head`;

      case "javascript":
        return `function buildList(vals) {
    if (!vals || vals.length === 0) return null;
    
    const head = new ListNode(vals[0]);
    let current = head;
    
    for (let i = 1; i < vals.length; i++) {
        current.next = new ListNode(vals[i]);
        current = current.next;
    }
    
    return head;
}`;

      case "java":
        return `private ListNode buildList(int[] vals) {
    if (vals == null || vals.length == 0) return null;
    
    ListNode head = new ListNode(vals[0]);
    ListNode current = head;
    
    for (int i = 1; i < vals.length; i++) {
        current.next = new ListNode(vals[i]);
        current = current.next;
    }
    
    return head;
}`;

      default:
        return "";
    }
  }

  // Convert output back to array format for comparison
  static serializeOutput(output, type, language) {
    switch (type) {
      case "TreeNode":
        return this.serializeTree(output, language);
      case "ListNode":
        return this.serializeList(output, language);
      default:
        return output;
    }
  }

  static serializeTree(output, language) {
    // This would need to be implemented based on how the output is formatted
    // For now, assume output is already in array format or null
    if (!output || output === "null" || output === "nullptr") {
      return [];
    }

    try {
      return JSON.parse(output);
    } catch {
      return output;
    }
  }

  static serializeList(output, language) {
    // Similar to tree serialization
    if (!output || output === "null" || output === "nullptr") {
      return [];
    }

    try {
      return JSON.parse(output);
    } catch {
      return output;
    }
  }

  // Get output formatting for complex data structures
  static getOutputFormat(returnType, language) {
    if (returnType === "TreeNode") {
      return this.getTreeOutputFormat(language);
    }

    if (returnType === "ListNode") {
      return this.getListOutputFormat(language);
    }

    // Default output format
    switch (language) {
      case "cpp":
        return "cout << result;";
      case "python":
        return "print(result)";
      case "javascript":
        return "console.log(result);";
      case "java":
        return "System.out.println(result);";
      default:
        return "print(result)";
    }
  }

  static getTreeOutputFormat(language) {
    switch (language) {
      case "cpp":
        return `printTree(result);`;
      case "python":
        return `print_tree(result)`;
      case "javascript":
        return `printTree(result);`;
      case "java":
        return `printTree(result);`;
      default:
        return "print(result)";
    }
  }

  static getListOutputFormat(language) {
    switch (language) {
      case "cpp":
        return `printList(result);`;
      case "python":
        return `print_list(result)`;
      case "javascript":
        return `printList(result);`;
      case "java":
        return `printList(result);`;
      default:
        return "print(result)";
    }
  }

  // Get print helper functions
  static getPrintHelpers(language, requiredTypes) {
    const helpers = [];

    if (requiredTypes.includes("TreeNode")) {
      helpers.push(this.getTreePrintHelper(language));
    }

    if (requiredTypes.includes("ListNode")) {
      helpers.push(this.getListPrintHelper(language));
    }

    return helpers.join("\n\n");
  }

  static getTreePrintHelper(language) {
    switch (language) {
      case "cpp":
        return `void printTree(TreeNode* root) {
    if (!root) {
        cout << "[]";
        return;
    }
    
    vector<string> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        
        if (node) {
            result.push_back(to_string(node->val));
            q.push(node->left);
            q.push(node->right);
        } else {
            result.push_back("null");
        }
    }
    
    // Remove trailing nulls
    while (!result.empty() && result.back() == "null") {
        result.pop_back();
    }
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << ",";
        cout << result[i];
    }
    cout << "]";
}`;

      case "python":
        return `def print_tree(root):
    if not root:
        print("[]")
        return
    
    result = []
    queue = [root]
    
    while queue:
        node = queue.pop(0)
        
        if node:
            result.append(str(node.val))
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append("null")
    
    # Remove trailing nulls
    while result and result[-1] == "null":
        result.pop()
    
    print(json.dumps(result))`;

      case "javascript":
        return `function printTree(root) {
    if (!root) {
        console.log("[]");
        return;
    }
    
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
    
    console.log(JSON.stringify(result));
}`;

      case "java":
        return `private void printTree(TreeNode root) {
    if (root == null) {
        System.out.println("[]");
        return;
    }
    
    List<String> result = new ArrayList<>();
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        
        if (node != null) {
            result.add(String.valueOf(node.val));
            queue.offer(node.left);
            queue.offer(node.right);
        } else {
            result.add("null");
        }
    }
    
    // Remove trailing nulls
    while (!result.isEmpty() && result.get(result.size() - 1).equals("null")) {
        result.remove(result.size() - 1);
    }
    
    System.out.println(result);
}`;

      default:
        return "";
    }
  }

  static getListPrintHelper(language) {
    switch (language) {
      case "cpp":
        return `void printList(ListNode* head) {
    vector<int> result;
    ListNode* current = head;
    
    while (current) {
        result.push_back(current->val);
        current = current->next;
    }
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << ",";
        cout << result[i];
    }
    cout << "]";
}`;

      case "python":
        return `def print_list(head):
    result = []
    current = head
    
    while current:
        result.append(current.val)
        current = current.next
    
    print(json.dumps(result))`;

      case "javascript":
        return `function printList(head) {
    const result = [];
    let current = head;
    
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    
    console.log(JSON.stringify(result));
}`;

      case "java":
        return `private void printList(ListNode head) {
    List<Integer> result = new ArrayList<>();
    ListNode current = head;
    
    while (current != null) {
        result.add(current.val);
        current = current.next;
    }
    
    System.out.println(result);
}`;

      default:
        return "";
    }
  }

  // Check if a type requires special handling
  static requiresSpecialHandling(type) {
    return ["TreeNode", "ListNode"].includes(type);
  }

  // Get all required types from problem parameters and return type
  static getRequiredTypes(problem) {
    const types = new Set();

    problem.parameters.forEach((param) => {
      if (this.requiresSpecialHandling(param.type)) {
        types.add(param.type);
      }
    });

    if (this.requiresSpecialHandling(problem.returnType)) {
      types.add(problem.returnType);
    }

    return Array.from(types);
  }
}

module.exports = DataStructureHandler;
