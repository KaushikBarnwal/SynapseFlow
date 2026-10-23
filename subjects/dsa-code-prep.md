---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 440
---

# 🧱 Linear Data Structures (Code & Operations in Java)

## 1. Dynamic Arrays & Memory Operations
### Array Memory Architecture & Growth
- **Contiguous Allocation**: Elements stored in adjacent RAM addresses (`Base + index * size`)
- **Spatial Cache Locality**: Sequential access fills CPU L1/L2 cache lines (64 bytes); maximizes throughput
- **Geometric Resizing**:
  - Java `ArrayList` grows by $1.5\times$ (`newCapacity = oldCapacity + (oldCapacity >> 1)`)
  - Allocates new contiguous array on Heap + copies elements via `System.arraycopy()`
  - Amortized cost per append: $\mathcal{O}(1)$ | Single append worst-case: $\mathcal{O}(N)$
### Insertion Operations (Head, Tail, Index)
- **Insert at End (Append)**: $\mathcal{O}(1)$ Amortized Time | $\mathcal{O}(1)$ Space
  ```java
  public static int[] append(int[] arr, int size, int capacity, int element) {
    if (size >= capacity) throw new IllegalStateException("Capacity full");
    arr[size] = element; // Direct O(1) assignment
    return arr;
  }
  ```
- **Insert at Head (Prepend)**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static int[] insertAtHead(int[] arr, int size, int capacity, int element) {
    if (size >= capacity) throw new IllegalStateException("Capacity full");
    // Shift all N elements one position to the right
    for (int i = size - 1; i >= 0; i--) {
      arr[i + 1] = arr[i];
    }
    arr[0] = element;
    return arr;
  }
  ```
- **Insert at Arbitrary Index $K$**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
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
  ```
### Deletion Operations (Head, Tail, Index)
- **Delete at End (Pop)**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static int pop(int[] arr, int size) {
    if (size <= 0) throw new IllegalStateException("Array empty");
    int removed = arr[size - 1];
    arr[size - 1] = 0; // Clear trailing slot
    return removed;    // O(1) instant return
  }
  ```
- **Delete at Head**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
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
  ```
- **Delete at Arbitrary Index $K$**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
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
  ```
### Lookup, Update & Search Operations
- **Update / Modify at Index**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static void updateAt(int[] arr, int size, int index, int val) {
    if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
    arr[index] = val; // Direct O(1) random access write
  }
  ```
- **Linear Search (Unsorted)**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
- **Binary Search (Sorted Array)**: $\mathcal{O}(\log N)$ Time | $\mathcal{O}(1)$ Space
  ```java
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
  ```
### In-Place Array Reversal
- **Two-Pointer Reversal**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
      int temp = arr[left];
      arr[left++] = arr[right];
      arr[right--] = temp;
    }
  }
  ```

## 2. Singly Linked List Operations
### Node Definition & Architecture
- **Heap Allocation**: Scattered non-contiguous nodes linked via reference pointers
- **Pointer Overhead**: Each node incurs 8–16 bytes extra memory for reference pointers
- **Standard Node Model**:
  ```java
  public class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }
  }
  ```
### Insertion Operations (Head, Tail, Index, Node)
- **Insert at Head (Prepend)**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode insertAtHead(ListNode head, int val) {
    ListNode newNode = new ListNode(val);
    newNode.next = head;
    return newNode; // New head of list
  }
  ```
- **Insert at Tail (Append)**: $\mathcal{O}(N)$ Time ($\mathcal{O}(1)$ with tail) | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode insertAtTail(ListNode head, int val) {
    ListNode newNode = new ListNode(val);
    if (head == null) return newNode;

    ListNode curr = head;
    while (curr.next != null) {
      curr = curr.next; // Traverse to final node
    }
    curr.next = newNode;
    return head;
  }
  ```
- **Insert at Position $K$**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode insertAt(ListNode head, int val, int index) {
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
  ```
- **Insert After Given Node (Direct Reference)**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static void insertAfter(ListNode prevNode, int val) {
    if (prevNode == null) return;
    ListNode newNode = new ListNode(val);
    newNode.next = prevNode.next; // 1. Link forward first to prevent data loss
    prevNode.next = newNode;      // 2. Safely reassign predecessor
  }
  ```
### Deletion Operations (Head, Tail, Value, Index, Node)
- **Delete at Head**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode deleteHead(ListNode head) {
    if (head == null) return null;
    return head.next; // Advance head pointer
  }
  ```
- **Delete at Tail**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode deleteTail(ListNode head) {
    if (head == null || head.next == null) return null;
    ListNode curr = head;
    while (curr.next.next != null) {
      curr = curr.next; // Traverse to second-to-last node
    }
    curr.next = null;   // Sever last node
    return head;
  }
  ```
- **Delete at Position $K$**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode deleteAt(ListNode head, int index) {
    if (head == null) return null;
    if (index == 0) return head.next;

    ListNode curr = head;
    for (int i = 0; i < index - 1 && curr.next != null; i++) {
      curr = curr.next;
    }
    if (curr.next != null) {
      curr.next = curr.next.next; // Unlink target node
    }
    return head;
  }
  ```
