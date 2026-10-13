// Auto-generated from subjects/docker-prep.md - 100% Offline Zero-CORS safe
window.SYNAPSE_DATA = window.SYNAPSE_DATA || {};
window.SYNAPSE_DATA['docker'] = `---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 360
---

# 🐳 Docker & Containerization Interview Mastery & Architectural Blueprint

## 1. Core Architecture & Linux Kernel Primitives (Interview Core)
### Containers vs Virtual Machines (VMs)
- **Virtual Machine (VM)**:
  - Heavyweight hardware-level virtualization via Hypervisor (Type-1 Bare Metal or Type-2 Hosted)
  - Runs full independent **Guest Operating System** with its own kernel, device drivers, and memory overhead
  - Startup time in minutes; high RAM/CPU footprint per instance
- **Container**:
  - Lightweight process-level virtualization sharing the **Host OS Kernel**
  - Isolates execution environment without guest OS overhead
  - Startup time in milliseconds; orders of magnitude higher compute density on same hardware
### Underlying Linux Kernel Primitives
- **Namespaces (Isolation - What a process can SEE)**:
  - \`PID\`: Process tree isolation (container process is PID 1 inside, regular PID on host)
  - \`NET\`: Virtual network devices, IP routes, port numbers, iptables rules
  - \`MNT\`: Independent filesystem mount points (\`chroot\` on steroids)
  - \`IPC\`: Inter-Process Communication, shared memory segments, semaphores
  - \`UTS\`: Hostname and NIS domain isolation
  - \`USER\`: Maps root inside container to an unprivileged non-root user on host
- **Control Groups / Cgroups (Limits - What a process can USE)**:
  - Resource metering and enforcement: Hard & soft ceilings for CPU, Memory, Disk I/O, Network bandwidth
  - Out-of-Memory (OOM) handling: Kills offending container processes when limits are breached
- **UnionFS / Overlay2 (Storage Layering)**:
  - Stacks multiple read-only image layers into a unified single view
  - Writable top container layer handles all dynamic changes via Copy-on-Write (CoW)
### Docker Engine Architecture & OCI Specs
- **Docker Client (CLI)**: Lightweight command-line interface communicating over REST API via Unix socket (\`/var/run/docker.sock\`)
- **Docker Daemon (\`dockerd\`)**: Persistent server managing images, containers, networks, volumes, and storage drivers
- **\`containerd\`**: High-level OCI-compliant runtime managing image pulls, storage distribution, and container execution lifecycles
- **\`runc\`**: Low-level reference implementation of OCI runtime spec; interfaces directly with Linux kernel to spawn isolated processes

## 2. Images, Layers & Dockerfile Engineering
### Image Layer Architecture
- **Immutable Read-Only Layers**:
  - Every Dockerfile instruction (\`FROM\`, \`COPY\`, \`RUN\`) generates a permanent, cached layer
  - Layers are identified and deduplicated across images via SHA-256 cryptographic hashes
- **Copy-on-Write (CoW) Strategy**:
  - Containers share image layers; when a container modifies a file, Overlay2 copies it to the writable container layer
  - Base image layers remain untouched on disk regardless of container mutations
- **Build Cache Optimization**:
  - Docker caches each layer; if an instruction is unchanged, it reuses the cache
  - Best practice: Place stable instructions (\`COPY package*.json\`) before volatile ones (\`COPY . .\`)
### Dockerfile Instructions & Senior Pitfalls
- **\`ENTRYPOINT\` vs \`CMD\` (Top Interview Trap)**:
  - \`ENTRYPOINT\`: Defines fixed command/executable that is always executed (e.g. \`["python", "server.py"]\`)
  - \`CMD\`: Provides default arguments to \`ENTRYPOINT\`; completely replaced by CLI arguments (\`docker run image <args>\`)
  - Best practice: Use \`ENTRYPOINT\` for the executable and \`CMD\` for overridable default arguments
- **\`COPY\` vs \`ADD\`**:
  - \`COPY\`: Simple, predictable; copies local files/directories into the container
  - \`ADD\`: Legacy power tool; auto-extracts tar archives and fetches URLs (risks unintended remote execution)
  - Best practice: Use \`COPY\` unless you explicitly require auto-tar extraction
- **Chained Commands & Cleanup**:
  - Combine related package operations in one \`RUN\` to avoid bloating image layers:
  - \`RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*\`
### Multi-Stage Builds & Distroless
- **Multi-Stage Builds**:
  - Separate heavy build tools (compilers, JDK, Go SDK, npm devDeps) from lean runtime environment
  - Syntax: \`FROM golang:1.22 AS builder\` → compile binary → \`FROM alpine:latest\` → \`COPY --from=builder /app/binary /app/\`
- **Distroless & Alpine Containers**:
  - Distroless images contain *only* your application binary and runtime dependencies (no package manager, shell, or coreutils)
  - Reduces image size from ~1GB to <30MB; eliminates 95%+ of Common Vulnerabilities and Exposures (CVEs)

## 3. Container CLI Lifecycle & Management
### Spawning & Running Containers
- \`docker run <image>\`: High-level command that invokes \`docker create\` then \`docker start\`
- **Essential Execution Flags**:
  - \`-d\`: Detached mode (runs container in background and prints container ID)
  - \`-it\`: Interactive mode (\`-i\` keeps stdin open, \`-t\` allocates pseudo-TTY terminal)
  - \`--name <name>\`: Assigns memorable human-readable alias instead of random generated string
  - \`--rm\`: Automatically deletes container upon process termination (prevents dead container clutter)
  - \`-p <host>:<container>\`: Maps host network port to container exposed port
  - \`-v <host_path>:<container_path>\`: Binds or mounts persistent storage
- \`docker exec -it <container> sh\`: Spawns a secondary interactive shell inside an actively running container
### Inspection & Lifecycle Control
- \`docker ps\`: Lists actively running containers; \`docker ps -a\` includes stopped/exited containers
- **\`docker stop\` vs \`docker kill\` (Graceful vs Forceful)**:
  - \`docker stop\`: Sends \`SIGTERM\`, waits grace period (default 10s) for cleanup, then sends \`SIGKILL\`
  - \`docker kill\`: Immediately sends \`SIGKILL\` (forces immediate shutdown without cleanup)
- \`docker logs -f --tail 100 <container>\`: Follows and streams live stdout/stderr application logs
- \`docker restart <container>\`: Restarts container process (adheres to container restart policy)
### Garbage Collection & Cleanup
- \`docker rm -f <container>\`: Deletes stopped container (or forces removal of running container)
- \`docker rmi <image>\`: Removes local Docker image if not referenced by existing containers
- \`docker system prune -a --volumes\`: Comprehensive cleanup deleting all stopped containers, unused networks, dangling images, and build cache

## 4. Storage & Data Persistence Architecture
### Ephemeral Filesystem vs Persistent Storage
- **Container Ephemeral Layer**:
  - Read-write layer tied to container lifecycle; all data is lost when container is removed
  - Poor I/O performance compared to native disk due to UnionFS copy-on-write abstraction
### The 3 Mount Types (Core Systems Comparison)
- **Volumes (\`/var/lib/docker/volumes/\`) (Recommended for Production)**:
  - Completely managed by Docker Engine; decoupled from host machine filesystem structure
  - High performance; supports volume drivers for cloud block storage (AWS EBS, NFS)
  - Safest for stateful workloads (PostgreSQL, MySQL, MongoDB, Redis)
- **Bind Mounts (\`host_path:container_path\`) (Recommended for Development)**:
  - Directly exposes a specific host directory or file to the container
  - Dependent on host directory structure and OS file permissions
  - Best for live hot-reloading code during local development
- **\`tmpfs\` Mounts (In-Memory)**:
  - Stored strictly in host system RAM; never persisted to disk or container writable layer
  - Best for ultra-sensitive credentials, tokens, or temporary high-speed scratchpads
### Volume CLI Recipes
- \`docker volume create <name>\`: Manually provisions a named volume
- \`docker volume ls\`: Lists all existing Docker volumes on host
- \`docker volume inspect <name>\`: Inspects physical host mountpoint and volume drivers
- **Mount Syntax**:
  - Legacy shorthand: \`-v my_vol:/var/lib/postgresql/data\`
  - Explicit modern syntax: \`--mount type=volume,source=my_vol,target=/var/lib/postgresql/data\`

## 5. Networking Architecture & Communication
### Docker Network Drivers
- **Bridge (Default Driver)**:
  - Creates a private internal virtual bridge interface (\`docker0\`, \`172.17.0.0/16\`) on host
  - Containers connected to the same bridge get unique internal IPs and can communicate
- **Host**:
  - Disables container network namespace isolation; container shares host network stack directly
  - Zero NAT/iptables overhead; maximum performance (cannot run multiple containers on same port)
- **None**:
  - Completely isolates container network; allocates only loopback (\`127.0.0.1\`) interface
  - Best for offline computation, air-gapped workloads, and batch jobs
- **Overlay**:
  - Distributed multi-host networking across a cluster of Docker hosts (Docker Swarm / Kubernetes)
  - Uses VXLAN tunneling encapsulation to seamlessly link containers across different physical servers
- **Macvlan**:
  - Assigns a physical MAC address to container, making it appear as a physical hardware device on LAN
### Port Publishing vs Exposure
- \`EXPOSE <port>\` in Dockerfile:
  - Pure documentation/metadata specifying which ports the application listens on
  - Does **NOT** publish or route ports to the host machine
- \`-p <host_port>:<container_port>\` at Runtime:
  - Actively configures host \`iptables\` NAT rules to forward traffic from host NIC to container port
### Inter-Container DNS Resolution
- **Default Bridge Network Limitation**:
  - Containers on default \`bridge\` can only communicate via raw IP addresses, NOT container names
- **Custom User-Defined Bridge (\`docker network create app-net\`)**:
  - Features Docker's embedded automatic DNS server (\`127.0.0.11\`)
  - Containers resolve each other by container name (e.g. \`curl http://backend:8080/api\`)

## 6. Multi-Container Orchestration (Docker Compose)
### Compose Architecture & Declarative Specs
- **\`docker-compose.yml\`**: Declarative YAML configuration file defining multi-container environments
- **Top-Level Directives**:
  - \`services\`: Defines container components (web app, background worker, database, cache)
  - \`networks\`: Defines custom virtual networks for isolated inter-service communication
  - \`volumes\`: Defines persistent named volumes shared across services
### Key Compose Directives & Gotchas
- **\`depends_on\` vs \`healthcheck\`**:
  - \`depends_on\`: Only checks that dependency container has *started*, NOT that its service is ready!
  - Fix: Pair \`depends_on\` with \`condition: service_healthy\` to wait for DB connection readiness
- **Environment Management**:
  - \`environment\`: Inlines environment variables directly in YAML
  - \`env_file\`: Ingests variables from an external \`.env\` file (keeps secrets out of git)
- **Restart Policies**:
  - \`always\`: Restarts regardless of exit code or daemon reboot
  - \`on-failure\`: Restarts only if container exits with non-zero status
  - \`unless-stopped\`: Restarts automatically unless explicitly stopped by administrator
### Compose CLI Commands
- \`docker compose up -d --build\`: Builds missing images, provisions networks, and starts stack in background
- \`docker compose down -v\`: Stops services, tears down network, and \`-v\` removes associated named volumes
- \`docker compose ps\`: Displays runtime status of services in the active Compose stack
- \`docker compose logs -f <service>\`: Streams aggregated log output from specific service

## 7. Production Hardening, Security & Forensics
### Security & Principle of Least Privilege
- **Root Inside Container Risk**:
  - By default, root inside container has UID 0 on host; kernel vulnerabilities can lead to host container escape
  - Solution: Always create and switch to unprivileged user: \`RUN useradd -u 1001 appuser && USER appuser\`
- **Read-Only Root Filesystem**:
  - Running with \`--read-only\` flag locks the container filesystem against rogue runtime tampering
- **Dropping Linux Capabilities**:
  - Drop all default capabilities and re-add strictly required ones:
  - \`--cap-drop=ALL --cap-add=NET_BIND_SERVICE\`
### Resource Quotas & OOM Handling
- **Memory Ceiling**:
  - \`--memory="512m"\`: Enforces strict RAM ceiling via Cgroups
  - Exit Code **137**: Process was terminated by kernel Out-Of-Memory Killer (\`OOMKilled: true\`)
- **CPU Quota**:
  - \`--cpus="1.5"\`: Restricts container to 1.5 CPU cores using Linux CFS (Completely Fair Scheduler)
### Diagnostics & Forensic Commands
- \`docker stats\`: Real-time streaming dashboard of CPU%, Memory usage, Net I/O, and PIDs across all containers
- \`docker inspect <id>\`: Complete JSON configuration dump (IP address, mounts, environment, health checks)
- \`docker top <container>\`: Displays active host processes running inside the container namespace
- \`docker diff <container>\`: Lists all files added (\`A\`), changed (\`C\`), or deleted (\`D\`) in the writable container layer
`;
