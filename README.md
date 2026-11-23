# SecureChat — End-to-End Encrypted (E2EE) Messaging Gateway with Real-Time Wireshark & OSI Packet Dissector

> A Computer Networks (CN) & Cybersecurity major project demonstrating client-side authenticated encryption, ephemeral key exchange, active Man-in-the-Middle (MITM) tamper defense, and real-time OSI 7-Layer packet analysis.

---

## 1. Project Overview

**SecureChat** is an enterprise-grade End-to-End Encrypted (E2EE) messaging simulator designed to demonstrate how confidential communications traverse untrusted networks (the Internet, public Wi-Fi, and ISP routers).

Unlike conventional messaging apps that treat cryptography as an invisible black box, SecureChat provides an integrated **Wireshark-style Packet Dissector** that exposes:
- The exact **OSI 7-Layer transformations** (Application Layer $\rightarrow$ Presentation/TLS $\rightarrow$ Transport/TCP $\rightarrow$ Network/IP).
- What an eavesdropper sees in transit (only unreadable Hexadecimal / Base64 ciphertext, Nonce, and Auth Tag).
- Live **Man-in-the-Middle (MITM) Bit-Flipping Attacks** and how modern Galois/Counter Mode (GCM) integrity checks immediately detect and block tampered packets.

---

## 2. Core Features

### 🔐 1. Multi-Algorithm Cryptographic Suite
Users can switch between cryptographic ciphers to evaluate and compare performance, security, and integrity:
* **AES-256-GCM (Default / Military Grade)**: Authenticated Encryption with Associated Data (AEAD) using 256-bit keys, 96-bit random Nonces/IVs, and 128-bit GHASH authentication tags.
* **ChaCha20-Poly1305 (Modern Stream Cipher)**: High-speed mobile-optimized stream cipher with Poly1305 MAC authenticator.
* **Triple-DES / 3DES (Legacy 168-bit Block Cipher)**: Classical block cipher demonstrating why unauthenticated ciphers are vulnerable to bit-flipping attacks.
* **Caesar Substitution Cipher (Classical / Educational)**: For demonstrating classical cryptography and frequency analysis.

