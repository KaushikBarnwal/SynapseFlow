---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
  maxWidth: 340
---

# 🌐 Computer Networking Interview Roadmap

## 1. Architectural Models
### OSI 7-Layer Model
- **L7 Application**: End-user protocols (`HTTP`, `HTTPS`, `DNS`, `SSH`, `FTP`, `SMTP`)
- **L6 Presentation**: Encryption (`TLS/SSL`), data compression, formatting (`ASCII`, `JSON`)
- **L5 Session**: Manages connections, authentication tokens, `RPC`, and checkpoints
- **L4 Transport**: End-to-end communication, port addressing (`0-65535`), `TCP`/`UDP`
- **L3 Network**: Logical addressing (`IPv4`/`IPv6`), packet routing, `ICMP`, `ARP`
- **L2 Data Link**: Physical frame delivery, `MAC` addresses, collision-free switching
- **L1 Physical**: Electrical signals, radio waves, optical pulses, cables, repeaters
### TCP/IP 4-Layer Model
- **Application Layer**: Merges OSI L5, L6, and L7
- **Transport Layer**: Matches OSI L4 (TCP / UDP)
- **Internet Layer**: Matches OSI L3 (IP, ICMP, ARP)
- **Network Access**: Merges OSI L1 and L2 (Ethernet, Wi-Fi)
### Data Encapsulation (PDUs)
- **Application**: Data
- **Transport**: Segment (TCP header with source/dest ports)
- **Network**: Packet (IP header with source/dest IP)
- **Data Link**: Frame (Ethernet header with source/dest MAC)
- **Physical**: Raw bits over wire

## 2. Transport Layer: TCP vs UDP
### TCP (Transmission Control Protocol)
- **Connection-Oriented**: Requires 3-way handshake before transmitting data
- **Reliable Delivery**: Automatic retransmission upon packet loss (`ACK` tracking)
- **Ordered Packets**: Uses sequence numbers to reassemble segments in order
- **Header Size**: 20–60 bytes (heavier overhead)
- **Use Cases**: Web (`HTTP/HTTPS`), File transfers (`FTP`, `SSH`), Email (`SMTP`)
### UDP (User Datagram Protocol)
- **Connectionless**: "Fire and forget" datagrams without handshakes
- **Unreliable / Best-Effort**: No `ACK`s, no retransmissions, no order guarantee
- **Header Size**: Fixed 8 bytes (ultra-lightweight and fast)
- **Use Cases**: Live video streaming, VoIP calls, Online multiplayer gaming, `DNS` queries
### TCP 3-Way Handshake (Connection Setup)
- **Step 1 (`SYN`)**: Client sends `SYN` with initial sequence number $ISN_c = X$
- **Step 2 (`SYN-ACK`)**: Server replies with `SYN-ACK` ($ACK = X + 1, ISN_s = Y$)
- **Step 3 (`ACK`)**: Client acknowledges ($ACK = Y + 1$); socket is now `ESTABLISHED`
### TCP 4-Way Teardown (Connection Termination)
- **Step 1 (`FIN`)**: Client sends `FIN` to close outbound transmission
- **Step 2 (`ACK`)**: Server acknowledges `FIN` (server can still finish sending pending data)
- **Step 3 (`FIN`)**: Server sends its own `FIN` when done
- **Step 4 (`ACK`)**: Client acknowledges `FIN`
- **`TIME_WAIT` State (2MSL)**: Client waits $2 \times \text{Maximum Segment Lifetime}$ to guarantee final ACK reached server and delayed duplicate packets expire
### Flow Control vs Congestion Control
- **Flow Control (End-to-End)**: Prevents sender from overwhelming receiver buffer (`rwnd` window)
- **Congestion Control (Network-Wide)**: Prevents sender from overloading intermediate routers
  - **Slow Start**: Exponential window increase ($1 \rightarrow 2 \rightarrow 4 \rightarrow 8$)
  - **Congestion Avoidance**: Additive increase (+1 per RTT) upon reaching `ssthresh`
  - **Fast Retransmit**: Retransmits packet immediately after receiving 3 duplicate ACKs

