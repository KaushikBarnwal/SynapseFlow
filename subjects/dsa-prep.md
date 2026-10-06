---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 480
---

# 🧱 Data Structures (Theory) & Interview Blueprint

## 1. Basics (Easy / Foundations)
### 1.1 Complexity Analysis & Asymptotics
#### Asymptotic Notations & Formal Bounds
- **Big-O ($\mathcal{O}$)**: Asymptotic upper bound ($f(n) \le c \cdot g(n)$ for all $n \ge n_0$)
- **Big-Omega ($\Omega$)**: Asymptotic lower bound ($f(n) \ge c \cdot g(n)$)
- **Big-Theta ($\Theta$)**: Tight asymptotic bound ($\Omega(g(n)) \cap \mathcal{O}(g(n))$)
- **Little-o ($o$) & Little-omega ($\omega$)**: Strict non-tight asymptotic bounds
#### Space Complexity & Memory Bounds
- **Auxiliary Space**: Extra memory allocated by algorithm excluding input data
- **Space-Time Trade-off**: Caching and precomputation trade higher memory for $\mathcal{O}(1)$ query speed
- **Call Stack Memory**: Implicit recursive stack allocation bounded by tree/recursion depth $\mathcal{O}(h)$
#### Amortized Analysis Techniques
- **Aggregate Method**: Total runtime of a sequence of $k$ operations divided by $k$
- **Accounting (Banker's) Method**: Charge extra credits to cheap operations to pay for rare costly ones
- **Potential Method (Physicist)**: State potential function $\Phi(D)$ tracking stored energy across operations

### 1.2 Static & Dynamic Arrays
#### Contiguous Memory Architecture
- Contiguous RAM block ensures true constant-time indexed lookup
- High spatial cache locality primes CPU L1/L2 cache lines (64-byte blocks)
- Resistant to memory fragmentation compared to scattered pointer-based allocations
#### Address Arithmetic & Layout
- Memory Address Calculation Diagram:
  ```text
  Index:     [ 0 ]       [ 1 ]       [ 2 ]       [ 3 ]
  Address: 0x1000      0x1004      0x1008      0x100C
  Value:   [ 15 ]      [ 42 ]      [ 99 ]      [  7 ]
  Formula: Address(i) = Base_Address + (i * Element_Byte_Size)
  ```
#### Dynamic Array Growth & Resizing
- Geometric progression growth factor (Java `ArrayList` uses $1.5\times$; Python `list` & C++ `vector` use $2.0\times$)
- Single insert worst-case $\mathcal{O}(N)$ on resize (allocate new contiguous buffer + copy elements)
- Amortized cost per append is $\mathcal{O}(1)$ (doubling guarantees $N$ insertions require at most $2N$ copies)
#### Array vs Linked List Comparison
- Architectural Feature Comparison:
  | Feature | Static / Dynamic Array | Singly / Doubly Linked List |
  | :--- | :--- | :--- |
  | **Access Time** | $\mathcal{O}(1)$ random indexing | $\mathcal{O}(N)$ sequential traversal |
  | **Insert at Head** | $\mathcal{O}(N)$ shift all elements | $\mathcal{O}(1)$ update head pointer |
  | **Insert at Tail** | $\mathcal{O}(1)$ amortized | $\mathcal{O}(1)$ with tail pointer |
  | **Cache Locality** | High (contiguous cache lines) | Low (fragmented heap pointers) |
  | **Memory Overhead** | Minimal (raw contiguous buffer) | High (pointer per node: 8–16 bytes) |

### 1.3 Singly & Doubly Linked Lists
#### Node Architectures & Pointer Linking
- Pointer Topology Diagram:
  ```text
  Singly: [Head: 10] ──> [Node: 20] ──> [Node: 30] ──> NULL
  Doubly: NULL <── [Head: 10] <═══> [Node: 20] <═══> [Tail: 30] ──> NULL
  ```
#### Structural Variants & Properties
- **Singly Linked**: Unidirectional forward pointers; lowest pointer footprint
- **Doubly Linked**: Bidirectional pointers; enables $\mathcal{O}(1)$ node deletion given direct node reference
- **Circular Linked**: Tail links back to Head; foundational for Ring Buffers & Round-Robin CPU scheduling
- **Sentinel (Dummy) Nodes**: Permanent head/tail nodes eliminating edge-case conditionals during insertion/deletion

### 1.4 Stacks
#### LIFO Discipline & Call Stack Mechanics
- Last-In, First-Out operational order ($Push$, $Pop$, $Peek$ in $\mathcal{O}(1)$)
- Stack Underflow (popping empty stack) vs Stack Overflow (exceeding maximum thread memory limit)
- Hardware Call Stack: Stores function return addresses, parameters, and local stack frames
#### Implementation Comparison
- **Array-backed Stack**: Zero pointer overhead, superior CPU cache locality, requires occasional geometric resizing
- **Linked-list-backed Stack**: Dynamic growth without resize delays, higher memory overhead per pushed node
#### Monotonic Stacks & Patterns
- Maintains elements in strictly monotonic increasing or decreasing order
- Solves Next Greater Element, Stock Span, and Largest Rectangle in Histogram in optimal linear $\mathcal{O}(N)$ time

### 1.5 Queues
#### FIFO Discipline & Operational Flow
- First-In, First-Out access discipline ($Enqueue$ at rear, $Dequeue$ at front in $\mathcal{O}(1)$)
- Deque (Double-Ended Queue): Supports insertion and deletion at both ends in $\mathcal{O}(1)$
#### Circular Queue (Ring Buffer)
- Fixed-size array with modular arithmetic preventing unneeded pointer drift
- Architecture Diagram:
  ```text
        [ 0: Free ] ──> [ 1: Head ] ──> [ 2: Active ]
             ▲                               │
             │                               ▼
        [ 5: Rear ] <── [ 4: Active ] <── [ 3: Active ]
  Formula: Next_Index = (Current_Index + 1) % Capacity
  ```
#### Stack vs Queue vs Deque Comparison
- Core Behavioral Comparison:
  | Structure | Operational Discipline | Key Entry/Exit Points | Primary Interview Use-Cases |
  | :--- | :--- | :--- | :--- |
  | **Stack** | LIFO (Last-In-First-Out) | Top only (Push / Pop) | DFS, Undo mechanisms, Expression parsing |
  | **Queue** | FIFO (First-In-First-Out) | Front (Dequeue) / Rear (Enqueue) | BFS, Print spooling, Event loops |
  | **Deque** | Double-Ended | Both Front & Rear | Sliding Window Maximum, Work-stealing pools |

## 2. Moderate (Normal / Core Interview Heavyweights)
### 2.1 Hash Tables & Hash Maps
#### Hash Function Properties & Theory
- **Uniform Distribution**: Uniformly hashes keys across all available buckets to minimize clustering
- **Deterministic**: Identical input keys must always produce the exact same numerical hash code
- **Avalanche Effect**: Flipping a single bit in the input radically alters output hash to prevent pattern collisions
#### Collision Resolution Architecture
- Buckets & Collision Diagram:
  ```text
  Bucket [0] ──> NULL
  Bucket [1] ──> [K1:V1] ──> [K7:V7] ──> [K12:V12] ──> NULL  (Chaining)
  Bucket [2] ──> [Red-Black Tree Root] (Treeified when Chain Length >= 8)
  ```
#### Separate Chaining vs Open Addressing
- Collision Resolution Comparison:
  | Metric | Separate Chaining | Open Addressing (Linear / Quadratic) |
  | :--- | :--- | :--- |
  | **Memory Overhead** | Pointer per node outside main array | Compact array; zero pointer overhead |
  | **Cache Locality** | Low (pointer chasing across heap) | High (contiguous probe sequences) |
  | **Clustering** | No clustering; chains stay local | Primary & Secondary clustering traps |
  | **Deletion Cost** | Simple pointer unlinking | Requires `TOMBSTONE` deleted markers |
  | **Load Factor Limit** | Operates safely even when $\alpha > 1.0$ | Degrades severely as $\alpha \rightarrow 0.7–0.8$ |
#### Java 8+ HashMap Treeification Engine
- `TREEIFY_THRESHOLD = 8`: Bucket chain transforms into Red-Black Tree when collision depth $\ge 8$
- `UNTREEIFY_THRESHOLD = 6`: Red-Black Tree transforms back to Linked List when shrunk to $\le 6$
- Guarantees worst-case lookup improves from degraded $\mathcal{O}(N)$ to guaranteed $\mathcal{O}(\log N)$

### 2.2 Binary Trees & Binary Search Trees (BST)
#### Tree Structural Classifications
- **Full Binary Tree**: Every node has either 0 or 2 children
- **Complete Binary Tree**: Every level is completely filled except possibly the last, which is filled left to right
- **Perfect Binary Tree**: All interior nodes have 2 children and all leaf nodes have identical depth ($2^{h+1}-1$ nodes)
- **Degenerate (Skewed) Tree**: Every node has only 1 child; degrades tree operations to linked list $\mathcal{O}(N)$
#### Traversal Strategies & Properties
- Tree Traversal Comparison:
  | Traversal | Traversal Sequence | Core Interview Property |
  | :--- | :--- | :--- |
  | **Inorder** | Left $\rightarrow$ Root $\rightarrow$ Right | Returns strictly sorted ascending order on BST |
  | **Preorder** | Root $\rightarrow$ Left $\rightarrow$ Right | Serialization, Deep copying, Prefix expressions |
  | **Postorder** | Left $\rightarrow$ Right $\rightarrow$ Root | Bottom-up calculations (Height, Tree deletion, Postfix) |
  | **Level-Order** | Breadth-first (BFS queue) | Shortest distance in trees, Level averages, Tree width |
#### BST Node Deletion Mechanics
- **Case 1 (Leaf Node)**: Directly detach parent's pointer to NULL in $\mathcal{O}(1)$
- **Case 2 (Single Child)**: Bypass node and link parent directly to child in $\mathcal{O}(1)$
- **Case 3 (Two Children)**: Swap value with **Inorder Successor** (smallest in right subtree) or **Inorder Predecessor** (largest in left subtree), then recursively delete that node

### 2.3 Heaps & Priority Queues
#### Complete Binary Tree Array Index Math
- Complete Binary Tree Index Diagram:
  ```text
               [0: 90]                 Tree to Array Index Math:
              /       \                Left Child  = 2*i + 1
          [1: 80]    [2: 70]           Right Child = 2*i + 2
          /     \                      Parent      = (i - 1) / 2
       [3: 40] [4: 30]
  Array: [ 90, 80, 70, 40, 30 ]
  ```
#### Heapify Construction Algorithms
- Heap Construction Comparison:
  | Construction Method | Operational Algorithm | Time Complexity | Space Complexity |
  | :--- | :--- | :--- | :--- |
  | **Floyd's Heapify** | Bottom-up sift-down starting from $\lfloor N/2 \rfloor - 1$ | $\mathcal{O}(N)$ | $\mathcal{O}(1)$ in-place |
  | **Sequential Insertion** | Insert elements sequentially with sift-up | $\mathcal{O}(N \log N)$ | $\mathcal{O}(1)$ in-place |
- Proof intuition: Most nodes reside near tree bottom where sift-down depth is minimal ($h=0$ for $\approx N/2$ leaf nodes)

### 2.4 Graphs & Representations
#### Graph Taxonomies & Properties
- **Directed vs Undirected**: Unidirectional edge flows vs bidirectional edge traversal
- **DAG (Directed Acyclic Graph)**: Directed graph with zero cycles; required for Topological Sorting and Build Pipelines
- **Weighted vs Unweighted**: Edges with execution costs/latencies vs uniform hop costs
#### Representation Comparison
- Storage Representation Comparison:
  | Metric | Adjacency Matrix | Adjacency List |
  | :--- | :--- | :--- |
  | **Space Complexity** | $\mathcal{O}(V^2)$ (Heavy memory) | $\mathcal{O}(V + E)$ (Optimal for sparse) |
  | **Edge Existence Query** | $\mathcal{O}(1)$ direct coordinate lookup | $\mathcal{O}(\text{degree}(u))$ scan neighbor list |
  | **Iterate All Neighbors** | $\mathcal{O}(V)$ scans entire row | $\mathcal{O}(\text{degree}(u))$ iterates direct neighbors |
  | **Add Edge Cost** | $\mathcal{O}(1)$ write to cell | $\mathcal{O}(1)$ push to linked list |
  | **Best Suited For** | Dense graphs ($E \approx V^2$) | Sparse graphs ($E \ll V^2$, web graphs, networks) |

### 2.5 Strings as Data Structures
#### Memory Encodings & Immutability
- Backed by contiguous byte/character arrays; UTF-8 (variable 1–4 bytes) vs UTF-16 (fixed 2 or 4 bytes)
- Immutability guarantees: Thread-safe reads, precomputed cached hash codes, String Constant Pool memory deduplication
#### Windowing & Two-Pointer Invariants
- **Fixed Window**: Sliding window of fixed size $K$ tracking running sums or character frequencies in $\mathcal{O}(N)$
- **Dynamic Window**: Expand right pointer to consume characters; contract left pointer to restore validity invariant

## 3. Advanced (Hard / System-Oriented & Specialized)
### 3.1 Self-Balancing BSTs
#### Skew Prevention & Height Guarantees
- Degenerate BST degrades to linked list with $\mathcal{O}(N)$ worst-case search time
- Height-balancing invariants enforce strict $\mathcal{O}(\log N)$ worst-case operations
#### AVL Tree vs Red-Black Tree Comparison
- Self-Balancing Mechanism Comparison:
  | Property | AVL Tree | Red-Black Tree |
  | :--- | :--- | :--- |
  | **Balance Strictness** | Strict: Height difference $|h_L - h_R| \le 1$ | Relaxed: Longest path $\le 2 \times$ shortest path |
  | **Max Tree Height** | $\approx 1.44 \log_2 N$ | $\approx 2.0 \log_2 N$ |
  | **Search Lookup** | Faster (flatter, strictly balanced tree) | Slightly slower |
  | **Insert/Delete Cost** | Slower (requires frequent multi-level rotations) | Faster (max 2 rotations on insert, 3 on delete + recolor) |
  | **Industry Use Cases** | Read-heavy databases, static lookup tables | Java `TreeMap`, C++ `std::map`, Linux Kernel CFS |
#### Rotation Mechanics
- Rotation Topology Diagram:
  ```text
  Right Rotation (LL Case):             Left Rotation (RR Case):
        (z)              (y)                 (z)              (y)
       /   \            /   \               /   \            /   \
     (y)   T3  ====>  (x)   (z)            T1   (y)  ====>  (z)   (x)
     /  \             / \   / \                 /  \        / \   / \
   (x)  T2           T0 T1 T2 T3               T2  (x)     T1 T2 T3 T4
  ```

### 3.2 Disjoint Set Union (DSU / Union-Find)
#### Core Operations & Mechanics
- Partitions elements into disjoint subsets via $Find(u)$ (locates set root) and $Union(u, v)$ (merges two sets)
#### Algorithmic Optimizations
- **Path Compression**: During `find()`, flattens tree by pointing visited nodes directly to set root
- **Union by Rank / Size**: Always attaches smaller tree under root of larger tree to minimize height growth
#### Inverse Ackermann Complexity
- Combining Path Compression with Union by Rank achieves amortized $\mathcal{O}(\alpha(N))$ time per operation
- $\alpha(N) \le 4$ for all physically conceivable universe values ($N \le 10^{80}$ atoms in universe)

### 3.3 Tries (Prefix Trees) & Suffix Structures
#### Trie Topology Architecture
- Trie Tree Diagram:
  ```text
                   (Root)
                   /    \
                 'c'    't'
                 /        \
               'a'        'o'
              /   \         \
            'r'   't'       'p'* ("top")
             *     *
          ("car") ("cat")  [* = is_end_of_word: true]
  ```
#### Space vs Time Trade-offs
- Prefix Lookup & Insert: $\mathcal{O}(L)$ where $L$ is word length (completely independent of total dictionary size $N$)
- Memory Trade-off: High pointer density per node ($26$ child references for ASCII alphabets)
- Radix Tree (Patricia Trie): Merges non-branching common edge chains to reduce node memory by up to 70%

### 3.4 B-Trees & B+ Trees (Database & File Storage)
#### Why Storage Engines Avoid Binary Trees
- RAM memory access runs in nanoseconds; disk page block read runs in milliseconds
- Binary search trees have deep height ($h \approx 30$), demanding 30 sequential disk seeks per lookup
- B-Trees have massive fan-out ($M \approx 100–1000$), bringing height down to 3–4 levels
#### B-Tree vs B+ Tree Comparison
- Storage Engine Architecture Comparison:
  | Architectural Metric | B-Tree | B+ Tree |
  | :--- | :--- | :--- |
  | **Data Record Storage** | Stored in both internal nodes and leaf nodes | Stored exclusively inside leaf nodes |
  | **Leaf Node Structure** | Leaves are isolated and unlinked | Leaves are doubly linked in sequential order |
  | **Index Fan-Out** | Lower (internal nodes waste space storing data) | Massive (internal nodes store pure routing keys) |
  | **Range Queries** | Requires full in-order traversal ($\mathcal{O}(N)$) | Sequential walk across linked leaves ($\mathcal{O}(K)$) |
  | **Storage Engines** | Linux ext4 file systems, MongoDB WiredTiger | MySQL InnoDB, PostgreSQL, SQLite, B-Tree indexes |
#### B+ Tree Multilevel Architecture
- B+ Tree Paging Diagram:
  ```text
  Root Page:             [ 20 | 50 ]
                       /      |      \
  Internal:         [ 10 ]   [ 35 ]   [ 70 ]
                   /   \    /   \    /   \
  Leaves:       [..] <====> [..] <====> [..] (Doubly-Linked Leaf Records)
  ```

### 3.5 Cache & Eviction Data Structures
#### LRU Cache Dual Architecture
- Dual-Structure Layout Diagram:
  ```text
  Hash Map: { Key_A ──> Node_A, Key_B ──> Node_B }
                               │              │
  Doubly Linked List: [Head / MRU] <═══> Node_A <═══> Node_B <═══> [Tail / LRU]
  ```
#### LRU vs LFU Eviction Policies
- Eviction Strategy Comparison:
  | Policy | Eviction Metric | Internal Data Structure | Complexity | Vulnerability |
  | :--- | :--- | :--- | :--- | :--- |
  | **LRU** (Least Recently Used) | Oldest access timestamp | HashMap + Doubly Linked List | $\mathcal{O}(1)$ get / put | Vulnerable to one-time burst scans |
  | **LFU** (Least Frequently Used) | Lowest access frequency count | HashMap + Frequency Doubly Linked Lists | $\mathcal{O}(1)$ get / put | Vulnerable to stale historical frequency |
#### Lock-Free Ring Buffers
- Single-Producer Single-Consumer (SPSC) circular queue using atomic head/tail pointers and memory fences
- Eliminates mutex context-switching overhead; foundational for low-latency market data and audio engines

### 3.6 Probabilistic Data Structures
#### Bloom Filter Operational Mechanics
- Bit array of size $M$ initialized to 0 with $k$ independent uniform hash functions
- On insert: Hash element with all $k$ functions and set bits to 1
- On query: If ANY bit is 0, element is guaranteed NOT in set. If all bits are 1, element is PROBABLY in set.
#### Truth Table & Error Bounds
- Bloom Filter Guarantee Comparison:
  | Bloom Filter Check Result | System Interpretation | Error Type / Guarantee |
  | :--- | :--- | :--- |
  | **Returns `FALSE` (Bit = 0)** | Definitely NOT in database | **Zero False Negatives** (100% Certainty) |
  | **Returns `TRUE` (Bits = 1)** | Probably in database | **Possible False Positive** (Must verify in DB) |
#### Big Data Sketches
- **HyperLogLog**: Computes cardinality of unique elements in massive data streams using leading zero patterns in $\mathcal{O}(1)$ space
- **Count-Min Sketch**: Estimates frequency of events in high-velocity network packet streams using 2D hash arrays
