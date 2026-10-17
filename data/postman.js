// Auto-generated from subjects/postman-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['postman'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 360
---

# 🚀 Postman & API Lifecycle Architecture & Interview Mastery

## 1. HTTP Protocol Foundations & REST API Architecture
### REST Architectural Constraints (Roy Fielding Principles)
- **Statelessness**: Every request contains all context needed; server stores no client session context between requests
- **Client-Server Separation**: UI concerns are decoupled from data storage; improves scalability across platforms
- **Uniform Interface**: Standard resource URIs, self-descriptive messages, and hypermedia controls (HATEOAS)
- **Cacheability**: Responses must declare if they can be cached to prevent stale data (\`Cache-Control\`, \`ETag\`)
- **Layered System**: Client cannot tell whether it connects directly to the end server or an intermediary proxy / CDN
### HTTP Verbs: Idempotency & Safety (Top Interview Question)
- **Safe Methods (Read-Only, Zero Side Effects)**:
  - \`GET\`, \`HEAD\`, \`OPTIONS\`: Calling them never mutates the underlying server state
- **Idempotent Methods (N Identical Requests = Same Resulting State)**:
  - \`GET\`, \`PUT\`, \`DELETE\`, \`HEAD\`: Executing 1 time or 100 times leaves database in the exact same state
- **Non-Idempotent Methods**:
  - \`POST\`: Every invocation creates an additional subordinate resource or triggers side effects
- **PUT vs PATCH (Classic Senior Interview Trap)**:
  - **\`PUT\` (Complete Replacement)**: Overwrites the entire resource document (unspecified fields are nulled/reset)
  - **\`PATCH\` (Partial Modification)**: Applies a delta update (modifies only the specific fields provided in the body)
### HTTP Status Code Taxonomy
- **2xx (Success)**:
  - \`200 OK\`: Request succeeded with payload in response
  - \`201 Created\`: Resource successfully created (must return \`Location\` header pointing to new resource URI)
  - \`204 No Content\`: Action succeeded; response body is intentionally empty (common for \`DELETE\` operations)
- **3xx (Redirection)**:
  - \`301 Moved Permanently\`: Resource relocated forever (browsers cache this redirect aggressively)
  - \`304 Not Modified\`: Cached copy on client is still fresh (driven by \`If-None-Match\` and \`ETag\`)
- **4xx (Client Errors)**:
  - \`401 Unauthorized\`: Authentication missing or failed (invalid token, expired credentials)
  - \`403 Forbidden\`: Authenticated identity lacks permission/RBAC rights to access resource
  - \`404 Not Found\`: Target resource does not exist
  - \`422 Unprocessable Entity\`: Syntax is valid JSON, but business validation failed (e.g. negative price)
  - \`429 Too Many Requests\`: Client exceeded rate-limiting thresholds (check \`Retry-After\` header)
- **5xx (Server Errors)**:
  - \`500 Internal Server Error\`: Unhandled server-side application exception
  - \`502 Bad Gateway\`: Reverse proxy (Nginx/Cloudflare) received invalid response from upstream app server
  - \`504 Gateway Timeout\`: Upstream server failed to respond to proxy within timeout window
### API Architectural Paradigms
- **REST**: Resource-centric, standard HTTP verbs, stateless JSON/XML payloads
- **GraphQL**: Single endpoint (\`/graphql\`), client queries precise field graphs, prevents over/under-fetching
- **gRPC**: High-speed binary Protocol Buffers over HTTP/2, multiplexed bidirectional streaming, strictly typed RPCs
- **WebSockets**: Persistent full-duplex TCP socket connection for low-latency live events (chats, tickers)

## 2. Postman Workspace & Collection Architecture
### Workspace & Team Collaboration
- **Workspace Scopes**: Personal (private sandbox), Team (shared real-time collaborative workspace), and Public
- **Forking & Pull Requests**: Fork API collections, propose schema modifications, review diffs, and merge back upstream
- **Version Control & Tagging**: Maintain semantic versions (\`v1.0.0\`, \`v2.0.0\`) of collections across API releases
### Hierarchy & Inherited Settings
- **Structural Tree**: \`Workspace\` → \`Collection\` → \`Folder\` → \`Sub-folder\` → \`Request\`
- **Cascade of Inheritance**:
  - **Auth Inheritance**: Configure Bearer Token / OAuth at Collection root; child folders inherit automatically
  - **Script Chaining**: Collection Pre-request runs → Folder Pre-request runs → Request Pre-request runs
### Variable Scope & Resolution Hierarchy (Top Postman Interview Trap)
- **Precedence Order (Narrowest to Broadest)**:
  - \`Local\` → \`Data (CSV/JSON)\` → \`Environment\` → \`Collection\` → \`Global\`
- **Resolution Rule**: If variable \`{{apiUrl}}\` is defined in multiple scopes, the narrowest active scope wins!
- **Dynamic System Variables (Built-in Faker Engine)**:
  - \`{{$guid}}\`: Generates unique v4 UUID
  - \`{{$randomEmail}}\`: Generates realistic mock email
  - \`{{$isoTimestamp}}\`: Generates current ISO-8601 UTC timestamp
  - \`{{$randomInt}}\`: Generates random integer (1-1000)

## 3. Authentication & Enterprise API Security
### Authentication Schemes in Postman
- **Basic Auth**:
  - Transmits base64-encoded \`username:password\` in \`Authorization: Basic ...\` header (requires HTTPS!)
- **Bearer Tokens & JWT (JSON Web Tokens)**:
  - Anatomy: \`Header.Payload.Signature\`
  - Stateless validation: Target server verifies HMAC/RSA cryptographic signature without querying session DB
- **API Key Authentication**:
  - Supplied via Custom Header (\`X-API-Key\`) or Query Parameter (\`?api_key=...\`)
- **OAuth 2.0 Grant Flows**:
  - **Authorization Code with PKCE**: Gold standard for single-page web applications & mobile apps
  - **Client Credentials Flow**: Server-to-server machine authentication (no user context involved)
  - **Refresh Token Rotation**: Using short-lived Access Tokens (15m) + long-lived Refresh Tokens to prevent leaks
### Advanced Security & Enterprise Signing
- **AWS Signature (SigV4)**: Automatically calculates HMAC-SHA256 authorization headers using AWS Key, Secret, and Region
- **Mutual TLS (mTLS)**: Configures client certificates (\`.pem\`, \`.pfx\`) in Postman for zero-trust enterprise API gateways

## 4. Scripting Engine & Dynamic Automation
### Postman Sandbox Execution Lifecycle
- **Strict Execution Pipeline**:
  - \`Pre-request Script\` → \`Send HTTP Request\` → \`Receive Response\` → \`Tests Script\`
- **Sandbox Environment**: Sandboxed JavaScript VM running Node.js libraries (\`lodash\`, \`crypto-js\`, \`moment\`, \`ajv\`)
### Pre-Request Scripts (Payload Preparation & Crypto)
- Generating dynamic timestamps, random nonces, and HMAC request signatures before sending:
  - \`const hash = CryptoJS.HmacSHA256(payload, secret).toString();\`
  - \`pm.environment.set("signature", hash);\`
### Automated Test Assertions (Chai.js BDD Syntax)
- **Status Code Validation**:
  - \`pm.test("Status is 200", () => { pm.response.to.have.status(200); });\`
- **SLA & Latency Performance Assertion**:
  - \`pm.test("Response time < 300ms", () => { pm.expect(pm.response.responseTime).to.be.below(300); });\`
- **Header Assertions**:
  - \`pm.response.to.have.header("Content-Type", "application/json");\`
- **JSON Schema Contract Validation**:
  - Using \`ajv\` to enforce strict response JSON data contracts and prevent regression bugs
### Dynamic Token Chaining & Workflow Branching (FAANG Interview Favorite)
- **Token Chaining Pattern**:
  - Send \`/api/v1/auth/login\` → Extract JWT from response → Persist into environment:
  - \`const token = pm.response.json().data.accessToken;\`
  - \`pm.environment.set("authToken", token);\`
  - Subsequent requests automatically use \`Bearer {{authToken}}\` in their Authorization header!
- **Collection Runner Workflow Control**:
  - \`postman.setNextRequest("Fetch User Profile");\`: Skips intermediate requests conditionally
  - \`postman.setNextRequest(null);\`: Terminates collection run immediately upon failure

## 5. Mock Servers, Contract Testing & Living Docs
### Postman Mock Servers (Contract-First API Design)
- **Frontend-Backend Decoupling**: Frontend engineers develop against mock servers before backend code is written
- **Response Matching Engine**:
  - Matches incoming URL path, headers, and request body against configured collection **Examples**
  - Explicit header matching: \`x-mock-response-code: 404\` or \`x-mock-response-name: "User Not Found"\`
### Living Documentation & OpenAPI Specs
- **Automated API Documentation**: Auto-generates responsive, human-readable documentation directly from collection metadata
- **OpenAPI / Swagger 3.0 Sync**: Import or export OpenAPI specifications for two-way synchronization
### Postman Synthetic Monitoring
- Scheduled cloud test runners executing collections periodically (e.g. every 5 minutes from multiple global regions)
- Automated alerting triggers: Sends alerts to PagerDuty, Slack, or webhook endpoints upon SLA breach

## 6. Headless CI/CD Automation with Newman CLI
### Newman Architecture & CLI Execution
- **Newman**: Headless Node.js command-line runner that executes Postman collections without the graphical UI
- **Standard Execution Syntax**:
  - \`newman run my_collection.json -e staging_env.json --bail\`
  - Flag \`--bail\`: Stops pipeline execution immediately upon first failed test assertion
### Data-Driven Testing (DDT)
- Parameterize requests with external data matrices using \`-d users.csv\` or \`-d test_payloads.json\`
- Access row iteration values inside scripts via \`pm.iterationData.get("email")\`
### CI/CD Reporting & Pipeline Gateways
- **Built-in Reporters**: \`cli\`, \`json\`, \`junit\` (native test results in Jenkins, GitLab, GitHub Actions)
- **HTML Dashboard Reporter**: \`newman-reporter-htmlextra\` (generates rich interactive HTML audit reports)
- **GitHub Actions Integration**:
  - Runs Newman on every Pull Request; blocks merge if any endpoint regression or contract test fails

## 7. Production API Governance & Troubleshooting Forensics
### CORS (Cross-Origin Resource Sharing) & Preflight
- Browser security restriction preventing web apps from querying a different domain without explicit permission
- **Preflight \`OPTIONS\` Request**: Browser asks server: *“Are you willing to accept a PUT request with Authorization headers?”*
- **Essential Response Headers**:
  - \`Access-Control-Allow-Origin: *\` (or specific domain)
  - \`Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\`
  - \`Access-Control-Allow-Headers: Authorization, Content-Type\`
### Rate Limiting & Throttling Forensics
- **Algorithms**: Token Bucket, Leaky Bucket, and Fixed Window Counters
- **Standard Rate Headers**:
  - \`X-RateLimit-Limit\`: Maximum requests permitted per window
  - \`X-RateLimit-Remaining\`: Remaining request quota in current window
  - \`Retry-After\`: Seconds client must pause before retrying after HTTP \`429\`
### Content Negotiation & Payload Encodings
- **\`Content-Type\`**: Format of outgoing request body (\`application/json\`, \`application/x-www-form-urlencoded\`, \`multipart/form-data\`)
- **\`Accept\`**: Media types acceptable in the server response (\`Accept: application/json\`)
- **Compression**: \`Content-Encoding: gzip\`, \`br\` (Brotli compression for fast network transfer)
### Postman Console Debugging
- **Postman Console (\`Ctrl + Alt + C\`)**: Inspects raw network calls, SSL handshakes, and \`console.log()\` outputs
- **Disabling SSL Verification**: Managing self-signed TLS certificates in local development environments
`;
