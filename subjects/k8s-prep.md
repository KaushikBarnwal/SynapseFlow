---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 360
---

# ☸️ Kubernetes (K8s) Production Architecture & Interview Mastery

## 1. Core Philosophy & Orchestration Foundations
### Why Kubernetes? (The Problems It Solves)
- **Single-Host vs Multi-Host Orchestration**:
  - Docker handles single-host container lifecycles; K8s orchestrates fleets of compute nodes across data centers
  - Automatically handles bin-packing, self-healing, rolling updates, and dynamic service discovery
- **Declarative vs Imperative Management**:
  - **Imperative**: Executing sequential actions ("run container, expose port 80, create route")
  - **Declarative (The K8s Way)**: Define the *Desired State* in YAML specs; K8s drives Current State → Desired State
- **Continuous Reconciliation Loop**:
  - Asynchronous control loops constantly execute: `Observe Current State` → `Diff against Desired State` → `Act to Reconcile`
### Cluster Topology & Physical Roles
- **Control Plane (Master Nodes)**: The brain making global decisions, managing etcd state, and scheduling workloads
- **Worker Nodes**: Physical or virtual compute machines running container workloads via container runtime

## 2. Control Plane Deep-Dive (Top Systems Interview Topic)
### kube-apiserver (The Central Gateway)
- **Central Communications Hub**: Only component that communicates directly with `etcd`; exposes RESTful API for `kubectl` & internal agents
- **Request Processing Pipeline**:
  - `Authentication`: Validates client identity (mTLS X.509 certs, Bearer tokens, OIDC)
  - `Authorization (RBAC)`: Evaluates permissions against Roles and ClusterRoles
  - `Admission Controllers`:
    - `Mutating Admission`: Modifies object specs before persistence (e.g. injects Istio sidecar proxy)
    - `Validating Admission`: Enforces governance rules (e.g. rejects images using `:latest` tag)
- **Stateless & Scalable**: Runs multiple replicas behind an external Layer 4/Layer 7 Load Balancer
### etcd (Distributed Key-Value Store)
- **Single Source of Truth**: Highly-available, consistent key-value store holding complete cluster state and metadata
- **Raft Consensus Protocol**:
  - Enforces strict consistency (CP system under CAP theorem)
  - Requires an odd quorum `(N/2 + 1)`: 3-node cluster survives 1 failure; 5-node cluster survives 2 failures
- **Production Guardrails**:
  - Always backup etcd snapshots before upgrades (`etcdctl snapshot save`)
  - Running on dedicated NVMe SSDs is required to avoid disk fsync latency bottlenecks
### kube-scheduler (Workload Placement Engine)
- **Role**: Watches for unassigned Pods (`spec.nodeName == ""`) and selects optimal worker node
- **Two-Phase Placement Algorithm**:
  - **Phase 1: Filtering (Predicates)**:
    - Filters out ineligible nodes: checks CPU/RAM capacity, port conflicts, volume zone matching, and node taints
  - **Phase 2: Scoring (Priorities)**:
    - Ranks surviving nodes: balances resource utilization (`LeastAllocated`), spreads replicas across racks/zones
### kube-controller-manager & Cloud Controller
- **kube-controller-manager**:
  - Bundles core asynchronous reconciliation controllers in a single daemon binary
  - `NodeController`: Evicts pods if node heartbeats cease (>40s unreachable)
  - `ReplicaSetController`: Spawns or terminates pods to match target replica count
  - `EndpointsController`: Updates Endpointslices linking Services to healthy Pod IPs
- **cloud-controller-manager**: Decouples cloud-provider logic (AWS ELB, GCP Persistent Disks, Azure Routes) from core K8s code

## 3. Worker Node Architecture & Runtimes
### kubelet (Node Agent)
- **Node Workhorse**: Primary agent running on every worker node; communicates directly with `kube-apiserver`
- **PodSpec Execution**:
  - Ingests PodSpecs, instructs container runtime to pull images and start containers, mounts volumes, configures probes
  - Reports local node and container health metrics back to control plane
- **Container Runtime Interface (CRI)**:
  - Standardized gRPC interface allowing K8s to use any OCI container runtime (`containerd`, `CRI-O`) without recompilation
