// Auto-generated from subjects/dsa-code-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['dsa-code'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 3
  maxWidth: 440
---

# 🧱 Data Structures: Code & Operations in Java

## 🟢 Part I: Linear Data Structures

### 1. Dynamic Arrays & Memory Operations
#### Array Memory Architecture & Growth
- **Contiguous Allocation**: Elements stored in adjacent RAM addresses (\`Base + index * size\`)
- **Spatial Cache Locality**: Sequential access fills CPU L1/L2 cache lines (64 bytes); maximizes throughput
- **Geometric Resizing**:
  - Java \`ArrayList\` grows by $1.5\\times$ (\`newCapacity = oldCapacity + (oldCapacity >> 1)\`)
  - Allocates new contiguous array on Heap + copies elements via \`System.arraycopy()\`
  - Amortized cost per append: $\\mathcal{O}(1)$ | Single append worst-case: $\\mathcal{O}(N)$
#### Insertion Operations (Head, Tail, Index)
- **Insert at End (Append)**: $\\mathcal{O}(1)$ Amortized Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int[] append(int[] arr, int size, int capacity, int element) {
    if (size >= capacity) throw new IllegalStateException("Capacity full");
    arr[size] = element; // Direct O(1) assignment
    return arr;
  }
  \`\`\`
- **Insert at Head (Prepend)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int[] insertAtHead(int[] arr, int size, int capacity, int element) {
    if (size >= capacity) throw new IllegalStateException("Capacity full");
    // Shift all N elements one position to the right
    for (int i = size - 1; i >= 0; i--) {
      arr[i + 1] = arr[i];
    }
    arr[0] = element;
    return arr;
  }
  \`\`\`
- **Insert at Arbitrary Index $K$**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int[] insertAt(int[] arr, int size, int capacity, int index, int element) {
    if (size >= capacity) throw new IllegalStateException("Capacity full");
    if (index < 0 || index > size) throw new IndexOutOfBoundsException();

    // Shift elements rightward from end down to index
    for (int i = size - 1; i >= index; i--) {
      arr[i + 1] = arr[i];
    }
    arr[index] = element;
    return arr;
  }
  \`\`\`
#### Deletion Operations (Head, Tail, Index)
- **Delete at End (Pop)**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int pop(int[] arr, int size) {
    if (size <= 0) throw new IllegalStateException("Array empty");
    int removed = arr[size - 1];
    arr[size - 1] = 0; // Clear trailing slot
    return removed;    // O(1) instant return
  }
  \`\`\`
- **Delete at Head**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int deleteHead(int[] arr, int size) {
    if (size <= 0) throw new IllegalStateException("Array empty");
    int removed = arr[0];
    // Shift all remaining elements leftward
    for (int i = 0; i < size - 1; i++) {
      arr[i] = arr[i + 1];
    }
    arr[size - 1] = 0;
    return removed;
  }
  \`\`\`
- **Delete at Arbitrary Index $K$**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int deleteAt(int[] arr, int size, int index) {
    if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
    int removed = arr[index];

    // Shift elements leftward to overwrite deleted slot
    for (int i = index; i < size - 1; i++) {
      arr[i] = arr[i + 1];
    }
    arr[size - 1] = 0; // Clear trailing slot
    return removed;
  }
  \`\`\`
#### Lookup, Update & Search Operations
- **Update / Modify at Index**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static void updateAt(int[] arr, int size, int index, int val) {
    if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
    arr[index] = val; // Direct O(1) random access write
  }
  \`\`\`
- **Linear Search (Unsorted)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
- **Binary Search (Sorted Array)**: $\\mathcal{O}(\\log N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
      // Avoid integer overflow bug: low + (high - low) / 2
      int mid = low + ((high - low) >>> 1);
      if (arr[mid] == target) return mid;
      else if (arr[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return -1; // Target not found
  }
  \`\`\`
#### In-Place Array Reversal
- **Two-Pointer Reversal**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
      int temp = arr[left];
      arr[left++] = arr[right];
      arr[right--] = temp;
    }
  }
  \`\`\`

### 2. Singly Linked List Operations
#### Node Definition & Architecture
- **Heap Allocation**: Scattered non-contiguous nodes linked via reference pointers
- **Pointer Overhead**: Each node incurs 8–16 bytes extra memory for reference pointers
- **Standard Node Model**:
  \`\`\`java
  public class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }
  }
  \`\`\`
#### Insertion Operations (Head, Tail, Index, Node)
- **Insert at Head (Prepend)**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static ListNode insertAtHead(ListNode head, int val) {
    ListNode newNode = new ListNode(val);
    newNode.next = head;
    return newNode; // New head of list
  }
  \`\`\`
- **Insert at Tail (Append)**: $\\mathcal{O}(N)$ Time ($\\mathcal{O}(1)$ with tail reference) | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static ListNode insertAtTail(ListNode head, int val) {
    ListNode newNode = new ListNode(val);
    if (head == null) return newNode;
    ListNode curr = head;
    while (curr.next != null) {
      curr = curr.next;
    }
    curr.next = newNode;
    return head;
  }
  \`\`\`
- **Insert at Arbitrary Index $K$**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static ListNode insertAtIndex(ListNode head, int index, int val) {
    if (index < 0) throw new IndexOutOfBoundsException();
    if (index == 0) return insertAtHead(head, val);

    ListNode curr = head;
    for (int i = 0; i < index - 1 && curr != null; i++) {
      curr = curr.next;
    }
    if (curr == null) throw new IndexOutOfBoundsException();

    ListNode newNode = new ListNode(val);
    newNode.next = curr.next;
    curr.next = newNode;
    return head;
  }
  \`\`\`
- **Insert After a Given Node Reference**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static void insertAfter(ListNode node, int val) {
    if (node == null) return;
    ListNode newNode = new ListNode(val);
    newNode.next = node.next;
    node.next = newNode; // O(1) reference rewiring
  }
  \`\`\`
#### Deletion Operations (Head, Tail, Index, Node)
- **Delete Head Node**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static ListNode deleteHead(ListNode head) {
    if (head == null) return null;
    ListNode newHead = head.next;
    head.next = null; // Help JVM Garbage Collector
    return newHead;
  }
  \`\`\`
- **Delete Tail Node**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static ListNode deleteTail(ListNode head) {
    if (head == null || head.next == null) return null;
    ListNode curr = head;
    while (curr.next.next != null) {
      curr = curr.next;
    }
    curr.next = null; // Unlink last node
    return head;
  }
  \`\`\`
- **Delete at Arbitrary Index $K$**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static ListNode deleteAtIndex(ListNode head, int index) {
    if (head == null || index < 0) return head;
    if (index == 0) return deleteHead(head);

    ListNode curr = head;
    for (int i = 0; i < index - 1 && curr.next != null; i++) {
      curr = curr.next;
    }
    if (curr.next == null) return head; // Index beyond length

    ListNode target = curr.next;
    curr.next = target.next;
    target.next = null; // Clean reference
    return head;
  }
  \`\`\`
- **Delete Given Node Reference Without Head (LeetCode 237)**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static void deleteGivenNode(ListNode node) {
    // Copy data from next node, then bypass next node
    if (node == null || node.next == null) return;
    node.val = node.next.val;
    node.next = node.next.next;
  }
  \`\`\`
#### In-Place Reversal & Cycle Detection
- **Iterative 3-Pointer Reversal**: $\\mathcal{O}(N)$ Time | $mathcal{O}(1)$ Space
  \`\`\`java
  public static ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
      ListNode nextTemp = curr.next;
      curr.next = prev; // Reverse link
      prev = curr;
      curr = nextTemp;
    }
    return prev; // New head
  }
  \`\`\`
- **Floyd's Tortoise and Hare Cycle Detection (LeetCode 141)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow == fast) return true; // Cycle detected
    }
    return false;
  }
  \`\`\`

### 3. Doubly Linked List Operations
#### Bidirectional Node Architecture & Sentinels
- **Bidirectional Links**: Each node maintains both \`prev\` and \`next\` references
- **Sentinel Nodes**: Using dummy \`head\` and \`tail\` completely eliminates null-checking edge cases
  \`\`\`java
  public class DoublyNode {
    public int val;
    public DoublyNode prev, next;
    public DoublyNode(int val) { this.val = val; }
  }
  \`\`\`
#### Doubly Linked List Implementation (Head, Tail, Remove)
- **Insert at Head**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static void addFirst(DoublyNode headSentinel, int val) {
    DoublyNode node = new DoublyNode(val);
    node.next = headSentinel.next;
    node.prev = headSentinel;
    headSentinel.next.prev = node;
    headSentinel.next = node;
  }
  \`\`\`
- **Insert at Tail**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static void addLast(DoublyNode tailSentinel, int val) {
    DoublyNode node = new DoublyNode(val);
    node.prev = tailSentinel.prev;
    node.next = tailSentinel;
    tailSentinel.prev.next = node;
    tailSentinel.prev = node;
  }
  \`\`\`
- **Delete Arbitrary Node Reference**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static void removeNode(DoublyNode node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = null;
    node.next = null; // Isolate node for GC
  }
  \`\`\`
#### LRU Cache Node Extraction & Insertion Pattern
- **$O(1)$ Extract and Move to Head**: Foundation of high-throughput caching (LeetCode 146)
  \`\`\`java
  public static void moveToHead(DoublyNode headSentinel, DoublyNode node) {
    removeNode(node);
    node.next = headSentinel.next;
    node.prev = headSentinel;
    headSentinel.next.prev = node;
    headSentinel.next = node;
  }
  \`\`\`

### 4. Stack Operations & Memory Mechanics
#### Call Stack Architecture & Memory Layout
- **LIFO Discipline**: Last-In, First-Out memory semantics
- **JVM Call Stack**: Each method invocation pushes an execution stack frame (Local Variable Array + Operand Stack + Frame Data)
- **StackOverflowError**: Triggered when unbounded recursion exhausts thread stack memory (default 1024 KB via \`-Xss\`)
#### Array-Backed Stack Implementation
- **Direct Pointer Tracking**: $\\mathcal{O}(1)$ Push, Pop, Peek operations
  \`\`\`java
  public class ArrayStack {
    private int[] data;
    private int top = -1;
    private int capacity;

    public ArrayStack(int capacity) {
      this.capacity = capacity;
      this.data = new int[capacity];
    }

    public void push(int val) {
      if (top == capacity - 1) throw new IllegalStateException("Stack Overflow");
      data[++top] = val;
    }

    public int pop() {
      if (top == -1) throw new IllegalStateException("Stack Underflow");
      return data[top--];
    }

    public int peek() {
      if (top == -1) throw new IllegalStateException("Stack Underflow");
      return data[top];
    }

    public boolean isEmpty() { return top == -1; }
    public boolean isFull() { return top == capacity - 1; }
  }
  \`\`\`
#### Monotonic Stack Pattern (Next Greater Element)
- **Monotonic Decreasing Stack**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    java.util.Arrays.fill(result, -1);
    java.util.Deque<Integer> stack = new java.util.ArrayDeque<>(); // Stores indices

    for (int i = 0; i < n; i++) {
      while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
        int idx = stack.pop();
        result[idx] = nums[i];
      }
      stack.push(i);
    }
    return result;
  }
  \`\`\`
#### Balanced Parentheses Validation (LeetCode 20)
- **Stack Matching**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static boolean isValidParentheses(String s) {
    java.util.Deque<Character> stack = new java.util.ArrayDeque<>();
    for (char c : s.toCharArray()) {
      if (c == '(') stack.push(')');
      else if (c == '{') stack.push('}');
      else if (c == '[') stack.push(']');
      else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
  }
  \`\`\`

### 5. Queue & Circular Ring Buffer Operations
#### FIFO Operational Discipline
- **First-In, First-Out**: Elements enqueue at rear, dequeue from front
- **Standard Operations**: \`enqueue()\`, \`dequeue()\`, \`peek()\`, \`isEmpty()\`
- **Core Cost**: $\\mathcal{O}(1)$ Time | $\\mathcal{O}(1)$ Space
#### Circular Queue (Ring Buffer using Array)
- **Modulo Arithmetic**: Eliminates linear array shifting on dequeue via index wrap-around
  \`\`\`java
  public class CircularQueue {
    private int[] data;
    private int front, rear, size, capacity;

    public CircularQueue(int k) {
      this.capacity = k;
      this.data = new int[k];
      this.front = 0;
      this.rear = -1;
      this.size = 0;
    }

    public boolean enqueue(int val) {
      if (isFull()) return false;
      rear = (rear + 1) % capacity; // Modular wrap-around
      data[rear] = val;
      size++;
      return true;
    }

    public int dequeue() {
      if (isEmpty()) return -1;
      int removed = data[front];
      front = (front + 1) % capacity; // Advance front pointer
      size--;
      return removed;
    }

    public int front() { return isEmpty() ? -1 : data[front]; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull() { return size == capacity; }
  }
  \`\`\`
#### Linked-List Backed Queue
- **Two-Pointer Model (\`head\` & \`tail\`)**: $\\mathcal{O}(1)$ Enqueue & $\\mathcal{O}(1)$ Dequeue
  \`\`\`java
  public class LinkedQueue {
    private ListNode head, tail;

    public void enqueue(int val) {
      ListNode node = new ListNode(val);
      if (tail == null) {
        head = tail = node;
      } else {
        tail.next = node;
        tail = node; // O(1) append
      }
    }

    public int dequeue() {
      if (head == null) throw new IllegalStateException("Queue Empty");
      int val = head.val;
      head = head.next; // O(1) removal
      if (head == null) tail = null;
      return val;
    }
  }
  \`\`\`
#### Implement Queue using Stacks (LeetCode 232)
- **Two-Stack Model (\`inStack\` & \`outStack\`)**: Amortized $\\mathcal{O}(1)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public class MyQueue {
    private java.util.Deque<Integer> in = new java.util.ArrayDeque<>();
    private java.util.Deque<Integer> out = new java.util.ArrayDeque<>();

    public void push(int x) { in.push(x); }

    public int pop() {
      peek();
      return out.pop(); // Amortized O(1)
    }

    public int peek() {
      if (out.isEmpty()) {
        while (!in.isEmpty()) out.push(in.pop());
      }
      return out.peek();
    }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
  }
  \`\`\`
#### Sliding Window Maximum via Monotonic Deque (LeetCode 239)
- **Decreasing Deque Maintenance**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(K)$ Space
  \`\`\`java
  public static int[] maxSlidingWindow(int[] nums, int k) {
    if (nums == null || k <= 0) return new int[0];
    int n = nums.length;
    int[] result = new int[n - k + 1];
    java.util.Deque<Integer> deque = new java.util.ArrayDeque<>(); // Stores indices

    for (int i = 0; i < n; i++) {
      // 1. Remove indices outside current window
      while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
        deque.pollFirst();
      }
      // 2. Remove elements smaller than current element (maintain decreasing order)
      while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
        deque.pollLast();
      }
      deque.offerLast(i);

      // 3. Add to result once first window is complete
      if (i >= k - 1) {
        result[i - k + 1] = nums[deque.peekFirst()];
      }
    }
    return result;
  }
  \`\`\`

## 🟣 Part II: Non-Linear Data Structures

### 6. Binary Tree & Binary Search Tree (BST) Operations
#### Node Definition & Architecture
- **Hierarchical Non-Linear Structure**: Nodes link dynamically to \`left\` and \`right\` subtrees
- **Standard Node Model**:
  \`\`\`java
  public class TreeNode {
    public int val;
    public TreeNode left, right;
    public TreeNode(int val) { this.val = val; }
    public TreeNode(int val, TreeNode left, TreeNode right) {
      this.val = val; this.left = left; this.right = right;
    }
  }
  \`\`\`
#### BST Search & Insertion
- **BST Invariant**: \`left.val < root.val < right.val\` for every subtree
- **Iterative BST Search**: $\\mathcal{O}(H)$ Time ($\\mathcal{O}(\\log N)$ balanced) | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static TreeNode searchBST(TreeNode root, int val) {
    while (root != null && root.val != val) {
      root = (val < root.val) ? root.left : root.right;
    }
    return root; // Target node or null if not found
  }
  \`\`\`
- **Iterative BST Insertion**: $\\mathcal{O}(H)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static TreeNode insertBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    TreeNode curr = root;
    while (true) {
      if (val < curr.val) {
        if (curr.left == null) { curr.left = new TreeNode(val); break; }
        curr = curr.left;
      } else {
        if (curr.right == null) { curr.right = new TreeNode(val); break; }
        curr = curr.right;
      }
    }
    return root;
  }
  \`\`\`
#### BST Deletion (The 3 Classic Cases - LeetCode 450)
- **Node Removal Algorithm**: $\\mathcal{O}(H)$ Time | $\\mathcal{O}(H)$ Call Stack Space
  - **Case 1 & 2**: Target has 0 or 1 child $\\rightarrow$ Return non-null child directly
  - **Case 3**: Target has 2 children $\\rightarrow$ Swap with Inorder Successor (minimum in right subtree)
  \`\`\`java
  public static TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
      // Case 1 & 2: Leaf or single child
      if (root.left == null) return root.right;
      if (root.right == null) return root.left;

      // Case 3: Two children -> find Inorder Successor (min in right subtree)
      TreeNode successor = root.right;
      while (successor.left != null) successor = successor.left;
      root.val = successor.val; // Overwrite value
      root.right = deleteNode(root.right, successor.val); // Recursively delete successor
    }
    return root;
  }
  \`\`\`
#### Validate BST (Upper & Lower Bound Invariant - LeetCode 98)
- **Strict Bound Verification**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(H)$ Call Stack Space
  \`\`\`java
  public static boolean isValidBST(TreeNode root) {
    return validate(root, null, null);
  }
  private static boolean validate(TreeNode node, Long min, Long max) {
    if (node == null) return true;
    if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
      return false; // Invariant violated
    }
    return validate(node.left, min, (long) node.val) &&
           validate(node.right, (long) node.val, max);
  }
  \`\`\`
#### Tree Height, Diameter & Inversion (LeetCode 104, 543, 226)
- **Maximum Depth / Height**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(H)$ Space
  \`\`\`java
  public static int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
  }
  \`\`\`
- **Diameter of Binary Tree (Longest Path)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(H)$ Space
  \`\`\`java
  private static int maxDiameter = 0;
  public static int diameterOfBinaryTree(TreeNode root) {
    maxDiameter = 0;
    heightHelper(root);
    return maxDiameter;
  }
  private static int heightHelper(TreeNode node) {
    if (node == null) return 0;
    int leftH = heightHelper(node.left);
    int rightH = heightHelper(node.right);
    maxDiameter = Math.max(maxDiameter, leftH + rightH);
    return 1 + Math.max(leftH, rightH);
  }
  \`\`\`
- **Invert / Mirror Binary Tree**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(H)$ Space
  \`\`\`java
  public static TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
  }
  \`\`\`
#### Tree Traversals (BFS & LCA - LeetCode 102 & 236)
- **Level-Order BFS (Queue Based)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(W)$ Space ($W$ = max level width)
  \`\`\`java
  public static java.util.List<java.util.List<Integer>> levelOrder(TreeNode root) {
    java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
    if (root == null) return result;
    java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
      int levelSize = queue.size();
      java.util.List<Integer> currentLevel = new java.util.ArrayList<>();
      for (int i = 0; i < levelSize; i++) {
        TreeNode node = queue.poll();
        currentLevel.add(node.val);
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
      }
      result.add(currentLevel);
    }
    return result;
  }
  \`\`\`
- **Lowest Common Ancestor (LCA)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(H)$ Space
  \`\`\`java
  public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root; // p and q diverge in subtrees
    return left != null ? left : right;
  }
  \`\`\`

### 7. Binary Heap & Priority Queue Operations
#### Complete Binary Tree Array Index Math
- Parent and child indices in contiguous memory:
  - \`parent(i) = (i - 1) / 2\`
  - \`leftChild(i) = 2 * i + 1\`
  - \`rightChild(i) = 2 * i + 2\`
#### Min-Heap Implementation from Scratch
- **Array-Backed Binary Heap**: $\\mathcal{O}(\\log N)$ Insert & Extract | $\\mathcal{O}(1)$ Peek
  \`\`\`java
  public class MinHeap {
    private int[] heap;
    private int size, capacity;

    public MinHeap(int capacity) {
      this.capacity = capacity;
      this.heap = new int[capacity];
      this.size = 0;
    }

    // Sift-Up on insert: O(log N)
    public void insert(int val) {
      if (size == capacity) throw new IllegalStateException("Heap full");
      heap[size] = val;
      int curr = size++;
      while (curr > 0 && heap[curr] < heap[(curr - 1) / 2]) {
        swap(curr, (curr - 1) / 2);
        curr = (curr - 1) / 2;
      }
    }

    // Sift-Down on extraction: O(log N)
    public int extractMin() {
      if (size <= 0) throw new IllegalStateException("Heap empty");
      int minVal = heap[0];
      heap[0] = heap[--size]; // Move last leaf to root
      siftDown(0);
      return minVal;
    }

    private void siftDown(int i) {
      int smallest = i, left = 2 * i + 1, right = 2 * i + 2;
      if (left < size && heap[left] < heap[smallest]) smallest = left;
      if (right < size && heap[right] < heap[smallest]) smallest = right;
      if (smallest != i) {
        swap(i, smallest);
        siftDown(smallest);
      }
    }

    private void swap(int i, int j) { int t = heap[i]; heap[i] = heap[j]; heap[j] = t; }
    public int peek() { return size > 0 ? heap[0] : -1; }
  }
  \`\`\`
#### Floyd's In-Place O(N) Heapify
- **Bottom-Up Sift-Down**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ In-Place Space
  \`\`\`java
  public static void heapify(int[] arr) {
    int n = arr.length;
    // Start from last non-leaf node down to root
    for (int i = (n / 2) - 1; i >= 0; i--) {
      int curr = i;
      while (2 * curr + 1 < n) {
        int sm = curr, l = 2 * curr + 1, r = 2 * curr + 2;
        if (l < n && arr[l] < arr[sm]) sm = l;
        if (r < n && arr[r] < arr[sm]) sm = r;
        if (sm == curr) break;
        int t = arr[curr]; arr[curr] = arr[sm]; arr[sm] = t;
        curr = sm;
      }
    }
  }
  \`\`\`
#### Top-K Pattern & PriorityQueue Mechanics (LeetCode 215 / 347)
- **Kth Largest via Fixed-Size Min-Heap**: $\\mathcal{O}(N \\log K)$ Time | $\\mathcal{O}(K)$ Space
  \`\`\`java
  public static int findKthLargest(int[] nums, int k) {
    // Min-heap keeps top K largest elements; root is the Kth largest
    java.util.PriorityQueue<Integer> minHeap = new java.util.PriorityQueue<>();
    for (int num : nums) {
      minHeap.offer(num);
      if (minHeap.size() > k) minHeap.poll(); // Evict smallest beyond size K
    }
    return minHeap.peek();
  }
  \`\`\`
- **Max-Heap Comparator in Java**:
  \`\`\`java
  // Invert priority using lambda comparator: (a, b) -> b - a
  java.util.PriorityQueue<Integer> maxHeap = new java.util.PriorityQueue<>((a, b) -> b - a);
  \`\`\`

### 8. Trie (Prefix Tree) Operations
#### Trie Node Architecture & Memory Layout
- **26-Way Fixed Branching**: Each node allocates \`TrieNode[26]\` storing child pointers for characters \`'a'\` through \`'z'\`
- **Index Math**: Character mapping via \`int idx = c - 'a'\` (0 to 25)
- **Memory vs Hash Table**: Avoids dynamic hashing collisions; fast $\\mathcal{O}(L)$ deterministic access; trades off higher memory footprint
  \`\`\`java
  public class TrieNode {
    public TrieNode[] children = new TrieNode[26];
    public boolean isEnd = false;
    public int countPrefix = 0; // Tracks words sharing this prefix (Trie II)
    public int countEndsWith = 0; // Tracks exact word frequency (Trie II)
  }
  \`\`\`
#### Complete Standard Trie Implementation (LeetCode 208)
- **Deterministic Prefix Lookup**: $\\mathcal{O}(L)$ Time where $L$ is word length | $\\mathcal{O}(L)$ Space
  \`\`\`java
  public class Trie {
    private TrieNode root = new TrieNode();

    // Insert word: O(L) Time
    public void insert(String word) {
      if (word == null) return;
      TrieNode curr = root;
      for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
        curr = curr.children[idx];
      }
      curr.isEnd = true;
    }

    // Search exact word: O(L) Time
    public boolean search(String word) {
      if (word == null) return false;
      TrieNode node = findPrefix(word);
      return node != null && node.isEnd;
    }

    // Search prefix (Autocomplete): O(L) Time
    public boolean startsWith(String prefix) {
      if (prefix == null) return false;
      return findPrefix(prefix) != null;
    }

    private TrieNode findPrefix(String str) {
      if (str == null) return null;
      TrieNode curr = root;
      for (char c : str.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) return null;
        curr = curr.children[idx];
      }
      return curr;
    }
  }
  \`\`\`
#### Word Deletion with Recursive Branch Pruning
- **Memory Cleanup & Node Pruning**: $\\mathcal{O}(L)$ Time | $\\mathcal{O}(L)$ Call Stack Space
  - Unmarks target word's \`isEnd\` flag
  - Post-order traversal deletes orphaned child nodes that are no longer part of any other stored word
  \`\`\`java
  public boolean delete(String word) {
    if (word == null) return false;
    return deleteHelper(root, word, 0);
  }

  private boolean deleteHelper(TrieNode curr, String word, int depth) {
    if (curr == null) return false;

    // Base Case: reached end of word
    if (depth == word.length()) {
      if (!curr.isEnd) return false; // Word does not exist in Trie
      curr.isEnd = false; // Unmark terminal node
      return hasNoChildren(curr); // If true, parent can prune this node
    }

    int idx = word.charAt(depth) - 'a';
    boolean shouldPruneChild = deleteHelper(curr.children[idx], word, depth + 1);

    if (shouldPruneChild) {
      curr.children[idx] = null; // Unlink dead branch node for JVM GC
      // Only prune current node if it's not a word itself and has no other children
      return !curr.isEnd && hasNoChildren(curr);
    }
    return false;
  }

  private boolean hasNoChildren(TrieNode node) {
    for (TrieNode child : node.children) {
      if (child != null) return false;
    }
    return true;
  }
  \`\`\`
#### Trie II: Prefix & Word Frequency Counter (LeetCode 1804)
- **Prefix and Terminal Frequency Tracking**: $\\mathcal{O}(L)$ Time | $\\mathcal{O}(L)$ Space
  \`\`\`java
  public class TrieII {
    private TrieNode root = new TrieNode();

    public void insert(String word) {
      if (word == null) return;
      TrieNode curr = root;
      for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
        curr = curr.children[idx];
        curr.countPrefix++;
      }
      curr.countEndsWith++;
    }

    public int countWordsEqualTo(String word) {
      if (word == null) return 0;
      TrieNode curr = root;
      for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) return 0;
        curr = curr.children[idx];
      }
      return curr.countEndsWith;
    }

    public int countWordsStartingWith(String prefix) {
      if (prefix == null) return 0;
      TrieNode curr = root;
      for (char c : prefix.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) return 0;
        curr = curr.children[idx];
      }
      return curr.countPrefix;
    }

    public void erase(String word) {
      if (word == null || countWordsEqualTo(word) == 0) return;
      TrieNode curr = root;
      for (char c : word.toCharArray()) {
        int idx = c - 'a';
        TrieNode next = curr.children[idx];
        next.countPrefix--;
        curr = next;
      }
      curr.countEndsWith--;
    }
  }
  \`\`\`
#### Wildcard Search with Dot '.' Pattern (LeetCode 211)
- **DFS Backtracking on Wildcards**: $\\mathcal{O}(26^K \\times L)$ worst-case for $K$ dots | $\\mathcal{O}(L)$ Space
  \`\`\`java
  public boolean searchWildcard(String word) {
    if (word == null) return false;
    return dfsWildcard(word, 0, root);
  }

  private boolean dfsWildcard(String word, int index, TrieNode curr) {
    if (curr == null) return false;
    if (index == word.length()) return curr.isEnd;

    char c = word.charAt(index);
    if (c == '.') {
      // Branch across all 26 possible children
      for (int i = 0; i < 26; i++) {
        if (curr.children[i] != null && dfsWildcard(word, index + 1, curr.children[i])) {
          return true;
        }
      }
      return false;
    } else {
      int idx = c - 'a';
      return dfsWildcard(word, index + 1, curr.children[idx]);
    }
  }
  \`\`\`


### 9. Graph Representations & Traversal Operations
#### Graph Representations: Adjacency List vs Matrix
- **Adjacency List (\`List<List<Integer>>\`)**: $\\mathcal{O}(V + E)$ Space | Standard for sparse graphs ($E \\ll V^2$)
- **Adjacency Matrix (\`int[][]\`)**: $\\mathcal{O}(V^2)$ Space | $\\mathcal{O}(1)$ edge lookup | Ideal for dense graphs
  \`\`\`java
  public static java.util.List<java.util.List<Integer>> buildGraph(int n, int[][] edges) {
    java.util.List<java.util.List<Integer>> adj = new java.util.ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new java.util.ArrayList<>());
    for (int[] edge : edges) {
      adj.get(edge[0]).add(edge[1]); // Directed edge u -> v
      // adj.get(edge[1]).add(edge[0]); // Uncomment for undirected edge
    }
    return adj;
  }
  \`\`\`
#### Breadth-First Search (BFS - Shortest Path)
- **Queue-Based Traversal**: $\\mathcal{O}(V + E)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static void bfs(int start, java.util.List<java.util.List<Integer>> adj, int n) {
    boolean[] visited = new boolean[n];
    java.util.Queue<Integer> queue = new java.util.LinkedList<>();
    visited[start] = true;
    queue.offer(start);

    while (!queue.isEmpty()) {
      int u = queue.poll();
      for (int v : adj.get(u)) {
        if (!visited[v]) {
          visited[v] = true;
          queue.offer(v); // Explore level by level
        }
      }
    }
  }
  \`\`\`
#### Depth-First Search (DFS - Traversal & Cycle Detection)
- **3-Color Cycle Detection in Directed Graph**: $\\mathcal{O}(V + E)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static boolean hasCycleDirected(int n, java.util.List<java.util.List<Integer>> adj) {
    int[] state = new int[n]; // 0 = unvisited, 1 = visiting (on stack), 2 = visited
    for (int i = 0; i < n; i++) {
      if (state[i] == 0 && dfsCycle(i, adj, state)) return true;
    }
    return false;
  }
  private static boolean dfsCycle(int u, java.util.List<java.util.List<Integer>> adj, int[] state) {
    state[u] = 1; // Mark as visiting on current recursion path
    for (int v : adj.get(u)) {
      if (state[v] == 1) return true; // Back-edge found -> cycle detected!
      if (state[v] == 0 && dfsCycle(v, adj, state)) return true;
    }
    state[u] = 2; // Mark fully explored
    return false;
  }
  \`\`\`
#### Topological Sort (Kahn's In-Degree Algorithm - LeetCode 207 / 210)
- **BFS In-Degree Reduction**: $\\mathcal{O}(V + E)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static int[] topoSortKahn(int numNodes, int[][] prerequisites) {
    int[] inDegree = new int[numNodes];
    java.util.List<java.util.List<Integer>> adj = new java.util.ArrayList<>();
    for (int i = 0; i < numNodes; i++) adj.add(new java.util.ArrayList<>());
    for (int[] p : prerequisites) {
      adj.get(p[1]).add(p[0]); // p[1] must precede p[0]
      inDegree[p[0]]++;
    }

    java.util.Queue<Integer> queue = new java.util.LinkedList<>();
    for (int i = 0; i < numNodes; i++) {
      if (inDegree[i] == 0) queue.offer(i);
    }

    int[] order = new int[numNodes];
    int idx = 0;
    while (!queue.isEmpty()) {
      int curr = queue.poll();
      order[idx++] = curr;
      for (int next : adj.get(curr)) {
        if (--inDegree[next] == 0) queue.offer(next);
      }
    }
    return idx == numNodes ? order : new int[0]; // Empty array if cycle exists
  }
  \`\`\`

### 10. Disjoint Set Union (Union-Find)
#### Disjoint Set Forest Architecture
- **Path Compression**: Flattens node-to-root pointers on lookup to achieve nearly $\\mathcal{O}(1)$ query time
- **Union by Rank**: Always attaches shorter tree under taller tree root to minimize maximum tree depth
#### Production Union-Find Implementation (LeetCode 547 / 684)
- **Ackermann Inverse Amortized Time**: $\\mathcal{O}(\\alpha(N)) \\approx \\mathcal{O}(1)$ Time per operation
  \`\`\`java
  public class UnionFind {
    private int[] parent, rank;
    public int count; // Connected components tracker

    public UnionFind(int n) {
      parent = new int[n];
      rank = new int[n];
      count = n;
      for (int i = 0; i < n; i++) parent[i] = i; // Self-representative
    }

    // Find with Path Compression: O(alpha(N))
    public int find(int i) {
      if (parent[i] != i) {
        parent[i] = find(parent[i]); // Path compression
      }
      return parent[i];
    }

    // Union by Rank: O(alpha(N))
    public boolean union(int i, int j) {
      int rootI = find(i), rootJ = find(j);
      if (rootI == rootJ) return false; // Cycle detected!

      if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
      else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
      else {
        parent[rootJ] = rootI;
        rank[rootI]++;
      }
      count--;
      return true;
    }
  }
  \`\`\`

### 11. Range Query Trees (Segment Tree & Fenwick Tree)
#### Segment Tree (Build, Point Update, Range Sum Query - LeetCode 307)
- **Interval Binary Representation**: $\\mathcal{O}(N)$ Build | $\\mathcal{O}(\\log N)$ Update | $\\mathcal{O}(\\log N)$ Range Query
  \`\`\`java
  public class SegmentTree {
    private int[] tree;
    private int n;

    public SegmentTree(int[] nums) {
      if (nums.length > 0) {
        n = nums.length;
        tree = new int[4 * n]; // Safe 4N buffer
        build(nums, 0, 0, n - 1);
      }
    }

    // Build tree: O(N) Time
    private void build(int[] nums, int node, int start, int end) {
      if (start == end) { tree[node] = nums[start]; return; }
      int mid = start + (end - start) / 2;
      build(nums, 2 * node + 1, start, mid);
      build(nums, 2 * node + 2, mid + 1, end);
      tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    // Point Update: O(log N) Time
    public void update(int index, int val) { update(0, 0, n - 1, index, val); }
    private void update(int node, int start, int end, int idx, int val) {
      if (start == end) { tree[node] = val; return; }
      int mid = start + (end - start) / 2;
      if (idx <= mid) update(2 * node + 1, start, mid, idx, val);
      else update(2 * node + 2, mid + 1, end, idx, val);
      tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    // Range Sum Query: O(log N) Time
    public int query(int left, int right) { return query(0, 0, n - 1, left, right); }
    private int query(int node, int start, int end, int l, int r) {
      if (r < start || end < l) return 0; // Out of bounds
      if (l <= start && end <= r) return tree[node]; // Total overlap
      int mid = start + (end - start) / 2;
      return query(2 * node + 1, start, mid, l, r) +
             query(2 * node + 2, mid + 1, end, l, r);
    }
  }
  \`\`\`
#### Binary Indexed Tree / Fenwick Tree (Bit Manipulation LSB)
- **Least Significant Bit (LSB) Mechanics**: $\\mathcal{O}(N)$ Space | $\\mathcal{O}(\\log N)$ Update | $\\mathcal{O}(\\log N)$ Range Query
  - Isolate lowest set bit using two's complement: \`LSB(x) = x & (-x)\`
  - \`add(i, delta)\`: Cascade upward by adding LSB (\`idx += (idx & -idx)\`)
  - \`query(i)\`: Accumulate downward by subtracting LSB (\`idx -= (idx & -idx)\`)
  \`\`\`java
  public class FenwickTree {
    private int[] bit;
    private int n;

    public FenwickTree(int n) {
      this.n = n;
      this.bit = new int[n + 1]; // 1-indexed internal array
    }

    // Point Update: Add delta to index i (0-indexed): O(log N)
    public void add(int i, int delta) {
      for (int idx = i + 1; idx <= n; idx += (idx & -idx)) {
        bit[idx] += delta;
      }
    }

    // Prefix Sum [0...i]: O(log N)
    public int query(int i) {
      int sum = 0;
      for (int idx = i + 1; idx > 0; idx -= (idx & -idx)) {
        sum += bit[idx];
      }
      return sum;
    }

    // Range Sum Query [left...right]: O(log N)
    public int rangeQuery(int left, int right) {
      return query(right) - (left > 0 ? query(left - 1) : 0);
    }
  }
  \`\`\`
`;
