// Auto-generated from subjects/java-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['java'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 480
---

# ☕ Java Learning Roadmap & Interview Prep

## 1. Core Fundamentals
### Syntax & Variables
- **Primitive Data Types**: \`byte\` (1B), \`short\` (2B), \`int\` (4B), \`long\` (8B), \`float\` (4B), \`double\` (8B), \`char\` (2B), \`boolean\`
- **Wrapper Classes**: \`Integer\`, \`Double\`, \`Boolean\` (Objects on Heap)
- **\`final\` Keyword**:
  - Variable: Value cannot be reassigned
  - Method: Cannot be overridden in subclass
  - Class: Cannot be inherited (e.g., \`String\`, \`Integer\`)
- **\`static\` Keyword**:
  - Bound to Class, not object instance; shared memory in Metaspace
### Reference vs Value Equality (\`==\` vs \`.equals()\`)
- **Syntax Example**:
  \`\`\`java
  String s1 = "java";
  String s2 = new String("java");

  // Compares Heap memory address references
  boolean refEqual = (s1 == s2); // false

  // Compares logical character values
  boolean valEqual = s1.equals(s2); // true

  // Null-safe content comparison
  boolean safeEqual = Objects.equals(s1, s2); // true
  \`\`\`
- *Key Difference*: \`==\` checks whether both references point to the exact same memory address. \`.equals()\` evaluates logical contents.
### Control Flow & Exception Handling
- **Control Flow**: \`if-else\`, \`switch\` (pattern matching in Java 21), \`for\`, enhanced \`for-each\`, \`while\`
- **Try-Catch-Finally**:
  - Catch order: Subclass exceptions must precede superclasses
  - \`finally\`: Executes even if \`return\` is called (except \`System.exit(0)\`)
- **Try-with-Resources (Java 7+)**:
  \`\`\`java
  // Automatically calls close() on AutoCloseable
  try (BufferedReader br = new BufferedReader(
         new FileReader("data.txt"))) {
    String line = br.readLine();
    return line;
  } catch (IOException e) {
    e.printStackTrace();
  }
  \`\`\`
### Strings & Immutability
- **String Immutability**: Backed by \`byte[]\` array; thread-safe, secure, caches hashcode
- **String Constant Pool**: Located in Heap; reuses literals (\`"abc"\`)
- **\`StringBuilder\` vs \`StringBuffer\`**:
  - \`StringBuilder\`: Mutable, fast, not thread-safe (single thread)
  - \`StringBuffer\`: Mutable, thread-safe (all synchronized methods, slower)

## 2. Object-Oriented Programming (OOP) Deep Dive
### Encapsulation (Protecting Invariants)
- **Core Purpose**: Protecting **business invariants** and hiding internal implementation details
- **Why Public Fields are Dangerous**: If \`account.balance\` is public, external code can execute \`account.balance = -999999;\` bypassing all logic
- **Encapsulated Solution**: Private fields + controlled behavioral methods (\`deposit(amount)\` validates positive values)
- **Loose Coupling**: You can change internal representation (e.g. \`double\` to \`BigDecimal\`) without breaking any caller code
- **Access Modifiers**: \`private\` (class only), \`package-private\` (no modifier, package only), \`protected\` (package + subclasses), \`public\` (everywhere)
### Inheritance & Constructor Chaining
- **The 'Is-A' Relationship**: Use inheritance only when true taxonomy exists (\`Dog IS-AN Animal\`, \`ElectricCar IS-A Car\`)
- **Constructor Chaining (\`super()\`)**:
  - \`super()\` MUST be the first line in a subclass constructor
  - Why? Parent state in the Heap must be initialized before the child's specialized fields can be constructed
- **The Diamond Problem**:
  - If Class A has \`foo()\`, and Classes B and C both inherit and override \`foo()\`, which \`foo()\` does Class D inherit if \`D extends B, C\`?
  - Ambiguity! Java prevents this by allowing single class inheritance only
- **Favor Composition Over Inheritance ('Has-A')**:
  - Do NOT inherit just to borrow code; inherit only for polymorphic behavior
  - E.g. A \`Car HAS-AN Engine\` (composition), rather than \`Car EXTENDS Engine\`
### Polymorphism (Compile-Time vs Runtime)
- **Compile-Time Polymorphism (Method Overloading)**:
  \`\`\`java
  class Calculator {
    // Same name, distinct parameter signatures
    int add(int a, int b) {
      return a + b;
    }

    double add(double a, double b) {
      return a + b;
    }
  }
  \`\`\`
  - *Key Difference*: Resolved statically at compile-time based on variable reference types.
- **Runtime Polymorphism (Method Overriding)**:
  \`\`\`java
  class Animal {
    void makeSound() {
      System.out.println("Generic sound");
    }
  }

  class Dog extends Animal {
    @Override
    void makeSound() {
      System.out.println("Woof");
    }
  }

  Animal pet = new Dog();
  pet.makeSound(); // Prints "Woof" via vtable dynamic dispatch
  \`\`\`
  - *Key Difference*: Resolved dynamically at runtime by JVM consulting the object's Virtual Method Table (\`vtable\`).
### Abstraction (Abstract Class vs Interface)
- **Syntax Example**:
  \`\`\`java
  // Abstract Class = IDENTITY ('What an object IS')
  abstract class Vehicle {
    protected int speed;

    Vehicle(int speed) {
      this.speed = speed;
    }

    abstract void drive();
  }

  // Interface = CAPABILITY ('What an object CAN DO')
  interface Autonomous {
    int SENSOR_COUNT = 8;

    void navigate();

    default void selfPark() {
      System.out.println("Auto parking");
    }
  }
  \`\`\`
- *Key Differences*:
  - A class can extend only **one** Abstract Class, but implement **multiple** Interfaces.
  - Abstract classes have instance fields and constructors; interfaces contain behavior contracts and \`default\`/\`private\` methods.

## 3. JVM Architecture & Memory Model
### JVM Runtime Memory Areas
- **Heap Memory (Shared)**:
  - Stores all object instances and arrays
  - Subdivided into Young Gen (Eden, S0, S1) and Old / Tenured Gen
- **Metaspace (Shared, Java 8+)**:
  - Stores class bytecode, constant pool, static variables in **native OS memory**
- **JVM Stack (Per-Thread)**:
  - Stack frames per method call (Local variables, Operand stack, Frame data)
- **PC Register**: Tracks current JVM instruction address per thread
- **Native Method Stack**: Manages C/C++ native method execution (JNI)
### Just-In-Time (JIT) Compiler
- Converts hot bytecode paths directly into native machine code (C1 client / C2 server compiler)
- Optimizations: Method inlining, loop unrolling, escape analysis, lock coarsening

## 4. Garbage Collection (GC)
### Generational Hypothesis & Phases
- Most objects die shortly after allocation (Young Gen)
- **Minor GC**: Collects Eden $\\rightarrow$ survivors copied between \`S0\` and \`S1\`
- **Promotion**: Objects surviving 15 rounds (\`-XX:MaxTenuringThreshold\`) move to Old Gen
- **Major / Full GC**: Cleans Old Gen and Metaspace; causes longer Stop-The-World (STW) pauses
### Modern GC Collectors
- **Parallel GC**: High-throughput batch processing
- **G1 GC (Garbage-First)**: Divides heap into equal-sized regions; prioritizes garbage-heavy regions to meet pause goals
- **ZGC & Shenandoah**: Ultra-low latency (<1ms pause times); runs reference marking and compaction **concurrently**

## 5. Concurrency & Multithreading
### Thread Lifecycle States
- \`NEW\` $\\rightarrow$ \`RUNNABLE\` $\\rightarrow$ \`BLOCKED\` $\\rightarrow$ \`WAITING\` $\\rightarrow$ \`TIMED_WAITING\` $\\rightarrow$ \`TERMINATED\`
### \`synchronized\` & Lock Escalation
- Intrinsic monitor lock on object header (Mark Word)
- **Escalation Path**: Biased Lock $\\rightarrow$ Lightweight Lock (CAS spinlock) $\\rightarrow$ Heavyweight Lock (OS mutex)
### \`volatile\` vs Atomic
- **\`volatile\`**: Flushes reads/writes to main RAM (visibility + happens-before); does **NOT** make \`count++\` atomic
- **\`AtomicInteger\`**: Uses hardware-level CAS (Compare-And-Swap) for lock-free atomicity
- **Double-Checked Locking Singleton**:
  \`\`\`java
  public class SafeSingleton {
    private static volatile SafeSingleton instance;

    private SafeSingleton() {}

    public static SafeSingleton getInstance() {
      if (instance == null) {
        synchronized (SafeSingleton.class) {
          if (instance == null) {
            instance = new SafeSingleton();
          }
        }
      }
      return instance;
    }
  }
  \`\`\`
### Java 21 Virtual Threads (Project Loom)
- Lightweight M:N user-mode threads managed by JVM
  \`\`\`java
  try (var executor =
      Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> {
      // High-throughput lightweight blocking I/O
      fetchRemoteData();
    });
  }
  \`\`\`
- Thousands of times lighter than 1:1 OS platform threads; ideal for high-throughput blocking I/O

## 6. Collections Framework (JCF)
### Lists
- **\`ArrayList\`**: Dynamic array; $\\mathcal{O}(1)$ random access, $\\mathcal{O}(n)$ insert/delete
- **\`LinkedList\`**: Doubly linked list; $\\mathcal{O}(1)$ insert/delete at ends, $\\mathcal{O}(n)$ access
### Maps & Sets
- **\`HashMap\` Internals**:
  - Array of buckets (\`Node<K,V>[] table\`), default capacity 16, load factor 0.75
  - Index formula: \`(n - 1) & hash(key)\`
  - **Treeification**: Converts bucket linked list to **Red-Black Tree** when length $\\ge 8$ and capacity $\\ge 64$
- **\`ConcurrentHashMap\`**: Thread-safe with segment/bucket-level locking; no global lock
- **\`HashSet\`**: Backed internally by a \`HashMap\` (values stored as dummy Object)

## 7. ⚠️ Tricky MCQ Traps & Edge Cases
### 🚨 String Pool Trap
- **Trap**: \`String s1 = "abc"; String s2 = new String("abc"); (s1 == s2)\`
- **Correct**: Returns \`false\`! \`s1\` points to String Pool; \`s2\` points to new heap instance. Always use \`.equals()\`.
### 🚨 Autoboxing Null Pointer Trap
- **Trap**: \`Integer x = null; if (x == 0) ...\`
- **Correct**: Throws \`NullPointerException\`! Comparing with primitive invokes \`x.intValue()\`.
### 🚨 \`equals()\` and \`hashCode()\` Contract
- **Trap**: Overriding \`equals()\` without \`hashCode()\`
- **Correct**: Breaks \`HashMap\`/\`HashSet\` lookups! If \`a.equals(b)\` is true, \`a.hashCode() == b.hashCode()\` MUST be true.
### 🚨 Array Equality Trap
- **Trap**: \`int[] a = {1, 2}; int[] b = {1, 2}; a.equals(b)\`
- **Correct**: Returns \`false\`! Arrays do not override \`equals()\`; use \`Arrays.equals(a, b)\`.

## 8. 🏆 Top 5 Must-Remember Rules
- **1. HashMap Treeification**: Linked list converts to Red-Black tree at depth 8 ($\\mathcal{O}(\\log n)$ worst-case)
- **2. volatile != atomic**: \`volatile\` guarantees visibility and instruction ordering, not atomicity
- **3. Overriding Rule**: Cannot reduce visibility (e.g., overriding \`public\` method with \`protected\` fails compilation)
- **4. Type Erasure**: Java generics are erased to \`Object\` or bounds at compile time; cannot do \`new T()\`
- **5. Virtual Threads**: Use Virtual Threads (\`Executors.newVirtualThreadPerTaskExecutor()\`) for I/O tasks in Java 21+
`;