### 🌐 2. Built-in Wireshark & OSI Packet Dissector
An expandable terminal docked at the bottom of the screen displays real-time network telemetry:
* **Layer 7 (Application)**: Client payload and WebSocket/HTTP envelope.
* **Layer 6 (Presentation - E2EE)**: Cryptographic algorithm, IV, Ciphertext, and Auth Tag.
* **Layer 4 (Transport)**: Simulated TCP socket frame (Source Port, Destination Port 443, Seq #, Ack #, TCP Flags `[ACK, PSH]`).
* **Layer 3 (Network)**: IPv4 packet details (Source IP, Destination IP, TTL 64, Header Checksum).
* **Wire (Eavesdropper) View**: Exact simulated capture showing what an ISP, hacker, or packet sniffer intercepts on the wire.
* **Raw Hex Dump**: 16-byte aligned hexadecimal offset and ASCII representation.

### ⚔️ 3. Active Man-in-the-Middle (MITM) Tamper Simulation
* A one-click toggle switch activates **Eve / Mallory**, an active network adversary sitting on the wire.
* When enabled, Eve flips cryptographic bits in the ciphertext during transit.
* When the packet reaches the receiver, the AES-256-GCM / Poly1305 MAC authentication verification **FAILS**.
* The application rejects the payload with a stark cybersecurity alert:  
  `⚠️ SECURITY ALERT: Cryptographic Integrity Verification Failed (MAC Mismatch)! Decryption halted.`

### 👥 4. 1-Click Multi-Persona Simulator
* Test multi-user conversations without needing two separate machines or browsers.
* Pre-seeded with realistic nodes:
  * **Alice (Security Analyst)** — `192.168.1.101`
  * **Bob (Network Engineer)** — `192.168.1.102`
  * **Charlie (DevOps Lead)** — `192.168.1.103`
  * **Mallory / Eve (MITM Adversary)** — `10.13.37.99`
* Switch perspectives between Alice and Bob with one click to observe real-time message reception and decryption.

### 🔑 5. Cryptographic Keyring & Certificate Console
* Inspect each user's **2048-bit RSA / ECDH Public Key** in standard PEM format.
* View the **SHA-256 Key Fingerprint** (`SHA256: XX:XX:XX:...`).
* Simulate on-demand **Key Rotation** and ephemeral session re-negotiation.

---

## 3. Network Architecture & Cryptographic Flow

```
+-------------------------------------------------------------------------------+
|                             CLIENT NODE A (Alice)                             |
|  1. Plaintext: "Transfer $50,000 to Account #9482"                            |
|  2. Generate 96-bit Random Nonce / IV                                         |
|  3. AES-256-GCM Encrypt(Key, IV, Plaintext) -> Ciphertext + 128-bit Auth Tag   |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                       UNTRUSTED NETWORK (Wire / Transit)                      |
|  Frame: [IPv4 Header] [TCP Header] [IV] [CIPHERTEXT] [AUTH TAG]               |
|                                                                               |
|  * If Eavesdropped: Attacker sees only randomized hex / base64 bytes          |
|  * If MITM Tampered: Adversary alters ciphertext bits                         |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                             CLIENT NODE B (Bob)                               |
|  1. Intercepts incoming network frame                                         |
|  2. Computes Expected Auth Tag = GHASH(Key, IV, Ciphertext)                   |
|  3. IF Calculated Tag != Received Tag:                                        |
|     --> RAISE ALERT: TAMPERED IN TRANSIT! Decryption Aborted.                 |
|  4. ELSE:                                                                     |
|     --> Plaintext Restored: "Transfer $50,000 to Account #9482"               |
+-------------------------------------------------------------------------------+
```

---

## 4. Technology Stack

* **Frontend Framework**: React 18 / React 19
* **Styling**: Tailwind CSS with custom dark cybersecurity theme (`#020617`, cyan glow, neon badges)
* **Icons**: Lucide React
* **Cryptography**: Web Crypto API (`window.crypto.subtle`) + Deterministic authenticated AES-256-GCM / GHASH / Poly1305 simulation
* **Architecture**: Component-based React architecture with decoupled cryptographic utilities

---

## 5. How to Run Locally

### Prerequisites
* Node.js (version 18+ recommended)
* npm (Node Package Manager)

### Quick Start
```bash
# 1. Navigate to the project directory
cd secure-messaging

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server
npm start
```

Open your browser at `http://localhost:3000` to interact with SecureChat.

---

## 6. Project Structure

```
secure-messaging/
├── public/
│   ├── index.html            # Dark cybersecurity HTML5 shell & fonts
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ChatSidebar.js    # Contact list, algorithm switcher, user perspective switcher, MITM toggle
│   │   ├── ChatWindow.js     # E2EE message stream, tamper alert banners, expandable ciphertext inspection
│   │   ├── KeyModal.js       # Public/Private Keyring, SHA-256 fingerprint, key rotation
│   │   ├── Login.js          # Fast demo authentication & network node connector
│   │   ├── MessageInput.js   # Message composer with cipher badge
│   │   └── NetworkInspector.js # Real-time Wireshark & OSI 7-Layer packet dissector
│   ├── utils/
│   │   ├── crypto.js         # AES-256-GCM, ChaCha20, 3DES, Caesar, and OSI frame generator
│   │   └── encryption.js     # Unified re-export and legacy compatibility
│   ├── App.js                # Core state coordinator & simulated network bus
│   ├── index.css             # Tailwind base & custom sleek scrollbars
│   └── index.js              # React application entrypoint
├── tailwind.config.js        # Configured Tailwind CSS with custom cyber palette
├── postcss.config.js         # PostCSS pipeline for Tailwind processing
├── package.json              # Project dependencies and npm scripts
└── README.md                 # Project documentation
```

---

## 7. Viva / Interview Questions & Answers (Computer Networks)

### Q1: What is the difference between Symmetric and Asymmetric Encryption in this project?
> **Answer:**  
> * **Asymmetric Encryption (RSA / ECDH):** Used during the initial handshake to authenticate nodes and exchange a shared secret without transmitting the secret over the wire.
> * **Symmetric Encryption (AES-256-GCM):** Once the shared secret is established, bulk message data is encrypted using symmetric AES because it is computationally faster and supports hardware acceleration (AES-NI).

### Q2: What is an Initialization Vector (IV) or Nonce, and why is it needed?
> **Answer:**  
> A Nonce (Number used Once) or IV ensures that encrypting the exact same plaintext message twice produces completely different ciphertexts. In AES-GCM, a fresh 96-bit random IV is generated for every single message to prevent replay attacks and pattern frequency analysis.

### Q3: Why is AES-256-GCM superior to older modes like AES-CBC or 3DES?
> **Answer:**  
> AES-CBC only provides **Confidentiality**, meaning an attacker could tamper with ciphertext bits in transit without being detected (Bit-Flipping attack). AES-GCM is an **Authenticated Encryption with Associated Data (AEAD)** cipher: it produces an **Authentication Tag (MAC)** alongside the ciphertext. If any byte is altered in transit, the tag verification fails and decryption is rejected immediately.

### Q4: How does SecureChat simulate a Man-in-the-Middle (MITM) attack?
> **Answer:**  
> SecureChat includes an adversary toggle representing an eavesdropper (Eve). When active, the packet's ciphertext is altered while in transit. When the receiving node recomputes the GHASH/Poly1305 authentication tag, the mismatch triggers a security alarm, proving that message integrity was compromised.
