import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import NetworkInspector from './components/NetworkInspector';
import KeyModal from './components/KeyModal';
import {
  generateUserKeys,
  encryptPayload,
  decryptPayload,
  buildNetworkPacket
} from './utils/crypto';
import { Shield, Key, Network, LogOut, Radio, Cpu } from 'lucide-react';

const INITIAL_USERS = ['Alice', 'Bob', 'Charlie', 'Mallory (Eve)'];

const App = () => {
  const [currentUser, setCurrentUser] = useState('Alice');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedChat, setSelectedChat] = useState('Bob');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('AES-256-GCM');
  const [isMitmEnabled, setIsMitmEnabled] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [activePacket, setActivePacket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState({});

  // Generate cryptographic keys for current user
  const [userKeys, setUserKeys] = useState(() => generateUserKeys('Alice'));

  useEffect(() => {
    if (currentUser) {
      setUserKeys(generateUserKeys(currentUser));
    }
  }, [currentUser]);

  // Seed sample pre-encrypted conversation between Alice and Bob on initial boot
  useEffect(() => {
    const chatKey = ['Alice', 'Bob'].sort().join('-');
    const sampleEnc1 = encryptPayload('Hey Bob, have you reviewed our new TLS 1.3 cryptographic gateway config?', 'AES-256-GCM');
    const pkt1 = buildNetworkPacket('Alice', 'Bob', sampleEnc1, false);

    const sampleEnc2 = encryptPayload('Yes Alice, verified! The 256-bit GCM cipher and ECDH P-256 key exchange are running smoothly.', 'AES-256-GCM');
    const pkt2 = buildNetworkPacket('Bob', 'Alice', sampleEnc2, false);

    setMessages({
      [chatKey]: [
        {
          id: 1,
          sender: 'Alice',
          text: 'Hey Bob, have you reviewed our new TLS 1.3 cryptographic gateway config?',
          packet: pkt1,
          timestamp: '10:41 AM'
        },
        {
          id: 2,
          sender: 'Bob',
          text: 'Yes Alice, verified! The 256-bit GCM cipher and ECDH P-256 key exchange are running smoothly.',
          packet: pkt2,
          timestamp: '10:42 AM'
        }
      ]
    });

    setActivePacket(pkt2);
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
    if (!users.includes(username)) {
      setUsers(prev => [...prev, username]);
    }
    // Auto-select opposite contact
    const other = username === 'Alice' ? 'Bob' : 'Alice';
    setSelectedChat(other);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedChat(null);
    setNewMessage('');
    setActivePacket(null);
  };

  const handleSwitchUser = (newUserName) => {
    setCurrentUser(newUserName);
    if (selectedChat === newUserName) {
      const fallback = users.find(u => u !== newUserName) || 'Bob';
      setSelectedChat(fallback);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const chatKey = [currentUser, selectedChat].sort().join('-');
    
    // 1. Client-Side Encryption
    const sessionKey = `sec_${[currentUser, selectedChat].sort().join('_')}`;
    const encryptedData = encryptPayload(newMessage, selectedAlgorithm, sessionKey);

    // 2. Package into Network OSI Frame (simulating wire transit + potential MITM tampering)
    const packet = buildNetworkPacket(currentUser, selectedChat, encryptedData, isMitmEnabled);

    // 3. Recipient Decryption Verification
    let finalDecryptedText = newMessage;
    let isTampered = false;

    try {
      finalDecryptedText = decryptPayload(packet.layer6, sessionKey);
    } catch (err) {
      console.warn('Integrity verification failed:', err.message);
      isTampered = true;
      finalDecryptedText = '[INTEGRITY_VIOLATION_PAYLOAD_TAMPERED]';
    }

    const messageObj = {
      id: Date.now(),
      sender: currentUser,
      text: isTampered ? newMessage : finalDecryptedText,
      tampered: isTampered,
      packet: packet,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), messageObj]
    }));

    setActivePacket(packet);
    setNewMessage('');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const otherUsers = users.filter(u => u !== currentUser);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono select-none antialiased">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm tracking-tight">SecureChat</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold">
                E2EE GATEWAY v2.0
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Computer Networks Lab • Authenticated Cryptographic Transport
            </div>
          </div>
        </div>

        {/* Center Status Indicators */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Node:</span>
            <span className="font-bold text-slate-200">{currentUser}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Cipher:</span>
            <span className="font-bold text-cyan-300">{selectedAlgorithm}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-all"
            title="View User Cryptographic Keys"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Keyring</span>
          </button>

          <button
            onClick={() => setIsInspectorOpen(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
              isInspectorOpen
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Toggle Wireshark / OSI Packet Dissector"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Packet Inspector</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 text-xs transition-all"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <ChatSidebar
          users={otherUsers}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          selectedAlgorithm={selectedAlgorithm}
          onSelectAlgorithm={setSelectedAlgorithm}
          isMitmEnabled={isMitmEnabled}
          onToggleMitm={() => setIsMitmEnabled(prev => !prev)}
          onOpenKeyModal={() => setIsKeyModalOpen(true)}
        />

        {/* Main Chat Conversation View */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          <ChatWindow
            currentUser={currentUser}
            selectedChat={selectedChat}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSend={handleSendMessage}
            selectedAlgorithm={selectedAlgorithm}
            onInspectPacket={(pkt) => {
              setActivePacket(pkt);
              setIsInspectorOpen(true);
            }}
            activePacketId={activePacket?.packetId}
          />

          {/* Bottom Docked Wireshark & OSI Packet Dissector */}
          <NetworkInspector
            activePacket={activePacket}
            isOpen={isInspectorOpen}
            onToggle={() => setIsInspectorOpen(prev => !prev)}
          />
        </div>
      </div>

      {/* Keyring / Certificate Modal */}
      <KeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentUser={currentUser}
        userKeys={userKeys}
        onRegenerateKeys={() => setUserKeys(generateUserKeys(currentUser))}
      />
    </div>
  );
};

export default App;