### kube-proxy (Cluster Network Router)
- **Role**: Maintains host network packet-filtering rules to route Service virtual IPs to backend Pods
- **Proxy Modes Comparison**:
  - **iptables mode**: Default mode; sequential list of firewall rules (performance degrades at >5,000 services)
  - **IPVS mode (IP Virtual Server)**: Uses kernel hash tables; `O(1)` routing speed and advanced load balancing algorithms
### Pod Anatomy & Multi-Container Patterns
- **Pod**: Smallest atomic schedulable execution unit in Kubernetes
- **Shared Pod Resources**:
  - Containers inside a Pod share identical Network namespace (same IP, same port space, talk via `localhost`)
  - Containers share IPC namespace and local mounted Storage Volumes
- **Classic Multi-Container Design Patterns**:
  - **Sidecar Pattern**: Augments main container (e.g. Envoy proxy, log shipping with Fluentbit)
  - **Adapter Pattern**: Standardizes output from heterogeneous apps (e.g. converts custom metrics to Prometheus format)
  - **Ambassador Pattern**: Proxies network traffic from app to external systems (e.g. local DB connection pooling)

## 4. Workload Controllers & Deployment Strategies
### Stateless vs Stateful Controllers
- **Deployment (Stateless Workloads)**:
  - Manages underlying ReplicaSets; ideal for web apps, REST APIs, and microservices
  - Pods are ephemeral, interchangeable, and receive random hash-based names (`web-7d4c89-abc12`)
- **StatefulSet (Stateful Workloads - Databases & Queues)**:
  - Designed for PostgreSQL, Cassandra, Kafka, ZooKeeper, Elasticsearch
  - **Stable Network Identity**: Sequential, persistent names (`kafka-0`, `kafka-1`, `kafka-2`)
  - **Dedicated Persistent Storage**: Uses `volumeClaimTemplates` to provision unique dedicated PV per pod
  - **Ordered Execution**: Starts from index 0 upward; shuts down in reverse order
- **DaemonSet**:
  - Ensures a single copy of Pod runs on every eligible node in the cluster
  - Use cases: Node monitoring (`prometheus-node-exporter`), log collectors (`fluentd`), network CNI daemons (`calico-node`)
- **Jobs & CronJobs**:
  - Batch workloads executing to completion (`restartPolicy: OnFailure` or `Never`)
  - Use cases: DB schema migrations, automated backups, night-time batch ETL pipelines
### Deployment Rollout Strategies
- **RollingUpdate (Default Zero-Downtime)**:
  - Gradually replaces old pods with new pods
  - `maxSurge`: Max pods created above desired count (e.g. `25%`)
  - `maxUnavailable`: Max pods unavailable during update (e.g. `0%` for strict zero-downtime)
- **Recreate (Instant Swap with Downtime)**:
  - Terminates all old pods before creating new pods; required when two versions cannot access DB simultaneously
- **Rollback Command**: `kubectl rollout undo deployment/<name>`

## 5. Kubernetes Networking & Service Discovery
### The Fundamental K8s Networking Model
- **Core Principles**:
  - Every Pod receives a unique, routable cluster IP address
  - Any Pod can communicate with any other Pod on any node without Network Address Translation (NAT)
  - Node agents (`kubelet`) can communicate with all local Pods
- **Container Network Interface (CNI)**:
  - Software overlay networks implementing the IP-per-pod model (Calico, Flannel, Cilium eBPF, AWS VPC CNI)
### Service Types & East-West Traffic
- **Service**: Stable virtual IP (VIP) and DNS name load-balancing traffic across dynamically shifting Pod IPs
- **ClusterIP (Default)**: Exposes service on internal cluster IP; reachable only inside the cluster
- **NodePort**: Allocates static port (30000–32767) on all worker node IPs; forwards external traffic to ClusterIP
- **LoadBalancer**: Triggers cloud controller to provision an external cloud load balancer (AWS NLB, GCP LB)
- **ExternalName**: Maps service to external external DNS CNAME without proxying (e.g. `database.external.com`)
### North-South Traffic: Ingress & Gateway API
- **Ingress Controller**: Layer 7 HTTP/HTTPS reverse proxy providing path-based routing (`/api`), host routing, and TLS termination
- **Gateway API**: Next-generation K8s standard providing expressive, role-oriented, and decoupled routing infrastructure
### CoreDNS & Internal Service Discovery
- Built-in cluster DNS engine resolving service names into virtual ClusterIPs
- **FQDN Format**: `<service-name>.<namespace>.svc.cluster.local` (resolves as `<service-name>` within same namespace)

