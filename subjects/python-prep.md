---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 480
---

# 🐍 Python Learning Roadmap & Interview Prep

## 1. Python Architecture & Internals
### CPython & Bytecode
- **Compilation**: Source `.py` compiles to bytecode `.pyc` (stored in `__pycache__`)
- **PVM (Python Virtual Machine)**: Stack-based engine that evaluates bytecode instructions sequentially
- **Dynamic Typing**: Variable names are labels referencing objects on the heap
### Global Interpreter Lock (GIL)
- **What it is**: Mutex in CPython ensuring only **one thread executes Python bytecode at a time**
- **Why it exists**: Protects CPython's reference counting memory manager from race conditions
- **I/O vs CPU**:
  - Speeds up I/O-bound tasks (GIL released during network/disk wait)
  - Does **NOT** speed up CPU-bound tasks
- **Bypassing the GIL**: Use `multiprocessing`, C/C++/Rust extensions (NumPy), or Python 3.13 free-threaded mode
### Memory Management & Garbage Collection
- **Reference Counting (Primary)**:
  - Every object tracks reference count (`sys.getrefcount(obj)`)
  - Deallocated immediately when count reaches `0`
- **Generational Cyclic GC (Secondary)**:
  - Detects unreachable reference cycles (e.g., `A` references `B` and `B` references `A`)
  - 3 generations (Gen 0, 1, 2) based on survival frequency
- **Small Integer & String Interning**:
  - Pre-allocates numbers `-5` to `256` as singletons
  - Automatically interns identifier-like strings for $\mathcal{O}(1)$ pointer dict lookups

## 2. Data Structures & Mutability
### Value Equality vs Memory Identity (`==` vs `is`)
- **Syntax Example**:
  ```python
  a = [1, 2, 3]
  b = [1, 2, 3]

  # [KEY IDEA] == checks content equivalence (__eq__); is checks memory pointer identity:
  val_eq = ([hl]a == b[/hl])  # True: identical elements
  id_eq = ([hl]a is b[/hl])   # False: distinct heap objects
  ```
- **`==` vs `is` Comparison**:
  | Operator | Evaluates | Mechanism | Typical Use Case |
  | :--- | :--- | :--- | :--- |
  | **`==` (Equality)** | Value equivalence | Invokes `__eq__()` magic method | Comparing content (`[1, 2] == [1, 2]` $\rightarrow$ `True`) |
  | **`is` (Identity)** | Physical memory address | Checks `id(a) == id(b)` | Checking singletons (`x is None`, `flag is True`) |
### Mutable vs Immutable Types
- **Mutable vs Immutable Types**:
  | Category | Types | In-Place Mutation | Hashable as Dict Key? |
  | :--- | :--- | :--- | :--- |
  | **Immutable** | `int`, `float`, `str`, `tuple`, `frozenset`, `bytes` | ❌ Disallowed (creates new object) | ✅ Yes (`__hash__` implemented) |
  | **Mutable** | `list`, `dict`, `set`, `bytearray` | ✅ Allowed in-place | ❌ No (raises `TypeError: unhashable`) |
### Copy Semantics (`copy` vs `deepcopy`)
- **Syntax Example**:
  ```python
  import copy

  orig = [[1, 2], [3, 4]]

  # [KEY IDEA] Shallow copy shares nested references; deepcopy clones all levels recursively:
  shallow = [hl]copy.copy(orig)[/hl]      # Outer list cloned, inner lists shared
  deep = [hl]copy.deepcopy(orig)[/hl]    # Complete independent recursive clone
  ```
- **Assignment (`b = a`)**: Merely creates a new reference to the same heap object
### Dictionaries Under the Hood
- Implemented as a **sparse hash table** with open addressing and pseudo-random probing
- Average lookup/insert: $\mathcal{O}(1)$
- **Key Requirement**: Must be **hashable** (implements `__hash__` and `__eq__`, typically immutable)
- **Insertion-Ordered**: Maintained as compact array since Python 3.7

## 3. Advanced Language Features
### List Comprehension vs Generator Expression
- **Syntax Example**:
  ```python
  # [KEY IDEA] Comprehensions allocate full list in RAM; generators stream 1 item on-demand (O(1) memory):
  squares_list = [[hl]x**2 for x in range(1_000_000)[/hl] if x % 2 == 0]
  squares_gen = ([hl]x**2 for x in range(1_000_000)[/hl] if x % 2 == 0)
  ```
- **List Comprehension vs Generator**:
  | Dimension | List Comprehension `[...]` | Generator Expression `(...)` |
  | :--- | :--- | :--- |
  | **Evaluation** | Eager (computes and builds entire list in RAM) | Lazy (yields 1 element on-demand via `next()`) |
  | **Memory Usage** | $\mathcal{O}(n)$ proportional to dataset | $\mathcal{O}(1)$ constant memory overhead |
  | **Indexing & Re-use** | Supports random access & multiple iterations | Single-pass stream; consumed after 1 iteration |
