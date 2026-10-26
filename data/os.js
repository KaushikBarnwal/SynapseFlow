// Auto-generated from subjects/os-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['os'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 340
---

# 🖥️ Operating Systems Learning Roadmap & Interview Prep

## 1. Process & Thread Management
### Process vs Thread
- **Process vs Thread Comparison**:
  | Dimension | Process | Thread |
  | :--- | :--- | :--- |
  | **Memory Space** | Isolated private address space (separate Heap/Data) | Shares parent process address space (Shared Heap) |
  | **Context Switch** | Heavyweight (switches page tables, flushes TLB) | Lightweight (switches only registers & stack) |
  | **Creation Cost** | High (\`fork()\` syscall + address map allocation) | Low (allocates tiny stack within existing process) |
  | **Blast Radius** | Isolated: 1 process crash does not kill others | Shared: Uncaught crash in 1 thread terminates entire process |
  | **Communication** | IPC required (Pipes, Sockets, Shared Memory) | Direct memory read/write (requires synchronization) |
### Process States & Life Cycle
- **New**: Program being created and loaded into memory
- **Ready**: In RAM queue, waiting for CPU assignment by scheduler
- **Running**: Instructions executing on CPU
- **Waiting / Blocked**: Paused waiting for I/O completion or lock acquisition
- **Terminated**: Finished execution; resources reclaimed
- **Zombie Process**: Terminated process still in process table because parent hasn't called \`wait()\`
- **Orphan Process**: Parent process died; reparented to \`init\` / \`systemd\` (PID 1) to be reaped
- **Process Creation & Zombie Prevention**:
  \`\`\`c
  pid_t pid = fork();
  if (pid == 0) {
    // [KEY IDEA] Child process receives PID 0 from fork() and executes new binary image:
    [hl]execlp("/bin/ls", "ls", "-la", NULL)[/hl];
  } else if (pid > 0) {
    // [KEY IDEA] Parent reaps child exit status via waitpid to prevent zombie process leaks:
    int status;
    [hl]waitpid(pid, &status, 0)[/hl];
  }
  \`\`\`
### Inter-Process Communication (IPC)
- **Shared Memory**: Fastest IPC method; direct RAM access without kernel copying (requires mutex/semaphores)
- **Message Passing / Queues**: Safe across systems; OS-managed buffer
- **Pipes**: Unidirectional byte streams (anonymous pipes for parent-child; named pipes/FIFOs for unrelated processes)
- **Sockets**: Local (Unix domain sockets) and networked IPC

## 2. CPU Scheduling Algorithms
### Preemptive vs Non-Preemptive
- **Preemptive vs Non-Preemptive Scheduling**:
  | Feature | Preemptive | Non-Preemptive |
  | :--- | :--- | :--- |
  | **CPU Control** | OS can forcibly interrupt running process | Process holds CPU until it yields or terminates |
  | **Algorithms** | Round Robin, SRTF, Preemptive Priority | FCFS, Non-preemptive SJF |
  | **Context Switches** | Frequent (incurs scheduler overhead) | Minimal (only on process completion/IO wait) |
  | **Starvation Risk** | Low (bounded wait via time slices) | High (long jobs can starve short jobs) |
### Classic Algorithms
- **First-Come, First-Served (FCFS)**: Simple queue; suffers from **Convoy Effect** (short jobs wait behind CPU hogs)
- **Shortest Job First (SJF)**: Optimal average wait time, but impossible to know exact burst time; risks starvation
- **Round Robin (RR)**: Time-sharing with fixed **Time Quantum**
  - Quantum too large $\\rightarrow$ degrades to FCFS
  - Quantum too small $\\rightarrow$ excessive context-switching overhead
- **Priority Scheduling**: Processes executed by priority; solve starvation via **Aging** (gradually boosting waiting process priority)

## 3. Memory Management & Virtual Memory
### Virtual Memory & Paging
- **Virtual Address Space**: Illusion provided to each process of contiguous private memory
- **Paging**: Physical RAM divided into fixed-size **Frames**; virtual memory divided into equal **Pages** (typically 4KB)
- **Page Table**: Maps Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN)
- **Fragmentation**: Paging eliminates external fragmentation; suffers only from **Internal Fragmentation** (unused space in final page)
- **Page Address Translation Math**:
  \`\`\`c
  // Given 32-bit address space with 4KB pages (2^12 bytes offset):
  uint32_t virtual_addr = 0x00403ABC;
  // [KEY IDEA] Right shift by 12 bits extracts VPN; bitwise AND with 0xFFF extracts page offset:
  uint32_t [hl]vpn = virtual_addr >> 12[/hl];       // Virtual Page Number
  uint32_t [hl]offset = virtual_addr & 0xFFF[/hl];  // Byte offset within frame
  uint32_t physical_addr = ([hl]page_table[vpn] << 12[/hl]) | offset;
  \`\`\`
### Translation Lookaside Buffer (TLB)
- Hardware associative cache inside the CPU (MMU) storing recent page translations
- **TLB Hit**: Address translated in 1 CPU cycle
- **TLB Miss**: CPU must walk multi-level page tables in RAM (slower)
### Page Faults & Thrashing
- **Page Fault**: Trap interrupt when process accesses valid virtual page not currently in physical RAM
- **Thrashing**: Memory oversubscribed; system spends 99% of time swapping pages between RAM and disk instead of executing instructions
  - Fix: Decrease multiprogramming degree, use Working Set Model, add RAM
### Page Replacement Algorithms
- **FIFO**: First-in, first-out; suffers from **Belady's Anomaly** (adding frames can increase page faults)
- **LRU (Least Recently Used)**: Replaces page unused for longest time; optimal practical approach (Clock algorithm)
- **Optimal (OPT / MIN)**: Evicts page that won't be used for longest future duration (theoretical benchmark)

## 4. Concurrency, Synchronization & Deadlocks
### Critical Section & Race Conditions
- **Race Condition**: Multiple threads access shared data concurrently; outcome depends on execution timing
- **Critical Section**: Code block accessing shared resources
- **Requirements for Solution**: Mutual Exclusion, Progress, Bounded Waiting
### Mutex vs Semaphore vs Spinlock
- **Synchronization Primitives**:
  | Primitive | Locking Mechanism | Ownership & Release | Primary Use Case |
  | :--- | :--- | :--- | :--- |
  | **Mutex** | Sleep Lock (puts thread to sleep in OS wait queue) | Ownership enforced: only locking thread can unlock | Mutual exclusion on shared data structures |
  | **Binary Semaphore** | Signaling Flag (Integer value $0$ or $1$) | No ownership: Thread A can wait, Thread B can signal | Inter-thread coordination and signaling |
  | **Counting Semaphore** | Pool Counter (Integer value up to $N$) | Decremented on \`acquire\`, incremented on \`release\` | Managing access to a pool of $N$ identical resources |
  | **Spinlock** | Busy-Wait Loop (polls CPU in active spin cycle) | No sleep; avoids OS thread context switch | Microsecond locks in multicore kernels & drivers |
- **Mutex vs Semaphore Synchronization in C**:
  \`\`\`c
  // 1. POSIX Mutex: Mutual exclusion on critical section
  pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
  // [KEY IDEA] Mutex lock enforces thread ownership and sleeps waiting threads:
  [hl]pthread_mutex_lock(&lock)[/hl];
  counter++; // Thread-safe critical section
  [hl]pthread_mutex_unlock(&lock)[/hl];

  // 2. Counting Semaphore: Producer-Consumer coordination
  sem_t empty_slots; // Initialized to buffer capacity N
  // [KEY IDEA] Semaphores signal cross-thread availability without requiring ownership:
  [hl]sem_wait(&empty_slots)[/hl]; // Decrement available slots or block if 0
  enqueue_item(data);
  [hl]sem_post(&full_slots)[/hl];  // Signal waiting consumers
  \`\`\`
### Deadlocks & Coffman Conditions
- **4 Necessary Conditions**:
  - 1. **Mutual Exclusion**: Non-shareable resource
  - 2. **Hold and Wait**: Process holding resources requests additional ones
  - 3. **No Preemption**: Resources cannot be forcibly revoked
  - 4. **Circular Wait**: Cyclic dependency of waiting processes ($P_0 \\rightarrow P_1 \\rightarrow \\dots \\rightarrow P_0$)
- **Deadlock Handling**:
  - **Prevention**: Invalidate 1 of 4 conditions (e.g., enforce strict global resource ordering)
  - **Avoidance**: **Banker's Algorithm** (safely grant requests only if system stays in safe state)
  - **Detection & Recovery**: Kill/preempt processes using Resource Allocation Graphs (cycle check)

## 5. Hardware & Dual Mode Architecture
### User Mode vs Kernel Mode
- **User Mode (Ring 3)**: Applications run with restricted instructions; cannot directly touch hardware
- **Kernel Mode (Ring 0)**: Unrestricted CPU hardware access and privileged instructions
- **System Call**: Controlled gateway from user mode to kernel mode via software trap
### Interrupts vs Traps
- **Hardware Interrupt**: Asynchronous signal from hardware device (keyboard, network card, disk)
- **Trap / Software Interrupt**: Synchronous event triggered by CPU instruction (divide-by-zero, page fault, syscall)

## 6. ⚠️ Tricky MCQ Traps & Edge Cases
### 🚨 Belady's Anomaly Trap
- **Trap**: "Does adding more RAM frames always decrease page faults?"
- **Correct**: **NO!** In FIFO page replacement, increasing frames can cause MORE page faults. LRU does not suffer from this.
### 🚨 Zombie vs Orphan Trap
- **Trap**: "What is a process whose parent dies before it called?"
- **Correct**: **Orphan Process** (adopted by PID 1 \`init\`). A **Zombie** is a completed process whose parent hasn't reaped it via \`wait()\`.
### 🚨 Spinlock on Single-Core Trap
- **Trap**: "Can spinlocks be used on a single-core CPU?"
- **Correct**: **NO!** The spinning thread monopolizes the only CPU core, preventing the lock holder from ever making progress.

## 7. 🏆 Top 5 Must-Remember Rules
- **1. Remember Coffman Conditions**: Break any 1 of the 4 conditions to prevent deadlocks entirely
- **2. Explain Page Fault Steps**: Trap $\\rightarrow$ Save registers $\\rightarrow$ Fetch page from disk $\\rightarrow$ Update page table $\\rightarrow$ Restart instruction
- **3. Mutex vs Semaphore**: Mutex = Lock with ownership; Semaphore = Signaling between threads
- **4. Internal vs External Fragmentation**: Paging has internal fragmentation; Segmentation has external
- **5. Context Switch Overhead**: Pure overhead; saving CPU registers, swapping page tables, and flushing TLB
`;
