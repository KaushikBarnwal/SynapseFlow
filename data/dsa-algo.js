// Auto-generated from subjects/dsa-algo-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['dsa-algo'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 440
---

# ⚡ Algorithm Design & Problem-Solving Patterns in Java

## 1. Two Pointers, Sliding Window & Prefix Sums
### Opposite-Direction Two Pointers (Inward Convergence)
- **Convergence Principle**: Pointers initialize at boundaries (\`0\` and \`N - 1\`), converging inward based on monotonic conditions
- **Two Sum II - Input Array Is Sorted (LeetCode 167)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int[] twoSumSorted(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
      int sum = numbers[left] + numbers[right];
      // [CRUX] Inward convergence based on target comparison:
      if (sum == target) return new int[]{left + 1, right + 1}; // 1-based index
      else if (sum < target) left++; // Need a larger sum
      else right--; // Need a smaller sum
    }
    return new int[]{-1, -1};
  }
  \`\`\`
- **Container With Most Water (LeetCode 11)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int maxArea(int[] height) {
    int left = 0, right = height.length - 1, maxWater = 0;
    while (left < right) {
      int h = Math.min(height[left], height[right]);
      maxWater = Math.max(maxWater, h * (right - left));
      // [CRUX] Greedy bottleneck elimination: always advance the shorter pillar
      if (height[left] < height[right]) left++;
      else right--;
    }
    return maxWater;
  }
  \`\`\`
- **3-Sum Problem (LeetCode 15)**: $\\mathcal{O}(N^2)$ Time | $\\mathcal{O}(1)$ Extra Space
  \`\`\`java
  public static java.util.List<java.util.List<Integer>> threeSum(int[] nums) {
    java.util.Arrays.sort(nums);
    java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
    int n = nums.length;

    for (int i = 0; i < n - 2; i++) {
      if (nums[i] > 0) break; // Cannot sum to 0 if smallest number > 0
      // [CRUX] Skip duplicate anchor to prevent identical triplets:
      if (i > 0 && nums[i] == nums[i - 1]) continue;

      int left = i + 1, right = n - 1;
      while (left < right) {
        int sum = nums[i] + nums[left] + nums[right];
        if (sum == 0) {
          result.add(java.util.Arrays.asList(nums[i], nums[left], nums[right]));
          // [CRUX] Skip duplicate inner pairs:
          while (left < right && nums[left] == nums[left + 1]) left++;
          while (left < right && nums[right] == nums[right - 1]) right--;
          left++; right--;
        } else if (sum < 0) left++;
        else right--;
      }
    }
    return result;
  }
  \`\`\`
- **Valid Palindrome with Alphanumeric Filtering (LeetCode 125)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
      // [CRUX] Skip non-alphanumeric chars dynamically:
      while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
      while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
      if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
        return false;
      }
      left++; right--;
    }
    return true;
  }
  \`\`\`
### Same-Direction Fast & Slow Pointers (Runner Pattern)
- **In-Place Array Deduplication (LeetCode 26)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int slow = 0; // Writes unique elements
    for (int fast = 1; fast < nums.length; fast++) {
      // [CRUX] Fast runner writes to slow pointer only on distinct element discovery:
      if (nums[fast] != nums[slow]) {
        nums[++slow] = nums[fast];
      }
    }
    return slow + 1; // New distinct length
  }
  \`\`\`
### Fixed & Dynamic Sliding Window
- **Fixed-Size Sliding Window**: Max sum subarray of size $K$: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int maxSubarraySumFixed(int[] nums, int k) {
    int windowSum = 0, maxSum = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
      windowSum += nums[i];
      if (i >= k - 1) {
        maxSum = Math.max(maxSum, windowSum);
        // [CRUX] Discard leftmost element as window slides:
        windowSum -= nums[i - k + 1];
      }
    }
    return maxSum;
  }
  \`\`\`
- **Dynamic Variable Window (LeetCode 3 - Longest Substring Without Repeating)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(\\min(N, M))$ Space
  \`\`\`java
  public static int lengthOfLongestSubstring(String s) {
    int[] lastIndex = new int[128]; // ASCII index tracker
    java.util.Arrays.fill(lastIndex, -1);
    int maxLen = 0, left = 0;

    for (int right = 0; right < s.length(); right++) {
      char c = s.charAt(right);
      // [CRUX] Jump left pointer past previous occurrence of duplicate:
      if (lastIndex[c] >= left) {
        left = lastIndex[c] + 1;
      }
      lastIndex[c] = right;
      maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
  }
  \`\`\`
- **Minimum Size Subarray Sum (LeetCode 209)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
      sum += nums[right];
      // [CRUX] Shrink window from left while target sum is satisfied:
      while (sum >= target) {
        minLen = Math.min(minLen, right - left + 1);
        sum -= nums[left++];
      }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
  }
  \`\`\`
### Prefix Sums & Difference Arrays
- **Subarray Sum Equals K (LeetCode 560)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static int subarraySum(int[] nums, int k) {
    int count = 0, prefixSum = 0;
    java.util.Map<Integer, Integer> map = new java.util.HashMap<>();
    map.put(0, 1); // Base case: prefix sum of 0 appears once

    for (int num : nums) {
      prefixSum += num;
      // [CRUX] If (prefixSum - k) seen before, a valid subarray exists:
      if (map.containsKey(prefixSum - k)) {
        count += map.get(prefixSum - k);
      }
      map.put(prefixSum, map.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
  }
  \`\`\`
- **2D Matrix Range Sum Query (LeetCode 304 - Inclusion-Exclusion)**: $\\mathcal{O}(1)$ Query | $\\mathcal{O}(M \\times N)$ Precomputation Space
  \`\`\`java
  public class NumMatrix {
    private int[][] p; // p[r+1][c+1] stores sum from (0,0) to (r,c)
    public NumMatrix(int[][] matrix) {
      if (matrix.length == 0 || matrix[0].length == 0) return;
      int m = matrix.length, n = matrix[0].length;
      p = new int[m + 1][n + 1];
      for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
          p[r + 1][c + 1] = matrix[r][c] + p[r][c + 1] + p[r + 1][c] - p[r][c];
        }
      }
    }
    // [CRUX] 2D Inclusion-Exclusion formula for O(1) rectangular query:
    public int sumRegion(int r1, int c1, int r2, int c2) {
      return p[r2 + 1][c2 + 1] - p[r1][c2 + 1] - p[r2 + 1][c1] + p[r1][c1];
    }
  }
  \`\`\`
- **Difference Array (Range Updates in $\\mathcal{O}(1)$)**: $\\mathcal{O}(N + Q)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public class DifferenceArray {
    private int[] diff;
    public DifferenceArray(int[] nums) {
      diff = new int[nums.length];
      diff[0] = nums[0];
      for (int i = 1; i < nums.length; i++) diff[i] = nums[i] - nums[i - 1];
    }
    // [CRUX] O(1) boundary updates: add at L, subtract at R + 1:
    public void update(int i, int j, int val) {
      diff[i] += val;
      if (j + 1 < diff.length) diff[j + 1] -= val;
    }
    // Reconstruct original array in O(N)
    public int[] result() {
      int[] res = new int[diff.length];
      res[0] = diff[0];
      for (int i = 1; i < diff.length; i++) res[i] = res[i - 1] + diff[i];
      return res;
    }
  }
  \`\`\`

## 2. Searching, Sorting & Divide-and-Conquer
### Binary Search on Monotonic Predicates (Search on Answer)
- **Universal Predicate Framework**: Map candidate space to $[\\text{low}, \\text{high}]$ and binary search for boundary
- **Capacity To Ship Packages Within D Days (LeetCode 1011)**: $\\mathcal{O}(N \\log(\\sum W))$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int shipWithinDays(int[] weights, int days) {
    int low = 0, high = 0;
    for (int w : weights) {
      low = Math.max(low, w);
      high += w;
    }
    int ans = high;
    while (low <= high) {
      int mid = low + ((high - low) >>> 1);
      // [CRUX] Feasible mid found: record answer and try smaller capacity:
      if (canShip(weights, days, mid)) {
        ans = mid;
        high = mid - 1; // Seek smaller capacity
      } else {
        low = mid + 1;
      }
    }
    return ans;
  }
  private static boolean canShip(int[] weights, int days, int cap) {
    int neededDays = 1, currLoad = 0;
    for (int w : weights) {
      if (currLoad + w > cap) {
        neededDays++;
        currLoad = 0;
      }
      currLoad += w;
    }
    return neededDays <= days;
  }
  \`\`\`
- **Koko Eating Bananas (LeetCode 875)**: $\\mathcal{O}(N \\log(\\max P))$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int minEatingSpeed(int[] piles, int h) {
    int low = 1, high = 0;
    for (int p : piles) high = Math.max(high, p);
    int speed = high;
    while (low <= high) {
      int mid = low + ((high - low) >>> 1);
      long totalHours = 0;
      // [CRUX] Ceil division for eating speed hours: (p + mid - 1) / mid:
      for (int p : piles) totalHours += (p + mid - 1) / mid;
      if (totalHours <= h) {
        speed = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return speed;
  }
  \`\`\`
### Divide and Conquer: MergeSort & 3-Way QuickSort
- **Merge Sort (Stable Sorting)**: $\\mathcal{O}(N \\log N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = l + ((r - l) >>> 1);
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
  }
  private static void merge(int[] arr, int l, int mid, int r) {
    int[] temp = new int[r - l + 1];
    int i = l, j = mid + 1, k = 0;
    // [CRUX] Merge two sorted halves: stable comparison retains original order:
    while (i <= mid && j <= r) temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= r) temp[k++] = arr[j++];
    System.arraycopy(temp, 0, arr, l, temp.length);
  }
  \`\`\`
- **QuickSort with 3-Way Dutch National Flag Partitioning**: $\\mathcal{O}(N \\log N)$ Avg Time | $\\mathcal{O}(\\log N)$ Call Stack Space
  \`\`\`java
  public static void quickSort3Way(int[] arr, int l, int r) {
    if (l >= r) return;
    int lt = l, gt = r, i = l + 1, pivot = arr[l];
    // [CRUX] 3-Way Dutch National Flag: partition into < pivot, == pivot, > pivot:
    while (i <= gt) {
      if (arr[i] < pivot) swap(arr, lt++, i++);
      else if (arr[i] > pivot) swap(arr, i, gt--);
      else i++;
    }
    quickSort3Way(arr, l, lt - 1);
    quickSort3Way(arr, gt + 1, r);
  }
  private static void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
  \`\`\`
- **Quickselect (K-th Largest Element - LeetCode 215)**: Average $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int findKthLargest(int[] nums, int k) {
    int target = nums.length - k, left = 0, right = nums.length - 1;
    while (left <= right) {
      int pivot = nums[right], pIndex = left;
      for (int i = left; i < right; i++) {
        if (nums[i] <= pivot) swap(nums, i, pIndex++);
      }
      swap(nums, pIndex, right);
      // [CRUX] Quickselect: only recurse into partition containing target rank:
      if (pIndex == target) return nums[pIndex];
      else if (pIndex < target) left = pIndex + 1;
      else right = pIndex - 1;
    }
    return -1;
  }
  \`\`\`
### Non-Comparison Sorting: Counting & Radix Sort
- **Counting Sort**: $\\mathcal{O}(N + K)$ Time | $\\mathcal{O}(K)$ Space ($K$ = value range)
  \`\`\`java
  public static void countingSort(int[] arr, int min, int max) {
    int range = max - min + 1;
    int[] count = new int[range];
    // [CRUX] Shift values by min offset to handle non-zero based integers:
    for (int x : arr) count[x - min]++;
    int idx = 0;
    for (int i = 0; i < range; i++) {
      while (count[i]-- > 0) arr[idx++] = i + min;
    }
  }
  \`\`\`
- **Radix Sort (LSD for Non-Negative Integers)**: $\\mathcal{O}(D \\times (N + B))$ Time | $\\mathcal{O}(N + B)$ Space ($D$ = digits, $B = 10$)
  \`\`\`java
  public static void radixSort(int[] arr) {
    if (arr.length == 0) return;
    int max = arr[0];
    for (int x : arr) if (x > max) max = x;
    for (int exp = 1; max / exp > 0; exp *= 10) {
      int[] output = new int[arr.length], count = new int[10];
      for (int x : arr) count[(x / exp) % 10]++;
      for (int i = 1; i < 10; i++) count[i] += count[i - 1];
      for (int i = arr.length - 1; i >= 0; i--) {
        // [CRUX] Stable LSD sorting by digit bucket: (arr[i] / exp) % 10:
        int d = (arr[i] / exp) % 10;
        output[--count[d]] = arr[i];
      }
      System.arraycopy(output, 0, arr, 0, arr.length);
    }
  }
  \`\`\`

## 3. Recursion & Backtracking Mastery
### The Universal Backtracking Framework
- **State Machine Lifecycle**:
  - \`1. Base Case\`: Target state reached $\\rightarrow$ clone/record solution
  - \`2. Explore Choices\`: Loop through candidates
  - \`3. Choose & Prune\`: Apply candidate + validate constraints
  - \`4. Recurse\`: Move to next depth level
  - \`5. Unchoose (Backtrack)\`: Revert state to restore caller context
### Subsets & Combinations (LeetCode 78, 90, 39)
- **Subsets with Duplicates (LeetCode 90)**: $\\mathcal{O}(2^N)$ Time | $\\mathcal{O}(N)$ Recursion Stack Space
  \`\`\`java
  public static java.util.List<java.util.List<Integer>> subsetsWithDup(int[] nums) {
    java.util.Arrays.sort(nums); // Group duplicate candidates adjacent
    java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
    backtrackSubsets(nums, 0, new java.util.ArrayList<>(), result);
    return result;
  }
  private static void backtrackSubsets(int[] nums, int start, java.util.List<Integer> path,
                                       java.util.List<java.util.List<Integer>> result) {
    result.add(new java.util.ArrayList<>(path)); // Clone current path
    for (int i = start; i < nums.length; i++) {
      // [CRUX] Skip duplicate choices at the same recursion depth:
      if (i > start && nums[i] == nums[i - 1]) continue;
      path.add(nums[i]);                           // 1. Choose
      backtrackSubsets(nums, i + 1, path, result); // 2. Recurse
      path.remove(path.size() - 1);                 // 3. Unchoose (Backtrack)
    }
  }
  \`\`\`
- **Combination Sum (Unlimited Reuse - LeetCode 39)**: $\\mathcal{O}(2^{\\text{target}})$ Time | $\\mathcal{O}(\\frac{\\text{target}}{\\min})$ Space
  \`\`\`java
  public static java.util.List<java.util.List<Integer>> combinationSum(int[] candidates, int target) {
    java.util.Arrays.sort(candidates);
    java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
    backtrackComb(candidates, 0, target, new java.util.ArrayList<>(), result);
    return result;
  }
  private static void backtrackComb(int[] cand, int start, int remain, java.util.List<Integer> path,
                                    java.util.List<java.util.List<Integer>> res) {
    if (remain == 0) { res.add(new java.util.ArrayList<>(path)); return; }
    for (int i = start; i < cand.length; i++) {
      if (cand[i] > remain) break; // Pruning branch: numbers sorted
      path.add(cand[i]);
      // [CRUX] Pass 'i' instead of 'i + 1' to allow unlimited reuse of candidate:
      backtrackComb(cand, i, remain - cand[i], path, res);
      path.remove(path.size() - 1);
    }
  }
  \`\`\`
### Permutations (LeetCode 46)
- **Permutations with Boolean Used Array**: $\\mathcal{O}(N! \\times N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static java.util.List<java.util.List<Integer>> permute(int[] nums) {
    java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
    backtrackPermute(nums, new boolean[nums.length], new java.util.ArrayList<>(), result);
    return result;
  }
  private static void backtrackPermute(int[] nums, boolean[] used, java.util.List<Integer> path,
                                       java.util.List<java.util.List<Integer>> result) {
    if (path.size() == nums.length) { result.add(new java.util.ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      // [CRUX] Boolean array tracks visited elements in current path:
      used[i] = true; path.add(nums[i]);
      backtrackPermute(nums, used, path, result);
      used[i] = false; path.remove(path.size() - 1);
    }
  }
  \`\`\`
### 2D Grid & Constraint Backtracking: Word Search, N-Queens, Sudoku
- **Word Search in 2D Board (LeetCode 79)**: $\\mathcal{O}(M \\times N \\times 3^L)$ Time | $\\mathcal{O}(L)$ Space
  \`\`\`java
  public static boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    for (int r = 0; r < m; r++) {
      for (int c = 0; c < n; c++) {
        if (dfsWord(board, word, r, c, 0)) return true;
      }
    }
    return false;
  }
  private static boolean dfsWord(char[][] board, String word, int r, int c, int idx) {
    if (idx == word.length()) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(idx)) {
      return false;
    }
    char temp = board[r][c];
    // [CRUX] In-place grid marking and state restoration (Backtrack):
    board[r][c] = '#';
    boolean found = dfsWord(board, word, r + 1, c, idx + 1) ||
                    dfsWord(board, word, r - 1, c, idx + 1) ||
                    dfsWord(board, word, r, c + 1, idx + 1) ||
                    dfsWord(board, word, r, c - 1, idx + 1);
    board[r][c] = temp; // Unchoose (Backtrack restore)
    return found;
  }
  \`\`\`
- **N-Queens Solver (LeetCode 51)**: $\\mathcal{O}(N!)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static java.util.List<java.util.List<String>> solveNQueens(int n) {
    java.util.List<java.util.List<String>> result = new java.util.ArrayList<>();
    char[][] board = new char[n][n];
    for (char[] row : board) java.util.Arrays.fill(row, '.');
    boolean[] cols = new boolean[n], d1 = new boolean[2 * n], d2 = new boolean[2 * n];
    backtrackNQueens(0, n, board, cols, d1, d2, result);
    return result;
  }
  private static void backtrackNQueens(int r, int n, char[][] board, boolean[] cols,
                                      boolean[] d1, boolean[] d2, java.util.List<java.util.List<String>> res) {
    if (r == n) {
      java.util.List<String> sol = new java.util.ArrayList<>();
      for (char[] row : board) sol.add(new String(row));
      res.add(sol);
      return;
    }
    for (int c = 0; c < n; c++) {
      // [CRUX] 3-way conflict check: column, diagonal (r-c+n), anti-diagonal (r+c):
      int id1 = r - c + n, id2 = r + c;
      if (cols[c] || d1[id1] || d2[id2]) continue; // Under attack!
      board[r][c] = 'Q'; cols[c] = d1[id1] = d2[id2] = true;
      backtrackNQueens(r + 1, n, board, cols, d1, d2, res);
      board[r][c] = '.'; cols[c] = d1[id1] = d2[id2] = false; // Backtrack
    }
  }
  \`\`\`
- **Sudoku Solver (LeetCode 37)**: $\\mathcal{O}(9^{M})$ Time ($M$ = empty cells) | $\\mathcal{O}(1)$ Extra Space
  \`\`\`java
  public static boolean solveSudoku(char[][] board) {
    for (int r = 0; r < 9; r++) {
      for (int c = 0; c < 9; c++) {
        if (board[r][c] == '.') {
          for (char val = '1'; val <= '9'; val++) {
            if (isValidSudoku(board, r, c, val)) {
              board[r][c] = val;
              if (solveSudoku(board)) return true;
              board[r][c] = '.'; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true; // All cells filled
  }
  private static boolean isValidSudoku(char[][] b, int r, int c, char val) {
    for (int i = 0; i < 9; i++) {
      if (b[r][i] == val || b[i][c] == val) return false;
      // [CRUX] Validate 3x3 sub-box index mapping: 3*(r/3) + i/3, 3*(c/3) + i%3:
      if (b[3 * (r / 3) + i / 3][3 * (c / 3) + i % 3] == val) return false;
    }
    return true;
  }
  \`\`\`

## 4. Graph Traversals, Shortest Paths & Spanning Trees
### Graph Flood Fill, BFS & 0-1 BFS
- **Connected Components via Grid DFS (LeetCode 200)**: $\\mathcal{O}(M \\times N)$ Time | $\\mathcal{O}(M \\times N)$ Call Stack Space
  \`\`\`java
  public static int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int islands = 0;
    for (int r = 0; r < grid.length; r++) {
      for (int c = 0; c < grid[0].length; c++) {
        if (grid[r][c] == '1') {
          islands++;
          sinkIsland(grid, r, c);
        }
      }
    }
    return islands;
  }
  private static void sinkIsland(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
    grid[r][c] = '0'; // Sink island in-place to avoid extra visited matrix
    sinkIsland(grid, r + 1, c);
    sinkIsland(grid, r - 1, c);
    sinkIsland(grid, r, c + 1);
    sinkIsland(grid, r, c - 1);
  }
  \`\`\`
- **0-1 BFS via ArrayDeque**: Shortest path on binary weights: $\\mathcal{O}(V + E)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static int zeroOneBFS(int n, java.util.List<java.util.List<int[]>> adj, int src, int dest) {
    int[] dist = new int[n];
    java.util.Arrays.fill(dist, Integer.MAX_VALUE);
    java.util.ArrayDeque<Integer> deque = new java.util.ArrayDeque<>();

    dist[src] = 0;
    deque.offerFirst(src);

    while (!deque.isEmpty()) {
      int u = deque.pollFirst();
      if (u == dest) return dist[dest];

      for (int[] edge : adj.get(u)) {
        int v = edge[0], wt = edge[1];
        if (dist[u] + wt < dist[v]) {
          dist[v] = dist[u] + wt;
          // [CRUX] 0-weight edges pushed to FRONT, 1-weight edges pushed to BACK:
          if (wt == 0) deque.offerFirst(v);
          else deque.offerLast(v);
        }
      }
    }
    return dist[dest] == Integer.MAX_VALUE ? -1 : dist[dest];
  }
  \`\`\`
### Topological Sorting & Dependency Graphs
- **Kahn's BFS In-Degree Algorithm (LeetCode 207 - Course Schedule)**: $\\mathcal{O}(V + E)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static boolean canFinishCourses(int numCourses, int[][] prerequisites) {
    int[] inDegree = new int[numCourses];
    java.util.List<java.util.List<Integer>> adj = new java.util.ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new java.util.ArrayList<>());
    for (int[] p : prerequisites) {
      adj.get(p[1]).add(p[0]); // p[1] -> p[0]
      inDegree[p[0]]++;
    }
    java.util.Queue<Integer> queue = new java.util.LinkedList<>();
    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) queue.offer(i);
    int resolved = 0;
    while (!queue.isEmpty()) {
      int u = queue.poll();
      resolved++;
      for (int v : adj.get(u)) {
        // [CRUX] Push to queue only when in-degree reaches ZERO:
        if (--inDegree[v] == 0) queue.offer(v);
      }
    }
    return resolved == numCourses; // True if DAG with no cycles
  }
  \`\`\`
### Shortest Path Algorithms: Dijkstra, Bellman-Ford, Floyd-Warshall
- **Dijkstra's Single-Source Shortest Path (LeetCode 743)**: $\\mathcal{O}((V + E) \\log V)$ Time | $\\mathcal{O}(V + E)$ Space
  \`\`\`java
  public static int networkDelayTime(int[][] times, int n, int k) {
    java.util.List<java.util.List<int[]>> adj = new java.util.ArrayList<>();
    for (int i = 0; i <= n; i++) adj.add(new java.util.ArrayList<>());
    for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});

    int[] dist = new int[n + 1];
    java.util.Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;

    java.util.PriorityQueue<int[]> pq = new java.util.PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
    pq.offer(new int[]{k, 0});

    while (!pq.isEmpty()) {
      int[] curr = pq.poll();
      int u = curr[0], d = curr[1];
      if (d > dist[u]) continue;

      for (int[] edge : adj.get(u)) {
        int v = edge[0], weight = edge[1];
        // [CRUX] Edge relaxation: update dist and push shorter candidate to Min-Heap:
        if (dist[u] + weight < dist[v]) {
          dist[v] = dist[u] + weight;
          pq.offer(new int[]{v, dist[v]});
        }
      }
    }
    int maxDist = 0;
    for (int i = 1; i <= n; i++) {
      if (dist[i] == Integer.MAX_VALUE) return -1;
      maxDist = Math.max(maxDist, dist[i]);
    }
    return maxDist;
  }
  \`\`\`
- **Bellman-Ford (Negative Weights & Cycle Detection)**: $\\mathcal{O}(V \\cdot E)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static int[] bellmanFord(int n, int[][] edges, int src) {
    int[] dist = new int[n];
    java.util.Arrays.fill(dist, Integer.MAX_VALUE / 2);
    dist[src] = 0;

    for (int i = 1; i <= n - 1; i++) {
      for (int[] edge : edges) {
        int u = edge[0], v = edge[1], wt = edge[2];
        if (dist[u] + wt < dist[v]) dist[v] = dist[u] + wt;
      }
    }
    // [CRUX] V-th relaxation cycle check: if any dist decreases, negative cycle exists:
    for (int[] edge : edges) {
      int u = edge[0], v = edge[1], wt = edge[2];
      if (dist[u] + wt < dist[v]) throw new IllegalStateException("Negative cycle detected");
    }
    return dist;
  }
  \`\`\`
- **Floyd-Warshall All-Pairs Shortest Path**: $\\mathcal{O}(V^3)$ Time | $\\mathcal{O}(V^2)$ Space
  \`\`\`java
  public static void floydWarshall(int[][] dist, int n) {
    // [CRUX] Intermediate vertex 'k' loop must be outermost:
    for (int k = 0; k < n; k++) {
      for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
          if (dist[i][k] != Integer.MAX_VALUE / 2 && dist[k][j] != Integer.MAX_VALUE / 2) {
            dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
          }
        }
      }
    }
  }
  \`\`\`
### Minimum Spanning Trees (MST): Kruskal & Prim's
- **Kruskal's Algorithm with DSU**: $\\mathcal{O}(E \\log E)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static int kruskalMST(int n, int[][] edges) {
    java.util.Arrays.sort(edges, (a, b) -> Integer.compare(a[2], b[2]));
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;

    int totalWeight = 0, edgesCount = 0;
    for (int[] edge : edges) {
      int rootU = find(parent, edge[0]), rootV = find(parent, edge[1]);
      // [CRUX] Cycle prevention: union only if endpoints have different DSU roots:
      if (rootU != rootV) {
        parent[rootU] = rootV;
        totalWeight += edge[2];
        if (++edgesCount == n - 1) break;
      }
    }
    return edgesCount == n - 1 ? totalWeight : -1;
  }
  private static int find(int[] p, int i) {
    return p[i] == i ? i : (p[i] = find(p, p[i]));
  }
  \`\`\`
- **Prim's Algorithm with PriorityQueue**: $\\mathcal{O}(E \\log V)$ Time | $\\mathcal{O}(V)$ Space
  \`\`\`java
  public static int primMST(int n, java.util.List<java.util.List<int[]>> adj) {
    boolean[] inMST = new boolean[n];
    java.util.PriorityQueue<int[]> pq = new java.util.PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
    pq.offer(new int[]{0, 0}); // [node, weight]
    int totalWeight = 0, count = 0;

    while (!pq.isEmpty() && count < n) {
      int[] curr = pq.poll();
      int u = curr[0], wt = curr[1];
      // [CRUX] Greedy vertex expansion: mark visited and push non-MST neighbor edges:
      if (inMST[u]) continue;
      inMST[u] = true;
      totalWeight += wt;
      count++;

      for (int[] edge : adj.get(u)) {
        if (!inMST[edge[0]]) {
          pq.offer(new int[]{edge[0], edge[1]});
        }
      }
    }
    return count == n ? totalWeight : -1;
  }
  \`\`\`

## 5. Dynamic Programming (DP) Mastery
### The 5-Step DP Formulation Engine
- **Framework Checklist**:
  - \`1. State Definition\`: What does \`dp[i]\` or \`dp[i][j]\` represent mathematically?
  - \`2. Recurrence Relation\`: Transition from subproblems to current state
  - \`3. Base Cases\`: Smallest solvable inputs
  - \`4. Direction of Computation\`: Ensure subproblems are solved before dependent states
  - \`5. Space Optimization\`: Can $O(N)$ reduce to $O(1)$ by retaining only previous rows?
### 1D Dynamic Programming: House Robber, Coin Change, LIS
- **House Robber (LeetCode 198)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int rob(int[] nums) {
    int prev1 = 0, prev2 = 0; // prev1 = dp[i-1], prev2 = dp[i-2]
    for (int num : nums) {
      // [CRUX] Space optimization: only track dp[i-1] and dp[i-2]:
      int curr = Math.max(prev1, prev2 + num);
      prev2 = prev1;
      prev1 = curr;
    }
    return prev1;
  }
  \`\`\`
- **Coin Change (Fewest Coins - LeetCode 322)**: $\\mathcal{O}(\\text{amount} \\times N)$ Time | $\\mathcal{O}(\\text{amount})$ Space
  \`\`\`java
  public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    java.util.Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
      for (int coin : coins) {
        // [CRUX] Unbounded state transition: 1 + min coins for remaining amount:
        if (i - coin >= 0) dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
    return dp[amount] > amount ? -1 : dp[amount];
  }
  \`\`\`
- **Longest Increasing Subsequence (LIS - LeetCode 300 via Patience Sort)**: $\\mathcal{O}(N \\log N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
      int i = 0, j = size;
      // [CRUX] Binary search on tails array for smallest tail >= x (Patience Sort):
      while (i < j) {
        int m = i + ((j - i) >>> 1);
        if (tails[m] < x) i = m + 1;
        else j = m;
      }
      tails[i] = x;
      if (i == size) size++;
    }
    return size;
  }
  \`\`\`
### 2D Grid DP: Unique Paths & Minimum Path Sum
- **Unique Paths (LeetCode 62)**: $\\mathcal{O}(M \\times N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    java.util.Arrays.fill(dp, 1);
    for (int r = 1; r < m; r++) {
      // [CRUX] 1D row rolling array: dp[c] accumulates top + left:
      for (int c = 1; c < n; c++) dp[c] += dp[c - 1];
    }
    return dp[n - 1];
  }
  \`\`\`
- **Minimum Path Sum (LeetCode 64)**: $\\mathcal{O}(M \\times N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = grid[0][0];
    for (int c = 1; c < n; c++) dp[c] = dp[c - 1] + grid[0][c];
    for (int r = 1; r < m; r++) {
      dp[0] += grid[r][0];
      for (int c = 1; c < n; c++) {
        // [CRUX] Choose minimum between top and left incoming paths:
        dp[c] = Math.min(dp[c], dp[c - 1]) + grid[r][c];
      }
    }
    return dp[n - 1];
  }
  \`\`\`
### Knapsack Patterns: 0/1 vs Unbounded
- **0/1 Knapsack (Partition Equal Subset Sum - LeetCode 416)**: $\\mathcal{O}(N \\times \\text{target})$ Time | $\\mathcal{O}(\\text{target})$ Space
  \`\`\`java
  public static boolean canPartition(int[] nums) {
    int sum = 0;
    for (int n : nums) sum += n;
    if ((sum & 1) != 0) return false;
    int target = sum / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums) {
      // [CRUX] 0/1 Knapsack: REVERSE iteration (target down to num) prevents reuse:
      for (int j = target; j >= num; j--) dp[j] = dp[j] || dp[j - num];
    }
    return dp[target];
  }
  \`\`\`
- **Unbounded Knapsack (Coin Change II - LeetCode 518)**: $\\mathcal{O}(N \\times \\text{amount})$ Time | $\\mathcal{O}(\\text{amount})$ Space
  \`\`\`java
  public static int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1; // 1 combination to make amount 0
    for (int coin : coins) {
      // [CRUX] Unbounded Knapsack: FORWARD iteration (coin up to amount) enables reuse:
      for (int j = coin; j <= amount; j++) dp[j] += dp[j - coin];
    }
    return dp[amount];
  }
  \`\`\`
### String DP: Longest Common Subsequence & Edit Distance
- **Longest Common Subsequence (LCS - LeetCode 1143)**: $\\mathcal{O}(M \\times N)$ Time | $\\mathcal{O}(M \\times N)$ Space
  \`\`\`java
  public static int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
      for (int j = 1; j <= n; j++) {
        // [CRUX] If characters match, extend diagonal; else take max of subproblems:
        if (text1.charAt(i - 1) == text2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[m][n];
  }
  \`\`\`
- **Edit Distance / Levenshtein (LeetCode 72)**: $\\mathcal{O}(M \\times N)$ Time | $\\mathcal{O}(M \\times N)$ Space
  \`\`\`java
  public static int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
      for (int j = 1; j <= n; j++) {
        // [CRUX] If characters match: no cost; else take 1 + min(replace, delete, insert):
        if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
        else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
      }
    }
    return dp[m][n];
  }
  \`\`\`
### Advanced DP Paradigms: State Machine & Interval DP
- **State Machine DP: Stock with Cooldown (LeetCode 309)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int maxProfitCooldown(int[] prices) {
    if (prices.length <= 1) return 0;
    int hold = -prices[0], sold = 0, rest = 0;
    for (int i = 1; i < prices.length; i++) {
      int prevSold = sold;
      // [CRUX] Tri-state machine with mandatory 1-day rest after sell:
      sold = hold + prices[i];
      hold = Math.max(hold, rest - prices[i]);
      rest = Math.max(rest, prevSold);
    }
    return Math.max(sold, rest);
  }
  \`\`\`
- **Interval DP: Burst Balloons (LeetCode 312)**: $\\mathcal{O}(N^3)$ Time | $\\mathcal{O}(N^2)$ Space
  \`\`\`java
  public static int maxCoins(int[] nums) {
    int n = nums.length;
    int[] arr = new int[n + 2];
    arr[0] = arr[n + 1] = 1; // Virtual boundaries
    System.arraycopy(nums, 0, arr, 1, n);

    int[][] dp = new int[n + 2][n + 2];
    for (int len = 1; len <= n; len++) {
      for (int l = 1; l <= n - len + 1; l++) {
        int r = l + len - 1;
        for (int k = l; k <= r; k++) {
          // [CRUX] Interval DP: 'k' is chosen as the LAST balloon to burst in [l, r]:
          int coins = arr[l - 1] * arr[k] * arr[r + 1] + dp[l][k - 1] + dp[k + 1][r];
          dp[l][r] = Math.max(dp[l][r], coins);
        }
      }
    }
    return dp[1][n];
  }
  \`\`\`

## 6. Bit Manipulation & Number Theory Math
### Bitwise Hacks & Idioms
- **Brian Kernighan's Algorithm (Number of 1 Bits - LeetCode 191)**: $\\mathcal{O}(\\text{set bits})$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
      // [CRUX] n & (n - 1) clears the lowest set bit in O(1):
      n &= (n - 1);
      count++;
    }
    return count;
  }
  \`\`\`
- **Single Number via XOR Cancellation (LeetCode 136)**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static int singleNumber(int[] nums) {
    int unique = 0;
    for (int num : nums) {
      // [CRUX] XOR cancellation: x ^ x = 0 leaves only the unique non-paired element:
      unique ^= num;
    }
    return unique;
  }
  \`\`\`
- **Subset Generation via Bitmasking**: $\\mathcal{O}(2^N \\times N)$ Time | $\\mathcal{O}(1)$ Extra Space
  \`\`\`java
  public static java.util.List<java.util.List<Integer>> subsetsBitmask(int[] nums) {
    int n = nums.length, total = 1 << n; // 2^N subsets
    java.util.List<java.util.List<Integer>> result = new java.util.ArrayList<>();
    for (int mask = 0; mask < total; mask++) {
      java.util.List<Integer> sub = new java.util.ArrayList<>();
      for (int i = 0; i < n; i++) {
        // [CRUX] Test if i-th bit is set to include element in current subset:
        if ((mask & (1 << i)) != 0) sub.add(nums[i]);
      }
      result.add(sub);
    }
    return result;
  }
  \`\`\`
### Number Theory & Prime Mathematics
- **Euclidean Greatest Common Divisor (GCD) & Overflow-Safe LCM**: $\\mathcal{O}(\\log(\\min(A, B)))$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static long gcd(long a, long b) {
    while (b != 0) {
      long temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  public static long lcm(long a, long b) {
    if (a == 0 || b == 0) return 0;
    // [CRUX] Divide first by GCD to prevent integer overflow:
    return (a / gcd(a, b)) * b;
  }
  \`\`\`
- **Sieve of Eratosthenes (Count Primes - LeetCode 204)**: $\\mathcal{O}(N \\log(\\log N))$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static int countPrimes(int n) {
    if (n <= 2) return 0;
    boolean[] isComposite = new boolean[n];
    int count = 0;
    for (int i = 2; i * i < n; i++) {
      if (!isComposite[i]) {
        // [CRUX] Start marking multiples from i * i up to n:
        for (int j = i * i; j < n; j += i) isComposite[j] = true;
      }
    }
    for (int i = 2; i < n; i++) if (!isComposite[i]) count++;
    return count;
  }
  \`\`\`
- **Binary Fast Exponentiation (LeetCode 50 - Pow(x, n))**: $\\mathcal{O}(\\log N)$ Time | $\\mathcal{O}(1)$ Space
  \`\`\`java
  public static double myPow(double x, int n) {
    long exp = n;
    if (exp < 0) { x = 1.0 / x; exp = -exp; }
    double ans = 1.0;
    while (exp > 0) {
      // [CRUX] Multiply x when LSB is 1, square x on each bit shift:
      if ((exp & 1) == 1) ans *= x;
      x *= x;
      exp >>>= 1;
    }
    return ans;
  }
  \`\`\`

## 7. Advanced String Matching & Parsing Patterns
### Knuth-Morris-Pratt (KMP) Algorithm (LeetCode 28)
- **Longest Proper Prefix which is also Suffix (LPS)**: $\\mathcal{O}(M)$ Precomputation
- **Linear String Search**: $\\mathcal{O}(N + M)$ Time | $\\mathcal{O}(M)$ Space
  \`\`\`java
  public static int strStrKMP(String haystack, String needle) {
    if (needle.isEmpty()) return 0;
    int[] lps = buildLPS(needle);
    int i = 0, j = 0; // i for haystack, j for needle

    while (i < haystack.length()) {
      if (haystack.charAt(i) == needle.charAt(j)) {
        i++; j++;
      }
      if (j == needle.length()) {
        return i - j; // Match found at starting index
      } else if (i < haystack.length() && haystack.charAt(i) != needle.charAt(j)) {
        // [CRUX] On mismatch, backtrack pattern index via LPS table without moving text pointer:
        if (j != 0) j = lps[j - 1];
        else i++;
      }
    }
    return -1;
  }

  private static int[] buildLPS(String pat) {
    int[] lps = new int[pat.length()];
    int len = 0, i = 1;
    while (i < pat.length()) {
      if (pat.charAt(i) == pat.charAt(len)) {
        lps[i++] = ++len;
      } else {
        if (len != 0) len = lps[len - 1];
        else lps[i++] = 0;
      }
    }
    return lps;
  }
  \`\`\`
### Rabin-Karp Rolling Hash (Modulo-Safe)
- **Polynomial Rolling Hash Function**: Average $\\mathcal{O}(N + M)$ Time | $\\mathcal{O}(1)$ Extra Space
  \`\`\`java
  public static int rabinKarp(String text, String pattern) {
    int n = text.length(), m = pattern.length();
    if (m > n) return -1;
    long base = 256, mod = 1_000_000_007L;
    long patHash = 0, winHash = 0, power = 1;

    for (int i = 0; i < m; i++) {
      patHash = (patHash * base + pattern.charAt(i)) % mod;
      winHash = (winHash * base + text.charAt(i)) % mod;
      if (i < m - 1) power = (power * base) % mod;
    }

    for (int i = 0; i <= n - m; i++) {
      if (patHash == winHash) {
        if (text.startsWith(pattern, i)) return i; // Exact verification on collision
      }
      if (i < n - m) {
        // [CRUX] Constant-time rolling hash: subtract old high-order char, shift, add new char:
        winHash = (winHash - (text.charAt(i) * power) % mod + mod) % mod;
        winHash = (winHash * base + text.charAt(i + m)) % mod;
      }
    }
    return -1;
  }
  \`\`\`
### Z-Algorithm (Linear Exact String Matching)
- **Z-Array Construction**: $Z[i]$ stores the length of the longest substring starting from $s[i]$ that matches a prefix of $s$: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static int[] buildZArray(String s) {
    int n = s.length();
    int[] z = new int[n];
    int l = 0, r = 0; // [l, r] defines current Z-box

    for (int i = 1; i < n; i++) {
      // [CRUX] Reuse precomputed Z-values inside the current [L, R] Z-box:
      if (i <= r) {
        z[i] = Math.min(r - i + 1, z[i - l]);
      }
      while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) {
        z[i]++;
      }
      if (i + z[i] - 1 > r) {
        l = i;
        r = i + z[i] - 1;
      }
    }
    return z;
  }
  \`\`\`
### Manacher's Linear Palindromic Algorithm (LeetCode 5)
- **Centering & Symmetry Radius Optimization**: $\\mathcal{O}(N)$ Time | $\\mathcal{O}(N)$ Space
  \`\`\`java
  public static String longestPalindromeManacher(String s) {
    if (s == null || s.length() < 2) return s;
    // Insert '#' between letters to handle even-length palindromes uniformly: "^#a#b#a#$"
    StringBuilder sb = new StringBuilder("^");
    for (char c : s.toCharArray()) sb.append('#').append(c);
    sb.append("#$");
    char[] t = sb.toString().toCharArray();

    int[] p = new int[t.length]; // Palindrome radius at center i
    int center = 0, right = 0;
    int maxLen = 0, centerIndex = 0;

    for (int i = 1; i < t.length - 1; i++) {
      int iMirror = 2 * center - i;
      // [CRUX] Mirror symmetry optimization: borrow radius from mirror across center:
      if (right > i) p[i] = Math.min(right - i, p[iMirror]);

      // Expand around center i
      while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;

      // Update rightmost boundary
      if (i + p[i] > right) {
        center = i;
        right = i + p[i];
      }
      if (p[i] > maxLen) {
        maxLen = p[i];
        centerIndex = i;
      }
    }
    int start = (centerIndex - 1 - maxLen) / 2;
    return s.substring(start, start + maxLen);
  }
  \`\`\`
`;