### Iterators & Generators
- **Iterable**: Any object with `__iter__()` returning an iterator
- **Iterator**: Object with `__iter__()` and `__next__()`; raises `StopIteration` when finished
- **Generator Function**: Uses `yield`; lazily evaluates values on-demand
- **Memory Advantage**: $\mathcal{O}(1)$ constant memory space (great for multi-gigabyte log streaming)
### Decorators & Closures
- **Closure**: Inner function retaining variables from outer enclosing scope after outer returns
- **Decorator**: Higher-order function wrapping and extending another function
- **Syntax Example**:
  ```python
  import functools
  import time

  def timer(func):
    # [KEY IDEA] @wraps copies function metadata (__name__, __doc__) to prevent closure masking:
    @[hl]functools.wraps(func)[/hl]
    def wrapper(*args, **kwargs):
      t0 = time.time()
      res = func(*args, **kwargs)
      print(f"Elapsed: {time.time() - t0:.4f}s")
      return res
    return wrapper
  ```
- **`@functools.wraps`**: Preserves original function's `__name__` and `__doc__`
### Context Managers (`with` statement)
- Manages setup and teardown guaranteed even on exceptions
- **Syntax Example**:
  ```python
  class ManagedFile:
    def __init__(self, filename):
      self.filename = filename
      self.file = None

    # [KEY IDEA] __enter__ allocates resource; __exit__ guarantees cleanup even on uncaught errors:
    def [hl]__enter__[/hl](self):
      self.file = open(self.filename, 'r')
      return self.file

    def [hl]__exit__[/hl](self, exc_type, exc_val, exc_tb):
      if self.file:
        [hl]self.file.close()[/hl]
  ```

## 4. Object-Oriented Programming (OOP)
### Instance vs Class vs Static Methods
- **Syntax Example**:
  ```python
  class Employee:
    company = "Google"

    # 1. Instance Method: Receives instance 'self'
    def log_work(self, hours):
      self.total_hours += hours

    # 2. Class Method: Receives class type 'cls'
    @classmethod
    def set_company(cls, name):
      cls.company = name

    # 3. Static Method: Namespace utility helper
    @staticmethod
    def is_valid_email(email):
      return "@" in email
  ```
- **Method Types Comparison**:
  | Method Type | Decorator | First Parameter | Access & State Scope |
  | :--- | :--- | :--- | :--- |
  | **Instance Method** | None (default) | `self` (current instance) | Reads & mutates instance state and class state |
  | **Class Method** | `@classmethod` | `cls` (current class) | Mutates class state; factory constructors |
  | **Static Method** | `@staticmethod` | None (normal args) | Isolated utility helper; no state access |
### `__new__` vs `__init__`
- **Syntax Example**:
  ```python
  class Singleton:
    _instance = None

    # [KEY IDEA] __new__ allocates the raw instance; __init__ initializes instance attributes:
    def [hl]__new__[/hl](cls, *args, **kwargs):
      if cls._instance is None:
        cls._instance = [hl]super().__new__(cls)[/hl]
      return cls._instance

    # 2. __init__: Sets attributes on the instance
    def __init__(self, name):
      self.name = name
  ```
- *Key Difference*: `__new__` runs first to physically construct and return the instance object. `__init__` receives that created instance and configures its attributes.
### Multiple Inheritance & MRO
- **MRO (Method Resolution Order)**: Order base classes are searched
- Uses **C3 Linearization Algorithm** (preserves monotonicity and local precedence)
- Inspect via `Class.mro()` or `Class.__mro__`

## 5. Concurrency Models
### `threading` vs `multiprocessing` vs `asyncio`
- **`threading`**: Preemptive OS threads; shared heap; restricted by GIL (Best for I/O tasks)
- **`multiprocessing`**: Preemptive OS processes; separate memory & GILs (Best for CPU tasks)
- **`asyncio`**: Single-threaded cooperative multitasking via event loop (Massive scale for I/O sockets)

## 6. ⚠️ Tricky MCQ Traps & Edge Cases
### 🚨 Mutable Default Argument Trap
- **Trap**: `def add(val, lst=[]): lst.append(val); return lst`
- **Why**: Default expression evaluated once at function definition; all calls without argument share same list!
- **Fix**: Use `lst=None` and instantiate inside: `if lst is None: lst = []`
### 🚨 List Multiplication Pointer Trap
- **Trap**: `a = [[0] * 3] * 2; a[0][0] = 99` $\rightarrow$ both rows change!
- **Why**: Outer multiplication copies references to the exact same inner list.
- **Fix**: Use list comprehension: `a = [[0] * 3 for _ in range(2)]`
### 🚨 LEGB Variable Scope Trap
- **Trap**: Modifying global variable inside function without `global` keyword raises `UnboundLocalError`
- **Order**: Local $\rightarrow$ Enclosing $\rightarrow$ Global $\rightarrow$ Built-in
### 🚨 Truthy vs Falsey Traps
- **Empty objects evaluate to False**: `0`, `0.0`, `""`, `[]`, `()`, `{}`, `set()`, `None`
- Never check `if x == None:`; always use `if x is None:`

## 7. 🏆 Top 5 Must-Remember Rules
- **1. Immutable Default Arguments**: Never use mutable objects (`[]`, `{}`) as default parameters
- **2. Generators for Streaming**: Use generator expressions `(x for x in ...)` over lists to avoid OOM memory crashes
- **3. GIL Workaround**: Use `multiprocessing` for CPU-bound computations; `asyncio`/`threading` for I/O sockets
- **4. is vs ==**: Use `is` only for identity/singletons (`None`, `True`, `False`); use `==` for data values
- **5. MRO Order**: Python searches methods left-to-right obeying C3 linearization without revisiting visited classes
