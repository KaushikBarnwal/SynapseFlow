---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 380
---

# ⚛️ React Deep-Dive Mastery Roadmap (Core, Fiber, Hooks & Architecture)

## 1. Mental Model, JSX & Fiber Architecture
### Core Mental Framework
- **Declarative Paradigm: $\text{UI} = f(\text{state})$**:
  - Components are pure projection functions taking state and props, returning a declarative UI description
  - Eliminates fragile imperative DOM operations (`element.innerHTML`, `appendChild`, manual event binding)
  - Predictability: given the exact same state and props, React always outputs the identical element tree
- **Unidirectional Data Flow**:
  - Data flows strictly downward through child component props
  - Child components request changes upward by executing callback functions passed down from parents
  - Prevents bidirectional state mutations and makes state tracking deterministic and easy to debug

### JSX Compilation & The Virtual DOM
- **JSX Compilation Mechanics**:
  - JSX is syntactic sugar transformed by Babel or SWC into `React.createElement()` or modern `_jsxRuntime.jsx()` calls
  - Returns lightweight plain JavaScript objects (React Elements) with shape `{ type, props, key, ref }`
  ```jsx
  // [CRUX] JSX compiles into pure nested JavaScript objects (React Elements):
  const element = <button className="primary" onClick={handleClick}>Submit</button>;
  // Compiles to: jsx('button', { className: 'primary', onClick: handleClick, children: 'Submit' });
  ```
- **Reconciliation Engine & $\mathcal{O}(N)$ Diffing Heuristics**:
  - Full tree comparison is $\mathcal{O}(N^3)$; React uses 2 key assumptions to achieve optimal $\mathcal{O}(N)$ diffing:
    1. **Different Element Types**: Switching from `<div>` to `<span>` completely destroys the old tree and mounts a fresh one
    2. **Keys on Dynamic Lists**: Identifies stable node identity across reorders, insertions, and deletions
- **The Critical Importance of the `key` Prop**:
  - **Why never use index as key on dynamic lists?** If items are prepended or sorted, React reuses old DOM nodes and local state (e.g. input text or active animations), causing visual corruption and state desynchronization
  ```jsx
  // [CRUX] Always use persistent, unique entity IDs instead of array indices:
  {items.map(item => (
    <TodoRow key={item.id} task={item} onToggle={() => handleToggle(item.id)} />
  ))}
  ```

### React Fiber Architecture & Double Buffering
- **Stack Reconciler vs Fiber Reconciler**:
  - Legacy React 15: Stack-based recursion was synchronous and blocking; long renders dropped 60 FPS frame budgets
  - React 16+: Fiber is a singly-linked list tree structure (`child`, `sibling`, `return`) representing units of work
- **Two-Phase Execution Model**:
  - **Render / Reconciliation Phase**: Asynchronous, interruptible, priority-based calculation; can be paused or aborted by the scheduler
  - **Commit Phase**: Synchronous application of mutations to the real host DOM; invokes layout and passive effects
- **Double Buffering Pattern**:
  - React maintains two simultaneous Fiber trees: `current` (currently rendered on screen) and `workInProgress` (calculating in background)
  - Once `workInProgress` finishes render, React flips a single top-level pointer to commit changes instantly without layout flicker

## 2. State, Props & Component Lifecycle
### State Mechanics & Immutability Law
- **The Immutability Law**:
  - React detects state changes via reference equality (`Object.is`)
  - Direct mutation (`state.count = 5` or `arr.push(x)`) retains identical object references, causing React to bail out and skip re-renders
  ```jsx
  // [CRUX] Immutable array operations: filter, map, and spread preserve pure state identity:
  const addItem = (item) => setItems(prev => [...prev, item]);
  const removeItem = (id) => setItems(prev => prev.filter(x => x.id !== id));
  const updateItem = (id, text) => setItems(prev => prev.map(x => x.id === id ? { ...x, text } : x));
  ```
- **Automatic Batching in React 18+**:
  - React batches multiple state updates inside promises, timeouts, and native event handlers into a single re-render
  - Prevents cascading intermediate renders
- **Functional State Updaters**:
  - When new state depends on prior state, always pass a callback updater `prev => prev + 1` to prevent reading stale closure values
  ```jsx
  // [CRUX] Functional updater reads latest queued Fiber state rather than stale render snapshot:
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // Increments by 2 deterministically
  ```

### Props Contract & Component Lifecycle
- **Props Read-Only Contract**:
  - Props are immutable snapshots owned by parent components; child components must never reassign `props.foo = bar`
  - Pass default props using standard ES6 object destructuring defaults: `function Card({ title = 'Default' })`
