// Auto-generated from subjects/js-ts-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['js-ts'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 360
---

# 💛 JavaScript & TypeScript Architecture, Internals & Interview Mastery

## 1. V8 Engine & Execution Internals (Under the Hood)
### V8 Engine Pipeline
- **Parser**: Converts source code tokens into an Abstract Syntax Tree (AST)
- **Ignition (Bytecode Interpreter)**: Rapidly generates and executes unoptimized bytecode for instantaneous application startup
- **TurboFan (Optimizing JIT Compiler)**:
  - Profiles hot functions at runtime and compiles them into heavily optimized machine code
  - Uses Type Feedback; assumes objects retain consistent shapes
- **Deoptimization Traps (Megamorphism)**:
  - Changing object hidden classes dynamically or passing unexpected types forces TurboFan to bail out to slow bytecode
### Execution Context & The Call Stack
- **Execution Context Types**: Global Execution Context (GEC) & Function Execution Context (FEC)
- **Two-Phase Execution Lifecycle**:
  - **Creation Phase**: Allocates heap/stack memory, sets up the Scope Chain, binds the \`this\` keyword
  - **Execution Phase**: Runs code line-by-line, performs variable assignment, invokes function frames
- **Hoisting & Temporal Dead Zone (TDZ)**:
  - \`var\`: Hoisted and pre-initialized with \`undefined\` (leads to silent logic bugs)
  - \`let\` & \`const\`: Hoisted into the TDZ; accessing before lexical declaration throws \`ReferenceError\`
  - Function Declarations (fully hoisted with implementation) vs Function Expressions (hoisted as variable)
### Memory Heap & V8 Garbage Collection (GC)
- **Memory Allocation**: Call Stack (primitives and stack frames) vs Memory Heap (unstructured space for objects, arrays, closures)
- **Generational Garbage Collection**:
  - **Young Generation (Scavenger / Minor GC)**: Cheney's copying algorithm; fast evacuation of ephemeral short-lived objects
  - **Old Generation (Mark-Sweep-Compact / Major GC)**:
    - \`Mark\`: Traverses roots to mark all live reachable objects
    - \`Sweep\`: Reclaims memory from unmarked unreachable dead objects
    - \`Compact\`: Defragments surviving objects to prevent memory fragmentation
- **Common Memory Leaks**: Uncleared \`setInterval\`, dangling event listeners on detached DOM nodes, closures holding heavy references

## 2. Asynchronous Event Loop & Concurrency Model (Top Interview Question)
### Single-Threaded Non-Blocking Runtime
- **Call Stack**: Single LIFO execution thread executing synchronous JavaScript instructions
- **Web APIs & libuv**: Background multi-threaded engine handling timers, HTTP network requests, and filesystem I/O
- **Microtask Queue (Highest Priority)**:
  - Empties completely after the current Call Stack frame clears, *before* UI rendering and before any Macrotask
  - Sources: Promises (\`.then()\`, \`.catch()\`, \`.finally()\`), \`queueMicrotask()\`, \`MutationObserver\`
- **Macrotask Queue (Standard Priority)**:
  - Event loop processes exactly one macrotask per tick, then immediately clears all pending microtasks
  - Sources: \`setTimeout\`, \`setInterval\`, \`setImmediate\` (Node.js), I/O events, message channels
### Promise Internals & Combinators
- **Promise State Machine**: \`Pending\` → \`Fulfilled\` or \`Rejected\` (immutable once settled; cannot be canceled)
- **The 4 Promise Combinators (Crucial Interview Comparison)**:
  - **\`Promise.all\`**: Rejects immediately on first rejection (fail-fast); resolves when all promises fulfill
  - **\`Promise.allSettled\`**: Never rejects; waits for all promises to finish and returns an array of status objects
  - **\`Promise.race\`**: Settles as soon as the first promise settles (resolves or rejects)
  - **\`Promise.any\`**: Ignores rejections; resolves on first successful promise (rejects with \`AggregateError\` only if all fail)
- **Custom \`Promise.all\` Polyfill**:
  - Track completed count with counter; collect results into array preserving original order; reject on first error
### async / await Desugaring
- Syntactic sugar built on top of ES6 Generators (\`function*\` and \`yield\`) combined with automated Promise resolution
- Handled gracefully via \`try...catch\` blocks or chaining \`.catch()\` directly on the awaited expression

## 3. Scope, Closures, Functions & \`this\` Binding
### Lexical Scope & Closures
- **Lexical Scope**: Scope is determined at compile-time by physical placement of variables and blocks in source code
- **Closure**: A function bundled with references to its surrounding lexical environment
- **Production Patterns & Traps**:
  - **Data Privacy**: Emulating private variables and factory functions
  - **Function Memoization**: Caching computed results based on serialized arguments
  - **Loop Closure Trap**: \`for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))\` prints 3, 3, 3; solve with block-scoped \`let\`
### The 4 Rules of \`this\` Binding
- **1. Default Binding**: Standalone function invocation points to \`window\`/\`global\` (or \`undefined\` in \`'use strict'\`)
- **2. Implicit Binding**: Points to the object preceding the dot at invocation time (\`user.getName()\`)
- **3. Explicit Binding (\`call\`, \`apply\`, \`bind\`)**:
  - \`fn.call(ctx, arg1, arg2)\`: Invokes immediately with arguments list
  - \`fn.apply(ctx, [args])\`: Invokes immediately with arguments array
  - \`fn.bind(ctx, ...args)\`: Returns a new permanently bound function wrapper without invoking immediately
- **4. \`new\` Constructor Binding**:
  - Creates empty object → sets \`__proto__\` to constructor \`prototype\` → binds \`this\` → returns new object
### Arrow Functions vs Regular Functions
- Arrow functions do **NOT** have their own \`this\` (inherits \`this\` lexically from enclosing scope)
- Arrow functions do **NOT** have \`arguments\` object, cannot be called with \`new\`, and have no \`.prototype\` property
- Never use arrow functions as object methods when access to the object's instance properties is required

## 4. Object Mechanics, Prototypes & Type Coercion
### JavaScript Type System & Equality
- **7 Primitive Types**: \`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`
- **Primitives vs References**: Primitives are immutable and compared by value; Objects are compared by memory reference
- **Equality Comparison Algorithms**:
  - \`==\` (Abstract Equality): Applies implicit type coercion (e.g. \`[] == ![]\` evaluates to \`true\`!)
  - \`===\` (Strict Equality): Compares type and value without coercion (fails on \`NaN === NaN\` and treats \`+0 === -0\`)
  - \`Object.is()\`: Exact value equality; correctly identifies \`Object.is(NaN, NaN) === true\` and \`Object.is(+0, -0) === false\`
### Prototypal Inheritance & The Chain
- **\`prototype\` vs \`__proto__\`**:
  - \`prototype\`: Property on constructor functions used to build \`__proto__\` on newly instantiated objects
  - \`__proto__\`: Internal accessor pointer on object instances referencing their prototype parent
- **Prototype Delegation Chain**: \`instance\` → \`Constructor.prototype\` → \`Object.prototype\` → \`null\`
- **ES6 Classes**: Pure syntactic sugar over prototypal delegation; classes are first-class functions under the hood
### Property Descriptors & Mutability
- \`Object.defineProperty\`: Fine-grained property configuration (\`writable\`, \`enumerable\`, \`configurable\`, \`get\`, \`set\`)
- \`Object.freeze()\`: Shallow immutability; prevents adding, removing, or modifying property values
- \`Object.seal()\`: Prevents adding or removing properties, but allows mutating existing writable properties

## 5. High-Frequency Interview Coding Polyfills
### Debounce vs Throttle (System Design & Coding Classic)
- **Debounce**:
  - Delays function execution until N ms have passed since the last invocation event
  - Use cases: Search bar autocompletion, window resize recalculations, autosave editors
- **Throttle**:
  - Guarantees function executes at most once per N ms time interval
  - Use cases: Infinite scroll pagination, mouse move tracking, gaming canvas render loops
### Deep Clone Architecture
- \`JSON.parse(JSON.stringify(obj))\` Traps: Strips functions, \`undefined\`, \`Symbol\`, converts \`Date\` to string, fails on circular references
- Modern native \`structuredClone()\`: Fast built-in browser/Node deep-cloning utility supporting cyclic graphs
- **Recursive Deep Clone Implementation**:
  - Handle primitives, Dates, RegExps; use \`WeakMap\` cache to resolve circular object references
### Currying & Polyfills
- **Infinite Currying Polyfill**: \`add(1)(2)(3)...(n)()\` returning accumulated sum when invoked empty
- **Array Polyfills**: Writing custom implementations for \`Array.prototype.map\`, \`filter\`, \`reduce\`, and \`flat\`

## 6. TypeScript Static Typing & Generic Engineering
### Structural Typing & Contracts
- **Duck Typing / Structural Typing**: Type compatibility is governed strictly by object shape, not nominal declarations
- **\`type\` vs \`interface\` (Key Interview Question)**:
  - \`interface\`: Open to **Declaration Merging**; ideal for defining public API models and OOP class contracts
  - \`type\`: Closed; supports union types (\`|\`), intersection types (\`&\`), primitives, tuples, and mapped types
- **Top & Bottom Types**:
  - \`any\`: Disables type-checking entirely (unsafe escape hatch)
  - \`unknown\`: Type-safe counterpart to \`any\`; operations are forbidden until narrowed via type guards
  - \`never\`: Represents values that never occur (used for exhaustive switch checking in discriminated unions)
  - \`void\`: Declares functions that return no meaningful value
### Type Narrowing & Guards
- Built-in type guards: \`typeof\`, \`instanceof\`, \`'property' in obj\`
- **User-Defined Type Predicates**: \`function isDog(animal: Pet): animal is Dog\`
- **Discriminated Unions**: Objects sharing a common literal discriminator tag (e.g. \`{ kind: 'circle', radius: 10 }\`)
### Advanced Generics & Generic Constraints
- Generics allow reusable components across variable types: \`function identity<T>(arg: T): T\`
- Generic Constraints: \`<T extends Record<string, unknown>>\` restricts \`T\` to object shapes
- Key querying: \`keyof T\` produces a union of string literal property names; \`T[K]\` accesses lookup property types
### Conditional Types & The \`infer\` Keyword
- **Conditional Types**: \`T extends U ? X : Y\` enables dynamic type branches
- **The \`infer\` Keyword (Senior TS Interview Favorite)**:
  - Pattern matches and extracts embedded inner types dynamically:
  - \`type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;\`
  - \`type ArrayElement<T> = T extends (infer U)[] ? U : T;\`
### Utility Types Deep-Dive
- \`Partial<T>\`, \`Required<T>\`, \`Readonly<T>\`: Mapped types toggling property optionality and immutability
- \`Pick<T, K>\` vs \`Omit<T, K>\`: Whitelisting vs blacklisting specific keys from type \`T\`
- \`Exclude<T, U>\` vs \`Extract<T, U>\`: Filtering types from a union
- \`ReturnType<T>\` and \`Parameters<T>\`: Extracting signature metadata from callable functions

## 7. Browser Runtime, DOM & Rendering Performance
### Critical Rendering Path (CRP)
- **Pipeline**: HTML Parsing → DOM Tree + CSS Parsing → CSSOM → Render Tree → Layout (Reflow) → Paint → Composite
- **Reflow vs Repaint**:
  - **Reflow (Layout)**: Recalculates element positions and geometry; highly expensive (triggered by \`width\`, \`font-size\`)
  - **Repaint**: Re-draws visual pixels without altering layout geometry (triggered by \`color\`, \`background-color\`)
  - **GPU Compositing**: Using \`transform: translate3d()\` and \`opacity\` animates directly on GPU layers without reflows
### DOM Event Propagation & Delegation
- **3 Propagation Phases**: Capturing Phase (window down to target) → Target Phase → Bubbling Phase (target up to window)
- \`e.stopPropagation()\`: Halts propagation along the event chain
- \`e.preventDefault()\`: Prevents native browser default behavior (e.g. form submission, link navigation)
- **Event Delegation**: Attaching a single listener to a common ancestor node leveraging event bubbling to manage dynamic children
### Script Loading Strategies
- \`<script src="...">\`: Blocks HTML parsing while downloading and executing
- \`<script async src="...">\`: Downloads asynchronously; executes immediately upon download (execution order is non-deterministic)
- \`<script defer src="...">\`: Downloads asynchronously; guarantees sequential execution in order *after* HTML parsing completes
`;