## 6. Storage Architecture & Persistent Volumes
### Storage Abstraction Lifecycle
- **PersistentVolume (PV)**: Cluster-level storage resource provisioned by administrator or dynamic cloud provisioner (EBS, Ceph, NFS)
- **PersistentVolumeClaim (PVC)**: User's request for storage specifying size (e.g. `50Gi`) and access mode; binds 1:1 to a matching PV
- **StorageClass**: Enables **Dynamic Provisioning**; automatically creates PV on-demand when user submits a PVC
### Storage Access Modes
- **ReadWriteOnce (RWO)**: Volume can be mounted as read-write by a single node only (AWS EBS block storage)
- **ReadOnlyMany (ROX)**: Volume can be mounted as read-only by many nodes simultaneously
- **ReadWriteMany (RWX)**: Volume can be mounted as read-write by multiple nodes simultaneously (NFS, AWS EFS, CephFS)
### Reclaim Policies
- **Delete**: Automatically deletes underlying physical storage when PVC is deleted (default for cloud dynamic disks)
- **Retain**: Preserves underlying storage disk when PVC is deleted for manual data recovery

## 7. Configuration, Security & Governance
### Decoupling Configurations & Secrets
- **ConfigMaps**: Plaintext key-value pairs or config files mounted as environment variables, CLI args, or files in volumes
- **Secrets**: Encodes confidential data (API keys, passwords, TLS certs) in base64 format
  - *Interview Warning*: Base64 is encoding, NOT encryption! Production requires Encryption at Rest in etcd, Vault, or SealedSecrets
### Role-Based Access Control (RBAC)
- **Role & RoleBinding**: Grants API permissions scoped to a specific Namespace (e.g. read pods in `production`)
- **ClusterRole & ClusterRoleBinding**: Grants permissions across the entire cluster (nodes, persistent volumes, namespaces)
- **ServiceAccount**: Identity assigned to Pods to authenticate against `kube-apiserver`
### NetworkPolicies & Pod Security
- **NetworkPolicy**: Distributed firewall rules enforced by CNI controlling ingress and egress network traffic at Pod and port levels
- **Pod Security Admission (PSA)**: Replaces legacy PSPs; enforces `Privileged`, `Baseline`, or `Restricted` security profiles

## 8. Reliability, Scaling & Production Forensics
### Healthchecks: The 3 Probes (Top Interview Trap)
- **Startup Probe**: Disables liveness and readiness probes until slow-starting applications boot up completely
- **Liveness Probe**: Tests if application is alive; failure causes `kubelet` to kill and restart container process
- **Readiness Probe**: Tests if application is ready to accept user traffic; failure removes Pod IP from Service Endpoints
### Autoscaling Ecosystem
- **HPA (Horizontal Pod Autoscaler)**: Scales replica count up/down based on CPU, memory, or custom Prometheus metrics
- **VPA (Vertical Pod Autoscaler)**: Automatically adjusts CPU/RAM resource requests and limits on pods
- **Cluster Autoscaler / Karpenter**: Provisions or terminates physical/virtual cloud nodes when pods are unschedulable
### Advanced Scheduling & Node Affinity
- **Resource Requests vs Limits**:
  - `requests`: Guaranteed baseline used by scheduler to place pods on nodes
  - `limits`: Hard ceiling enforced by Linux Cgroups; exceeding memory results in **OOMKilled**
- **Node Affinity**: Guides scheduler to pick nodes matching labels (`nodeAffinity: requiredDuringSchedulingIgnoredDuringExecution`)
- **Taints & Tolerations**: Nodes apply taints to repel pods; pods must declare matching tolerations to be scheduled
### Production Forensics & Troubleshooting
- **`CrashLoopBackOff`**: Application process crashes immediately after starting (check `kubectl logs <pod> --previous`)
- **`OOMKilled` (Exit Code 137)**: Container exceeded memory limit ceiling (inspect with `kubectl describe pod <pod>`)
- **`ImagePullBackOff`**: Wrong image tag, registry domain typo, or missing `imagePullSecrets` credentials
- **Essential Forensics Commands**:
  - `kubectl describe pod <pod>`: Inspects recent events, probe failures, and mount errors
  - `kubectl get events -A --sort-by='.metadata.creationTimestamp'`: Global cluster incident chronological log
