---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 340
---

# 🖥️ Operating Systems Learning Roadmap & Interview Prep

## 1. Process & Thread Management
### Process vs Thread
- **Process**:
  - Independent program in execution with private virtual address space (Text, Data, Heap, Stack)
  - Heavyweight context switch (switches page tables, flushes TLB cache)
  - Failure isolation: Crash in one process doesn't bring down others
- **Thread**:
  - Smallest schedulable unit of execution inside a process
  - Shares parent process's heap, code, open file descriptors, and data segment
  - Private Program Counter (PC), CPU registers, and Stack
  - Lightweight creation and fast context switching
### Process States & Life Cycle
- **New**: Program being created and loaded into memory
- **Ready**: In RAM queue, waiting for CPU assignment by scheduler
- **Running**: Instructions executing on CPU
- **Waiting / Blocked**: Paused waiting for I/O completion or lock acquisition
- **Terminated**: Finished execution; resources reclaimed
- **Zombie Process**: Terminated process still in process table because parent hasn't called `wait()`
- **Orphan Process**: Parent process died; reparented to `init` / `systemd` (PID 1) to be reaped
### Inter-Process Communication (IPC)
- **Shared Memory**: Fastest IPC method; direct RAM access without kernel copying (requires mutex/semaphores)
- **Message Passing / Queues**: Safe across systems; OS-managed buffer
- **Pipes**: Unidirectional byte streams (anonymous pipes for parent-child; named pipes/FIFOs for unrelated processes)
- **Sockets**: Local (Unix domain sockets) and networked IPC

## 2. CPU Scheduling Algorithms
### Preemptive vs Non-Preemptive
- **Preemptive**: OS can forcibly interrupt running process (Round Robin, SRTF)
- **Non-Preemptive**: Process holds CPU until it voluntarily yields or terminates (FCFS, basic SJF)
### Classic Algorithms
- **First-Come, First-Served (FCFS)**: Simple queue; suffers from **Convoy Effect** (short jobs wait behind CPU hogs)
- **Shortest Job First (SJF)**: Optimal average wait time, but impossible to know exact burst time; risks starvation
- **Round Robin (RR)**: Time-sharing with fixed **Time Quantum**
  - Quantum too large $\rightarrow$ degrades to FCFS
  - Quantum too small $\rightarrow$ excessive context-switching overhead
- **Priority Scheduling**: Processes executed by priority; solve starvation via **Aging** (gradually boosting waiting process priority)

## 3. Memory Management & Virtual Memory
### Virtual Memory & Paging
- **Virtual Address Space**: Illusion provided to each process of contiguous private memory
- **Paging**: Physical RAM divided into fixed-size **Frames**; virtual memory divided into equal **Pages** (typically 4KB)
- **Page Table**: Maps Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN)
- **Fragmentation**: Paging eliminates external fragmentation; suffers only from **Internal Fragmentation** (unused space in final page)
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
- **Mutex**: Locking mechanism with ownership (only locking thread can release it)
- **Binary Semaphore**: Signaling flag (values 0 or 1); thread A can wait, thread B can signal
- **Counting Semaphore**: Manages a finite pool of $N$ identical resources
- **Spinlock**: Busy-waits in a CPU loop; efficient only in multi-core kernels for microscopic hold times
### Deadlocks & Coffman Conditions
- **4 Necessary Conditions**:
  - 1. **Mutual Exclusion**: Non-shareable resource
  - 2. **Hold and Wait**: Process holding resources requests additional ones
  - 3. **No Preemption**: Resources cannot be forcibly revoked
  - 4. **Circular Wait**: Cyclic dependency of waiting processes ($P_0 \rightarrow P_1 \rightarrow \dots \rightarrow P_0$)
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
- **Correct**: **Orphan Process** (adopted by PID 1 `init`). A **Zombie** is a completed process whose parent hasn't reaped it via `wait()`.
### 🚨 Spinlock on Single-Core Trap
- **Trap**: "Can spinlocks be used on a single-core CPU?"
- **Correct**: **NO!** The spinning thread monopolizes the only CPU core, preventing the lock holder from ever making progress.

## 7. 🏆 Top 5 Must-Remember Rules
- **1. Remember Coffman Conditions**: Break any 1 of the 4 conditions to prevent deadlocks entirely
- **2. Explain Page Fault Steps**: Trap $\rightarrow$ Save registers $\rightarrow$ Fetch page from disk $\rightarrow$ Update page table $\rightarrow$ Restart instruction
- **3. Mutex vs Semaphore**: Mutex = Lock with ownership; Semaphore = Signaling between threads
- **4. Internal vs External Fragmentation**: Paging has internal fragmentation; Segmentation has external
- **5. Context Switch Overhead**: Pure overhead; saving CPU registers, swapping page tables, and flushing TLB