- **Render Phase vs Derived State**:
  - **Anti-Pattern**: Copying props into local `useState` (creates split-brain state desynchronization)
  - **Best Practice**: Compute derived values inline during render
  ```jsx
  // [CRUX] Compute derived state on the fly during render instead of caching in useEffect/useState:
  function UserList({ users, filterText }) {
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(filterText.toLowerCase()));
    return <ul>{filteredUsers.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
  }
  ```
- **Strict Mode in Development**:
  - In React 18+, Strict Mode renders components twice and mounts/unmounts effects to expose impure side effects and missing cleanups

## 3. Complete Hooks Engine & Mechanics
### State & Reference Hooks
- **`useState`**: Local component state with optional lazy initial function:
  ```jsx
  // [CRUX] Lazy initializer function runs only once on initial mount, avoiding expensive re-computation:
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('token') || '{}'));
  ```
- **`useReducer`**: Predictable state machine transitions for complex, interrelated state:
  ```jsx
  // [CRUX] useReducer consolidates complex state transitions into a pure, testable reducer function:
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SUCCESS': return { loading: false, data: action.payload, error: null };
      case 'ERROR':   return { loading: false, data: null, error: action.payload };
      default:        return state;
    }
  }, { loading: true, data: null, error: null });
  ```
- **`useRef`**: Persistent mutable container across renders without triggering re-render:
  - Accessing direct DOM nodes (focus, measuring dimensions, canvas manipulation)
  - Holding timers and mutable instance variables
  ```jsx
  // [CRUX] useRef stores mutable values without scheduling a component re-render:
  const timerRef = useRef(null);
  const startTimer = () => { timerRef.current = setInterval(tick, 1000); };
  const stopTimer = () => clearInterval(timerRef.current);
  ```

### Effect & Synchronization Hooks
- **`useEffect` Lifecycle & Dependency Array**:
  - Runs **after** paint asynchronously (passive effect)
  - Dependency rules: `[]` runs once on mount; `[dep]` runs when `dep` reference changes; omitting runs every single render
- **Effect Cleanup & Race Condition Prevention**:
  ```jsx
  // [CRUX] AbortController cleanup prevents state updates after unmount and avoids race conditions:
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/user/${userId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => { if (err.name !== 'AbortError') setError(err); });

    return () => controller.abort(); // Invoked on unmount or before re-running with new userId
  }, [userId]);
  ```
- **`useLayoutEffect` vs `useInsertionEffect`**:
  - `useLayoutEffect`: Synchronous execution **before** browser paint; use only for reading layout metrics and preventing visual flicker
  - `useInsertionEffect`: Specifically for CSS-in-JS libraries to inject `<style>` tags before reading layout

### Memoization Hooks & Performance Controls
- **`useMemo` vs `useCallback`**:
  - `useMemo`: Caches the **result** of a computationally heavy calculation
  - `useCallback`: Caches the **function instance** to preserve identity for children wrapped in `React.memo`
  ```jsx
  // [CRUX] useCallback preserves callback reference to prevent React.memo re-renders:
  const handleDelete = useCallback((id) => {
    setList(prev => prev.filter(item => item.id !== id));
  }, []); // Dependencies remain empty because functional updater reads latest state
  ```
- **React 18 Concurrency Hooks**:
  - `useTransition`: Marks state updates as non-urgent, keeping inputs responsive
  - `useDeferredValue`: Defers re-rendering heavy downstream list until urgent input finishes
  ```jsx
  // [CRUX] useTransition keeps high-priority keystroke fluid while deferring heavy chart updates:
  const [isPending, startTransition] = useTransition();
  const handleSearch = (e) => {
    setText(e.target.value); // Urgent input update
    startTransition(() => setQuery(e.target.value)); // Non-urgent deferred filter
  };
  ```

### React 19 Action & Modern Hooks
- **`useActionState`**: Manages form action pending states, result payloads, and errors seamlessly
- **`useOptimistic`**: Instantly paints optimistic UI updates and auto-reverts on server failure
- **`useFormStatus`**: Hook for child buttons to inspect parent form pending status without prop passing
- **`use()` API**: Read promises and context directly inline or conditionally inside components

## 4. Component Composition & Design Patterns
### Composition over Inheritance
- **Containment & Specialization**:
  - Pass JSX elements via props (`header`, `sidebar`, `footer`, or `children`) instead of inheritance
  - Solves prop drilling and decouples parent layouts from child implementation details
- **Slots Pattern**:
  ```jsx
  // [CRUX] Slots pattern enables flexible component customization without prop drilling:
  function ModalLayout({ headerSlot, footerSlot, children }) {
    return (
      <div className="modal-backdrop">
        <header>{headerSlot}</header>
        <main>{children}</main>
        <footer>{footerSlot}</footer>
      </div>
    );
  }
  ```

