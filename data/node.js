// Auto-generated from subjects/node-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['node'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 380
---

# 🟢 Node.js & Express Deep-Dive Mastery Roadmap (Runtime, Streams & Web Architecture)

## 1. Node.js Architecture, V8 & Libuv Engine
### Core Architectural Layers
- **Three-Tier Architecture**:
  - **JavaScript Standard Library**: Native JS APIs (\`fs\`, \`http\`, \`stream\`, \`events\`, \`crypto\`)
  - **Node.js C++ Bindings**: Connects high-level JavaScript calls to low-level native OS routines via \`node_api\` / V8 bindings
  - **Underlying C/C++ Dependencies**:
    - **Google V8**: Compiles JavaScript directly to native machine code; handles call stack and garbage-collected heap
    - **Libuv**: Multi-platform C library providing the event loop, threadpool, and cross-platform non-blocking I/O
    - **OpenSSL**: Cryptographic operations, TLS/SSL termination
    - **llhttp**: Ultra-fast C-based HTTP parser
- **V8 Heap Layout & Memory Allocation**:
  - Memory divided into **Stack** (primitive values, execution context frames) and **V8 Heap** (objects, closures, arrays)
  - Heap structured into **New Space** (young generation, collected frequently via Scavenger algorithm) and **Old Space** (survived objects, swept via Mark-Sweep-Compact)
  - V8 Memory limit default is ~1.4GB on 64-bit systems; adjustable via CLI flag:
  \`\`\`bash
  # [KEY IDEA] Expand V8 Old Space memory allocation for memory-heavy data pipelines:
  node --max-old-space-size=4096 app.js
  \`\`\`

### Libuv Asynchronous I/O & C++ Threadpool
- **OS Event Demultiplexers (Non-Blocking Networking)**:
  - Network sockets and IPC are multiplexed directly by the operating system kernel (\`epoll\` on Linux, \`kqueue\` on macOS, \`IOCP\` on Windows)
  - Zero worker threads are consumed for active network connections; single thread can monitor tens of thousands of sockets
- **The Libuv Threadpool (Blocking System Tasks)**:
  - Operating systems lack universal asynchronous APIs for file systems and DNS lookups
  - Libuv delegates these blocking operations to a hidden C++ worker threadpool:
    1. **File System (\`fs\`)**: \`fs.readFile\`, \`fs.writeFile\`, \`fs.stat\`
    2. **DNS Resolution**: \`dns.lookup\` (queries \`/etc/hosts\` and system resolver synchronously)
    3. **Crypto Operations**: \`crypto.pbkdf2\`, \`crypto.scrypt\`, \`crypto.randomBytes\`
    4. **Compression**: \`zlib\` deflate/inflate
- **Threadpool Sizing & Thread Starvation**:
  - Default size is **4 threads**; heavy concurrent crypto operations can completely choke file I/O operations
  \`\`\`javascript
  // [KEY IDEA] Scale Libuv threadpool size before process initializes (must be set in environment):
  // Linux / macOS: UV_THREADPOOL_SIZE=16 node app.js
  // Inside code: must execute before any async call is initiated
  process.env.UV_THREADPOOL_SIZE = 16;
  \`\`\`

## 2. Event Loop Phases, Microtasks & Async Execution
### The 6 Event Loop Phases (Clockwise Cycle)
- **Phase 1: Timers Phase**:
  - Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\` whose threshold duration has passed
  - Stored internally in a Min-Heap data structure sorted by expiration timestamp
- **Phase 2: Pending Callbacks (I/O Callbacks)**:
  - Executes deferred system-level callbacks (e.g. TCP socket \`ECONNREFUSED\` error notifications)
- **Phase 3: Idle, Prepare Phase**:
  - Internal Libuv housekeeping routines executed only by the runtime engine
- **Phase 4: Poll Phase (Heart of the Loop)**:
  - Calculates how long it should block and wait for new I/O events
  - Retrieves new incoming network connections, data chunks, and file reads from the OS kernel queue
- **Phase 5: Check Phase (\`setImmediate\`)**:
  - Specifically designated to execute callbacks registered via \`setImmediate()\`
  - Runs immediately after the Poll phase finishes processing events
- **Phase 6: Close Callbacks**:
  - Handles abrupt closures and resource destructions (e.g. \`socket.on('close', ...)\`)

### Microtask Queues & Priority Mechanics
- **The Microtask Invariant**:
  - Microtasks do NOT belong to any single event loop phase; they drain **immediately** whenever the JS call stack empties, before the event loop moves to the next phase
- **Two Distinct Microtask Queues**:
  1. **\`process.nextTick\` Queue (Highest Priority)**: Evaluated before any Promise microtask; recursive calls cause event loop starvation
  2. **Promise Queue (Standard Microtask)**: Handles resolved \`Promise.then()\`, \`catch()\`, \`finally()\`, and \`queueMicrotask()\`
- **Execution Order Trap (\`setImmediate\` vs \`setTimeout\`)**:
  \`\`\`javascript
  // [KEY IDEA] Microtask priority: nextTick always executes before Promise microtasks and timers:
  setTimeout(() => console.log('1. Timer Phase'), 0);
  setImmediate(() => console.log('2. Check Phase'));
  Promise.resolve().then(() => console.log('3. Promise Microtask'));
  process.nextTick(() => console.log('4. nextTick Priority Microtask'));
  // Output order: 4 -> 3 -> 1 (or 2 depending on event loop start tick)
  \`\`\`
- **Guaranteed Order Inside I/O Callbacks**:
  \`\`\`javascript
  // [KEY IDEA] Inside any I/O callback (Poll phase), setImmediate ALWAYS runs before setTimeout(0):
  const fs = require('fs');
  fs.readFile(__filename, () => {
    setTimeout(() => console.log('Timeout'), 0);
    setImmediate(() => console.log('Immediate')); // Guaranteed first because Check follows Poll
  });
  \`\`\`

## 3. Buffers, Streams & Binary Backpressure
### Buffer Architecture & Memory Management
- **Raw Memory Outside V8**:
  - Instances of \`Buffer\` represent fixed-length sequences of raw octets allocated outside V8's heap in C++ memory
  - Backed by JavaScript \`Uint8Array\`
- **Safe vs Unsafe Allocation**:
  - \`Buffer.alloc(size)\`: Initializes and zeros out allocated memory (safe from data leaks)
  - \`Buffer.allocUnsafe(size)\`: Fast allocation without zero-filling; contains leftover sensitive garbage memory
  \`\`\`javascript
  // [KEY IDEA] Always use Buffer.alloc or Buffer.from to prevent leaking residual memory:
  const secureBuf = Buffer.alloc(1024); // Zero-filled 1KB buffer
  const strBuf = Buffer.from('SynapseFlow', 'utf-8'); // Encodes string to raw hex bytes
  \`\`\`

### The 4 Native Stream Types
- **Readable Streams**: Producers of data (\`fs.createReadStream\`, HTTP \`req\`, \`process.stdin\`)
- **Writable Streams**: Consumers of data (\`fs.createWriteStream\`, HTTP \`res\`, \`process.stdout\`)
- **Duplex Streams**: Both readable and writable simultaneously (\`net.Socket\`)
- **Transform Streams**: Duplex streams that compute or modify output based on input (\`zlib.createGzip\`, \`crypto.createCipheriv\`)

### Backpressure & Safe Pipeline Composition
- **The Backpressure Dilemma**:
  - Occurs when data is read from a fast source faster than the slow destination can write it (e.g. reading 100MB/s from SSD and sending over 1MB/s mobile network)
  - Without backpressure control, unconsumed chunks accumulate in RAM, triggering V8 out-of-memory crashes
- **The \`highWaterMark\` & Drain Engine**:
  \`\`\`javascript
  // [KEY IDEA] Native backpressure handling: pause reading when writable buffer hits highWaterMark:
  const readable = fs.createReadStream('source.mp4');
  const writable = fs.createWriteStream('dest.mp4');

  readable.on('data', (chunk) => {
    const canContinue = writable.write(chunk);
    if (!canContinue) {
      readable.pause(); // Stop reading until consumer flushes its internal buffer
    }
  });
  writable.on('drain', () => {
    readable.resume(); // Consumer buffer emptied below highWaterMark, resume reading
  });
  \`\`\`
- **Production Standard: \`stream.pipeline\`**:
  - \`.pipe()\` has a fatal flaw: it does NOT automatically destroy all streams or clean up descriptors if an error occurs mid-stream
  - Always use \`stream.pipeline\` (or \`stream/promises\`) in production:
  \`\`\`javascript
  // [KEY IDEA] stream.pipeline ensures zero memory leaks and cleans up all stream descriptors on failure:
  const { pipeline } = require('stream/promises');
  const zlib = require('zlib');

  async function compressFile(input, output) {
    await pipeline(
      fs.createReadStream(input),
      zlib.createGzip(),
      fs.createWriteStream(output)
    );
  }
  \`\`\`

## 4. Core Modules, File System & EventEmitter
### The \`EventEmitter\` Architecture
- **Observer Pattern Engine**:
  - Core of Node.js event-driven architecture; classes like \`http.Server\`, \`Stream\`, and \`Socket\` inherit from \`EventEmitter\`
  - Event listeners execute **synchronously** in the order they were registered when \`.emit()\` is triggered
  \`\`\`javascript
  // [KEY IDEA] Custom Event Emitter implementation with clean listener lifecycle:
  const EventEmitter = require('events');
  class OrderService extends EventEmitter {
    placeOrder(order) {
      // Business logic...
      this.emit('order:created', order); // Synchronous listener dispatch
    }
  }
  const orders = new OrderService();
  orders.on('order:created', (order) => console.log('Send confirmation email:', order.id));
  \`\`\`
- **Memory Leak Warning & \`defaultMaxListeners\`**:
  - By default, attaching more than 10 listeners to an emitter prints a \`MaxListenersExceededWarning\`
  - Un-removed listeners on long-lived objects (e.g. WebSocket connection handles) cause major memory leaks
  \`\`\`javascript
  // [KEY IDEA] Increase listener threshold or remove listeners on resource teardown:
  emitter.setMaxListeners(25);
  emitter.removeListener('data', onDataCallback); // Critical for socket cleanups
  \`\`\`

### File System (\`fs/promises\`) Best Practices
- **Synchronous Methods Anti-Pattern**: Never call \`fs.readFileSync\` or \`fs.writeFileSync\` in request handlers (freezes all concurrent users)
- **Modern Async/Await File Operations**:
  \`\`\`javascript
  // [KEY IDEA] Clean async file system operations using fs/promises:
  const fs = require('fs/promises');
  async function readConfig(filePath) {
    try {
      const data = await fs.readFile(filePath, { encoding: 'utf-8' });
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') console.error('File not found');
      throw err;
    }
  }
  \`\`\`

## 5. Express.js Architecture, Routing & Middleware Engine
### Express Foundations & The HTTP Wrapper
- **Under the Hood**:
  - Express is a routing and middleware framework layered on top of Node's native \`http\` module
  - Passing \`app\` directly into \`http.createServer(app)\` binds Express's request handler to Node's HTTP server
  \`\`\`javascript
  // [KEY IDEA] Native HTTP server instantiation using Express application handler:
  const express = require('express');
  const http = require('http');
  const app = express();
  const server = http.createServer(app); // Enables shared port with Socket.io / WebSockets
  \`\`\`

### The Middleware Onion Pipeline
- **Chain of Responsibility Pattern**:
  - Middleware functions have access to \`req\`, \`res\`, and the \`next\` function in the cycle
  - Three outcomes of middleware:
    1. Transform request/response (e.g. parse auth header, attach \`req.user\`)
    2. End the request-response cycle (\`res.status(200).json(...)\`)
    3. Delegate to next middleware (\`next()\`)
- **Application vs Modular Router Middleware**:
  \`\`\`javascript
  // [KEY IDEA] Modular Router partitioning with local route middleware:
  const router = express.Router();
  const requireAuth = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Unauthorized' });
    next(); // Advance to route handler
  };

  router.get('/profile', requireAuth, (req, res) => {
    res.json({ user: req.user });
  });
  app.use('/api/v1/users', router);
  \`\`\`

### Global Error Handling Architecture
- **The 4-Argument Error Middleware**:
  - Express distinguishes error middleware by inspecting function arity (\`fn.length === 4\` parameters: \`err, req, res, next\`)
  - Any call to \`next(err)\` bypasses all downstream standard middleware and routes directly to the error handler
  \`\`\`javascript
  // [KEY IDEA] Centralized Express error-handling middleware:
  app.use((err, req, res, next) => {
    console.error('Unhandled System Error:', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });
  \`\`\`
- **Async Error Handling Wrapper**:
  - Express 4 does not automatically catch rejected promises in async route handlers; unhandled rejections crash the server
  \`\`\`javascript
  // [KEY IDEA] Async handler wrapper forwards async Promise rejections to Express error middleware:
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  app.get('/data', asyncHandler(async (req, res) => {
    const result = await databaseQuery(); // If this throws, forwarded to global error middleware
    res.json(result);
  }));
  \`\`\`

## 6. REST API Design, Security & Authentication
### RESTful Design & Parameter Sanitization
- **Semantic HTTP Verbs & Idempotency**:
  - \`GET\`: Safe & Idempotent (never mutate data via GET)
  - \`POST\`: Non-Idempotent (creates a new resource, returns \`201 Created\`)
  - \`PUT\`: Idempotent (replaces resource entirely)
  - \`PATCH\`: Non-Idempotent (applies partial delta update)
  - \`DELETE\`: Idempotent (removes resource, returns \`204 No Content\` or \`200\`)
- **Route Parameter Extraction**:
  \`\`\`javascript
  // [KEY IDEA] Express parameter extraction: URL params, query filters, and body payload:
  app.patch('/api/products/:id', (req, res) => {
    const productId = req.params.id; // Route param
    const notifyAdmin = req.query.notify === 'true'; // Query param
    const { price, stock } = req.body; // Parsed JSON body
    res.status(200).json({ productId, price, stock, notifyAdmin });
  });
  \`\`\`

### Web Security Hardening
- **HTTP Security Headers with \`helmet\`**:
  - Masks \`X-Powered-By: Express\` (prevents attacker fingerprinting)
  - Configures \`Content-Security-Policy\` (CSP), \`X-Frame-Options\` (prevents Clickjacking), \`Strict-Transport-Security\` (HSTS)
- **CORS Configuration & Rate Limiting**:
  \`\`\`javascript
  // [KEY IDEA] Defensive security configuration: Helmet, strict CORS whitelist, and Rate Limiter:
  const helmet = require('helmet');
  const cors = require('cors');
  const rateLimit = require('express-rate-limit');

  app.use(helmet());
  app.use(cors({
    origin: ['https://myapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute sliding window
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', limiter);
  \`\`\`

### Authentication: Dual-Token JWT Architecture
- **Access Token vs Refresh Token**:
  - **Access Token**: Short-lived (15 minutes), signed with secret key, stored in frontend memory (never \`localStorage\` due to XSS)
  - **Refresh Token**: Long-lived (7 days), stored in secure \`httpOnly\`, \`sameSite=strict\`, \`secure\` cookie
  \`\`\`javascript
  // [KEY IDEA] JWT verification middleware and token decoding:
  const jwt = require('jsonwebtoken');

  function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = user; // Attach decoded payload
      next();
    });
  }
  \`\`\`

## 7. Multithreading, Clustering & Production Scaling
### Multi-Core Scaling with the \`cluster\` Module
- **Bypassing the Single-Thread Limit**:
  - Node runs on a single CPU core by default; an 8-core server wastes 87% of capacity
  - The \`cluster\` module forks identical worker processes that share the same server TCP port via OS-level socket sharing
  \`\`\`javascript
  // [KEY IDEA] Multi-core process clustering with automatic zero-downtime worker resurrection:
  const cluster = require('cluster');
  const os = require('os');

  if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(\`Primary master process \${process.pid} is running. Forking \${numCPUs} workers...\`);
    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
      console.warn(\`Worker \${worker.process.pid} died. Forking replacement...\`);
      cluster.fork(); // Self-healing worker resilience
    });
  } else {
    // Worker processes run the Express HTTP server
    const app = require('./app');
    app.listen(3000, () => console.log(\`Worker \${process.pid} listening on port 3000\`));
  }
  \`\`\`

### Worker Threads for CPU-Bound Computation
- **When to Use Worker Threads (\`worker_threads\`)**:
  - Node's event loop must NEVER be blocked with heavy CPU calculations (e.g. generating hashes, complex JSON serialization, matrix operations)
  - Worker threads share the same process memory space and communicate via message channels without process fork overhead
  \`\`\`javascript
  // [KEY IDEA] Worker Thread offloading CPU-intensive calculation away from Event Loop:
  const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

  if (isMainThread) {
    function runWorkerTask(data) {
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData: data });
        worker.on('message', resolve);
        worker.on('error', reject);
      });
    }
    // Main thread routes request to worker thread
  } else {
    // Background worker thread execution
    let sum = 0;
    for (let i = 0; i < workerData.iterations; i++) sum += i;
    parentPort.postMessage(sum); // Send calculated result back to main event loop
  }
  \`\`\`

### Graceful Shutdown Architecture
- **Production Container Lifecycle (\`SIGTERM\` / \`SIGINT\`)**:
  - In Kubernetes or Docker, rolling updates send \`SIGTERM\` to request containers shut down
  - Immediately killing the process aborts database transactions and drops active customer HTTP requests
  \`\`\`javascript
  // [KEY IDEA] Graceful shutdown pattern: drain in-flight requests and close DB pools before exit:
  function setupGracefulShutdown(server, dbPool) {
    const shutdown = async (signal) => {
      console.log(\`Received \${signal}. Starting graceful termination...\`);
      server.close(async () => {
        console.log('HTTP server closed. In-flight requests completed.');
        try {
          await dbPool.end(); // Disconnect database connection pool
          console.log('Database pools terminated. Exiting cleanly.');
          process.exit(0);
        } catch (err) {
          console.error('Error closing database pool:', err);
          process.exit(1);
        }
      });

      // Force kill if graceful cleanup hangs longer than 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown timeout reached. Terminating forcefully.');
        process.exit(1);
      }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
  \`\`\`
`;