## 3. Network Layer & IP Addressing
### IPv4 vs IPv6
- **IPv4**: 32-bit address, 4 octets (`192.168.1.1`), $\approx 4.3 \text{ billion}$ total addresses
- **IPv6**: 128-bit address, 8 groups of 4 hex digits (`2001:0db8::1`), $3.4 \times 10^{38}$ addresses
### Subnetting Math (CIDR)
- **Formula for Total IPs**: $2^{(32 - \text{prefix})}$ (e.g., `/24` $\rightarrow 2^8 = 256$)
- **Formula for Usable Hosts**: $2^{(32 - \text{prefix})} - 2$ (Subtract Network ID and Broadcast IP)
- **Example `/28`**: $32 - 28 = 4 \rightarrow 2^4 = 16$ IPs $\rightarrow$ 14 usable hosts
### Private IP Ranges (RFC 1918)
- **Class A**: `10.0.0.0/8` (`10.0.0.0` – `10.255.255.255`)
- **Class B**: `172.16.0.0/12` (`172.16.0.0` – `172.31.255.255`)
- **Class C**: `192.168.0.0/16` (`192.168.0.0` – `192.168.255.255`)
- **Loopback**: `127.0.0.1` (`localhost`)
- **APIPA**: `169.254.0.0/16` (Self-assigned when DHCP fails)
### NAT & PAT (Address Translation)
- **NAT (Network Address Translation)**: Maps private internal IPs to public routable IP
- **PAT (Port Address Translation)**: Maps multiple private hosts to a single public IP using distinct source port numbers
### ARP & ICMP
- **ARP (Address Resolution Protocol)**: Resolves IP address to physical `MAC` address on local LAN
- **ICMP (Internet Control Message Protocol)**: Diagnostic error messaging used by `ping` and `traceroute` (TTL expiration)

## 4. Application Layer & Famous Protocols Master Reference
### Famous Core Protocols Quick Reference
- **DNS (Domain Name System - Port 53, UDP/TCP)**:
  - Resolves human-readable domain names into IP addresses
  - Hierarchy: Recursive Resolver $\rightarrow$ Root (`.`) $\rightarrow$ TLD (`.com`, `.org`) $\rightarrow$ Authoritative (`google.com`)
  - Key Records: `A` (IPv4), `AAAA` (IPv6), `CNAME` (canonical alias), `MX` (mail exchange), `TXT` (SPF/DKIM verification)
- **DHCP (Dynamic Host Configuration - Ports 67 Server / 68 Client, UDP)**:
  - Automatically leases IP configuration to devices joining a network
  - The **DORA** sequence: **D**iscover (broadcast) $\rightarrow$ **O**ffer $\rightarrow$ **R**equest $\rightarrow$ **A**cknowledge
- **ARP (Address Resolution Protocol - L2/L3 Bridge)**:
  - Maps 32-bit IP addresses to 48-bit physical MAC addresses on the local broadcast domain
  - Gratuitous ARP: Broadcasts to announce IP changes or detect duplicate IPs
- **ICMP (Internet Control Message Protocol - Layer 3)**:
  - Diagnostic error-reporting protocol (**Has NO port numbers!**)
  - Powers `ping` (Echo Request/Reply) and `traceroute` (TTL expiration in transit)
- **HTTP / HTTPS & TLS 1.3 (Ports 80/443, TCP)**:
  - Stateless application protocol; HTTPS wraps HTTP inside TLS 1.3 encryption (ECDHE key exchange + AES-GCM cipher)
- **FTP / SFTP / SSH (Ports 20, 21 / 22, TCP)**:
  - FTP uses two channels: Port 21 (Control/commands) and Port 20 (Data transfer)
  - SSH / SFTP: Encrypted remote terminal and file transfer on Port 22
- **SMTP / POP3 / IMAP (Email Protocols)**:
  - SMTP (Port 25 / 587): Sends email from client to server or between mail transfer agents
  - POP3 (Port 110 / 995): Downloads email and removes it from server
  - IMAP (Port 143 / 993): Synchronizes email state bi-directionally across multiple devices
- **WebSockets (Ports 80/443, TCP)**:
  - Full-duplex persistent bidirectional TCP connection upgraded from HTTP (Status `101 Switching Protocols`)