- **Delete Node by Value (Sentinel Pattern)**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode deleteByValue(ListNode head, int target) {
    ListNode dummy = new ListNode(0, head); // Sentinel eliminates head edge-case
    ListNode prev = dummy, curr = head;

    while (curr != null) {
      if (curr.val == target) {
        prev.next = curr.next; // Bypass deleted node
        break;
      }
      prev = curr;
      curr = curr.next;
    }
    return dummy.next;
  }
  ```
- **Delete Node without Head Reference ($\mathcal{O}(1)$ Trick - LeetCode 237)**:
  ```java
  public static void deleteNode(ListNode node) {
    // Copy next node's value and bypass next node
    node.val = node.next.val;
    node.next = node.next.next;
  }
  ```
### High-Yield Linked List Patterns
- **In-Place List Reversal (Iterative 3-Pointer Swap)**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Auxiliary Space
  ```java
  public static ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;

    while (curr != null) {
      ListNode nextTemp = curr.next; // 1. Save forward pointer
      curr.next = prev;              // 2. Reverse link backward
      prev = curr;                   // 3. Advance prev
      curr = nextTemp;               // 4. Advance curr
    }
    return prev; // New head of reversed list
  }
  ```
- **Middle Node via Slow & Fast Pointers**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
      slow = slow.next;       // Moves 1 step
      fast = fast.next.next;  // Moves 2 steps
    }
    return slow; // Points to middle node
  }
  ```
- **Cycle Detection (Floyd's Tortoise & Hare - LeetCode 141)**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
      slow = slow.next;
      fast = fast.next.next;
      if (slow == fast) return true; // Cycle detected
    }
    return false; // Reached end, no cycle
  }
  ```

## 3. Doubly Linked List Operations
### Doubly Linked Node Architecture
- **Bidirectional Navigation**: Each node holds references to both `next` and `prev`
- **Node Blueprint**:
  ```java
  public class DoublyNode {
    public int val;
    public DoublyNode prev, next;
    public DoublyNode(int val) { this.val = val; }
  }
  ```
### Insertion Operations (Head, Tail, Node)
- **Insert at Head**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static DoublyNode insertAtHead(DoublyNode head, int val) {
    DoublyNode newNode = new DoublyNode(val);
    newNode.next = head;
    if (head != null) head.prev = newNode;
    return newNode; // New head
  }
  ```
- **Insert at Tail**: $\mathcal{O}(N)$ Time ($\mathcal{O}(1)$ with tail ptr) | $\mathcal{O}(1)$ Space
  ```java
  public static DoublyNode insertAtTail(DoublyNode head, int val) {
    DoublyNode newNode = new DoublyNode(val);
    if (head == null) return newNode;
    DoublyNode curr = head;
    while (curr.next != null) curr = curr.next;
    curr.next = newNode;
    newNode.prev = curr;
    return head;
  }
  ```
- **Insert After Given Node**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static void insertAfter(DoublyNode target, int val) {
    DoublyNode newNode = new DoublyNode(val);
    newNode.next = target.next;
    newNode.prev = target;
    if (target.next != null) target.next.prev = newNode;
    target.next = newNode;
  }
  ```
### Deletion Operations (Direct, Head, Tail)
- **Direct $\mathcal{O}(1)$ Node Deletion**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static void deleteNode(DoublyNode node) {
    if (node == null) return;
    if (node.prev != null) node.prev.next = node.next;
    if (node.next != null) node.next.prev = node.prev;
    node.prev = null;
    node.next = null; // Unlink to aid Garbage Collection
  }
  ```