### Advanced Architectural Patterns
- **Compound Components Pattern**:
  - Implicitly share state through Context without requiring consumers to pass explicit props to every child
  ```jsx
  // [CRUX] Compound component pattern allows declarative, flexible child composition:
  const TabsContext = createContext();
  function Tabs({ activeTab, onChange, children }) {
    return <TabsContext.Provider value={{ activeTab, onChange }}>{children}</TabsContext.Provider>;
  }
  function TabList({ children }) { return <div className="tab-list">{children}</div>; }
  function Tab({ id, children }) {
    const { activeTab, onChange } = useContext(TabsContext);
    return <button className={activeTab === id ? 'active' : ''} onClick={() => onChange(id)}>{children}</button>;
  }
  ```
- **Custom Hooks for Reusable Stateful Logic**:
  - Encapsulate business logic, listeners, and APIs into composable primitives
  ```jsx
  // [CRUX] Custom hook encapsulates window resize event listener and cleans up on unmount:
  function useWindowDimensions() {
    const [dim, setDim] = useState({ width: window.innerWidth, height: window.innerHeight });
    useEffect(() => {
      const handleResize = () => setDim({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return dim;
  }
  ```
- **Error Boundaries**:
  - Class components implementing `getDerivedStateFromError` and `componentDidCatch`
  - Catches runtime errors in subtree and renders graceful fallback UI without crashing the entire app

## 5. Performance Tuning, Profiling & Memory
### Re-render Triggers & Prevention
- **What Actually Triggers a Re-render?**:
  1. Component's own state updates
  2. Parent component re-renders (default behavior for all children unless memoized)
  3. A subscribed Context value changes
- **Bypassing Parent Re-renders (Zero Cost)**:
  - **Moving State Down**: Isolate rapidly changing state to tiny leaf components
  - **Lifting Content Up as Children**: Passing JSX as `children` preserves identical element reference, completely skipping child re-render
  ```jsx
  // [CRUX] Passing heavy components as children prevents re-rendering when parent state changes:
  function ScrollTracker({ children }) {
    const [scroll, setScroll] = useState(0); // Only ScrollTracker re-renders, children are untouched
    return <div onScroll={e => setScroll(e.target.scrollTop)}>{children}</div>;
  }
  ```
- **`React.memo` & Custom Equality Comparator**:
  - Wraps functional component with shallow prop comparison
  - Only use when the component renders frequently with identical props and performs non-trivial DOM computation

### Virtualization & Code-Splitting
- **List Virtualization (`tanstack-virtual` / `react-window`)**:
  - Renders only visible rows inside the viewport container
  - Keeps DOM element count constant (~30 nodes) even for lists of 100,000+ items
- **Dynamic Imports & Lazy Loading**:
  - `React.lazy()` paired with `<Suspense fallback={<Spinner />}>` breaks code bundles into on-demand route chunks

## 6. State Architecture & Data Fetching
### State Taxonomy
- **Local UI State**: Form input text, accordion toggles (`useState`)
- **Shared Global Client State**: Active theme, user session, modal manager (Zustand, Context)
- **Server Cache State**: Remote API datasets, pagination, mutations (TanStack Query)
- **URL State**: Active query params, filters, tab index (search params as single source of truth)

### Context API vs Dedicated Stores
- **Context API Gotchas**:
  - Every component calling `useContext(MyContext)` re-renders whenever **any** property of the context value changes
  - **Remedy**: Split State and Dispatch into two separate context providers, or use selector-based stores (Zustand)
  ```jsx
  // [CRUX] Split State Context and Dispatch Context to prevent unnecessary consumer re-renders:
  const CountStateContext = createContext();
  const CountDispatchContext = createContext();
  ```
- **TanStack Query (React Query) Modern Data Architecture**:
  - Eliminates `useEffect` for data fetching
  - Automatic background refetching on window focus, caching with `staleTime`, and cache invalidation on mutations

## 7. Modern React (React 18 & 19), RSC & Ecosystem
### React Server Components (RSC) vs Client Components
- **Server Components (`.tsx` by default in modern frameworks)**:
  - Run purely on the server, output serialized JSON representation
  - Zero impact on client JavaScript bundle size; can directly query database or access secret environment tokens
- **Client Components (`'use client'`)**:
  - Boundary marker indicating this subtree needs browser interactivity, state, event listeners, or browser APIs
  - Can accept Server Components passed as `children`
  ```jsx
  // [CRUX] Composition pattern: Server Component passed as child into Client Component preserves zero bundle size:
  'use client';
  export function ClientModal({ children }) {
    const [open, setOpen] = useState(false);
    return open ? <div className="modal">{children}</div> : null;
  }
  ```

### Server Actions & Optimistic Mutations
- **`'use server'` Directive**:
  - Defines an asynchronous server function invokable from client buttons and `<form action={serverAction}>`
  - Supports progressive enhancement without manual `fetch` calls or boilerplate API routes
- **Streaming SSR with Suspense**:
  - Renders and streams fast initial HTML while heavy database-bound components stream in as chunks asynchronously