### "What Happens When You Type google.com?"
- **1. Browser Cache**: Checks browser history, OS cache, and hosts file
- **2. DNS Query**: Recursive lookup (Root $\rightarrow$ `.com` TLD $\rightarrow$ Authoritative)
- **3. ARP Lookup**: Resolves default gateway router's MAC address
- **4. TCP Handshake**: 3-way handshake (`SYN` $\rightarrow$ `SYN-ACK` $\rightarrow$ `ACK`) on port 443
- **5. TLS 1.3 Handshake**: Certificate verification, Diffie-Hellman symmetric key exchange
- **6. HTTP Request**: Sends encrypted `GET / HTTP/2` request
- **7. Server Response**: Server returns `200 OK` with HTML/CSS/JS payload
- **8. Rendering**: Browser parses DOM + CSSOM $\rightarrow$ Render Tree $\rightarrow$ Layout $\rightarrow$ Paint
### HTTP Evolution
- **HTTP/1.1**: Persistent connections, but suffers from Head-of-Line (HoL) blocking
- **HTTP/2**: Binary framing, **Multiplexing** over single TCP stream, HPACK header compression
- **HTTP/3**: Built on **QUIC over UDP**; eliminates TCP-level HoL blocking and enables 0-RTT handshakes
### Real-Time Communication
- **WebSockets**: Full-duplex persistent bidirectional TCP connection
- **Server-Sent Events (SSE)**: Unidirectional real-time stream from server to client over HTTP
- **Long Polling**: Client repeatedly requests server; server holds connection open until data is ready

## 5. Hardware & Switching
### Hub vs Switch vs Router
- **Hub (L1)**: Dumb repeater; shares 1 collision domain and 1 broadcast domain
- **Switch (L2)**: Intelligent forwarding using MAC address **CAM table**; separate collision domain per port
- **Router (L3)**: Forwards packets between different subnets using IP routing tables; separates broadcast domains
### Routing Protocols
- **Interior (Within Autonomous System)**:
  - **OSPF (Open Shortest Path First)**: Link-state protocol using Dijkstra's shortest path algorithm
  - **RIP (Routing Information Protocol)**: Distance-vector protocol using hop counts (max 15)
- **Exterior (Between Autonomous Systems)**:
  - **BGP (Border Gateway Protocol)**: Path-vector protocol powering global Internet routing

## 6. ⚠️ Tricky MCQ Traps & Edge Cases
### 🚨 Switch vs Router Layer Trap
- **Trap**: "In which layer does a network Switch operate?"
- **Correct**: **Layer 2 (Data Link)** using MAC addresses! (Routers operate at Layer 3 using IP)
### 🚨 ARP vs DNS Trap
- **Trap**: "What is ARP used for?"
- **Correct**: **ARP maps IP $\rightarrow$ MAC**. DNS maps Domain Name $\rightarrow$ IP!
### 🚨 TCP vs UDP Delivery Trap
- **Trap**: "Does UDP guarantee delivery if network latency is zero?"
- **Correct**: **NO**. UDP has zero acknowledgement or retransmission mechanisms in its protocol specification.
### 🚨 Private IP Trap
- **Trap**: "Which of these is a public routable IP? `10.5.1.1`, `172.20.1.1`, `192.168.1.1`, `8.8.8.8`"
- **Correct**: **`8.8.8.8`** (Google Public DNS). The others fall inside RFC 1918 private ranges!

## 7. 🏆 Top 5 Must-Remember Interview Tips
- **1. Remember the OSI Layers**: Please Do Not Throw Sausage Pizza Away (L1 Physical to L7 Application)
- **2. Master the TCP 3-Way Handshake**: `SYN` $\rightarrow$ `SYN-ACK` $\rightarrow$ `ACK` with sequence number math ($X+1, Y+1$)
- **3. Subnetting Rule**: Usable hosts $= 2^{(32 - \text{prefix})} - 2$. Always remember to subtract Network ID and Broadcast
- **4. Practice the URL Flow**: Be ready to explain the full journey from keystroke to DOM paint
- **5. Explain TCP TIME_WAIT**: Lasts 2MSL to prevent duplicate packet corruption in future sockets and ensure server got final ACK