- **Delete at Head**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static DoublyNode deleteHead(DoublyNode head) {
    if (head == null) return null;
    DoublyNode newHead = head.next;
    if (newHead != null) newHead.prev = null;
    head.next = null;
    return newHead;
  }
  ```
### In-Place DLL Reversal & LRU Building Block
- **In-Place DLL Reversal**: $\mathcal{O}(N)$ Time | $\mathcal{O}(1)$ Space
  ```java
  public static DoublyNode reverseDLL(DoublyNode head) {
    DoublyNode curr = head, temp = null;
    while (curr != null) {
      // Swap prev and next pointers
      temp = curr.prev;
      curr.prev = curr.next;
      curr.next = temp;
      curr = curr.prev; // Advance using swapped prev pointer
    }
    return temp != null ? temp.prev : head;
  }
  ```
- **LRU Cache DLL Building Block (LeetCode 146)**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
  ```java
  // Pseudo-head and Pseudo-tail sentinels eliminate null checks
  public class LRUDoublyList {
    DoublyNode head = new DoublyNode(0);
    DoublyNode tail = new DoublyNode(0);
    public LRUDoublyList() { head.next = tail; tail.prev = head; }

    public void addFirst(DoublyNode node) {
      node.next = head.next;
      node.prev = head;
      head.next.prev = node;
      head.next = node;
    }
    public void remove(DoublyNode node) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
    public DoublyNode removeLast() {
      if (tail.prev == head) return null;
      DoublyNode last = tail.prev;
      remove(last);
      return last;
    }
  }
  ```

## 4. Stack Operations & Memory Mechanics
### LIFO Operational Discipline
- **Last-In, First-Out**: Insertions and removals occur exclusively at the top
- **Primary Operations**: `push()`, `pop()`, `peek()`, `isEmpty()`
- **All Core Operations**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
### Array-Backed Stack Implementation
- **Array Stack**: Zero pointer overhead, optimal CPU cache locality
  ```java
  public class ArrayStack {
    private int[] data;
    private int top;

    public ArrayStack(int capacity) {
      data = new int[capacity];
      top = -1;
    }

    public void push(int val) {
      if (top == data.length - 1) throw new StackOverflowError();
      data[++top] = val; // O(1)
    }

    public int pop() {
      if (isEmpty()) throw new IllegalStateException("Stack Underflow");
      return data[top--]; // O(1)
    }

    public int peek() {
      if (isEmpty()) throw new IllegalStateException("Stack Empty");
      return data[top]; // O(1)
    }

    public boolean isEmpty() { return top == -1; }
  }
  ```
### Linked-List Backed Stack
- **Dynamic Growth**: Never overflows bounded heap; head of list represents stack top
  ```java
  public class LinkedStack {
    private ListNode top;

    public void push(int val) {
      ListNode node = new ListNode(val);
      node.next = top;
      top = node; // O(1)
    }

    public int pop() {
      if (top == null) throw new IllegalStateException("Stack Underflow");
      int val = top.val;
      top = top.next; // O(1)
      return val;
    }

    public int peek() { return top != null ? top.val : -1; }
    public boolean isEmpty() { return top == null; }
  }
  ```
### Min Stack with $\mathcal{O}(1)$ `getMin()` (LeetCode 155)
- **Constant Time Minimum Retrieval**: $\mathcal{O}(1)$ Time for all operations | $\mathcal{O}(N)$ Space
  ```java
  public class MinStack {
    private java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();
    private java.util.Deque<Integer> minStack = new java.util.ArrayDeque<>();

    public void push(int val) {
      stack.push(val);
      if (minStack.isEmpty() || val <= minStack.peek()) {
        minStack.push(val);
      }
    }

    public void pop() {
      if (stack.pop().equals(minStack.peek())) {
        minStack.pop();
      }
    }

    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
  }
  ```
### Monotonic Stack Pattern (Next Greater Element)
- **Linear Scan with Stack**: $\mathcal{O}(N)$ Time | $\mathcal{O}(N)$ Space (LeetCode 496 / 739)
  ```java
  public static int[] nextGreaterElement(int[] nums) {
    int[] res = new int[nums.length];
    java.util.Deque<Integer> stack = new java.util.ArrayDeque<>(); // Stores indices

    for (int i = nums.length - 1; i >= 0; i--) {
      // Pop all elements smaller than current
      while (!stack.isEmpty() && stack.peek() <= nums[i]) {
        stack.pop();
      }
      res[i] = stack.isEmpty() ? -1 : stack.peek();
      stack.push(nums[i]);
    }
    return res;
  }
  ```
### High-Yield Stack Pattern: Valid Parentheses
- **Matching Brackets**: $\mathcal{O}(N)$ Time | $\mathcal{O}(N)$ Space
  ```java
  public static boolean isValid(String s) {
    java.util.Deque<Character> stack = new java.util.ArrayDeque<>();
    for (char c : s.toCharArray()) {
      if (c == '(') stack.push(')');
      else if (c == '{') stack.push('}');
      else if (c == '[') stack.push(']');
      else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
  }
  ```

## 5. Queue & Circular Ring Buffer Operations
### FIFO Operational Discipline
- **First-In, First-Out**: Elements enqueue at rear, dequeue from front
- **Standard Operations**: `enqueue()`, `dequeue()`, `peek()`, `isEmpty()`
- **Core Cost**: $\mathcal{O}(1)$ Time | $\mathcal{O}(1)$ Space
### Circular Queue (Ring Buffer using Array)
- **Modulo Arithmetic**: Eliminates linear array shifting on dequeue via index wrap-around
  ```java
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
  ```
### Linked-List Backed Queue
- **Two-Pointer Model (`head` & `tail`)**: $\mathcal{O}(1)$ Enqueue & $\mathcal{O}(1)$ Dequeue
  ```java
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
  ```
### Implement Queue using Stacks (LeetCode 232)
- **Two-Stack Model (`inStack` & `outStack`)**: Amortized $\mathcal{O}(1)$ Time | $\mathcal{O}(N)$ Space
  ```java
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
  ```
### Sliding Window Maximum via Monotonic Deque (LeetCode 239)
- **Decreasing Deque Maintenance**: $\mathcal{O}(N)$ Time | $\mathcal{O}(K)$ Space
  ```java
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
  ```
