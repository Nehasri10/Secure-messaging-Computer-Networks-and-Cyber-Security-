import React, { useRef, useEffect, useState } from 'react';
import { User, Lock, Shield, ShieldAlert, Network, Eye, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import MessageInput from './MessageInput';

const ChatWindow = ({
  currentUser,
  selectedChat,
  messages,
  newMessage,
  setNewMessage,
  onSend,
  selectedAlgorithm,
  onInspectPacket,
  activePacketId
}) => {
  const messagesEndRef = useRef(null);
  const [expandedCiphertexts, setExpandedCiphertexts] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const getChatMessages = () => {
    const chatKey = [currentUser, selectedChat].sort().join('-');
    return messages[chatKey] || [];
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const toggleExpandCipher = (id) => {
    setExpandedCiphertexts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyCiphertext = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-6 text-center select-none font-mono">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <Network className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">Secure Node Selected</h3>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
          Select an authenticated network node from the left sidebar to establish an End-to-End Encrypted session with mutual key exchange.
        </p>
        <div className="flex items-center gap-2 text-[11px] text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <Shield className="w-3.5 h-3.5" />
          <span>Zero Knowledge • Client-Side AES-256-GCM Encryption</span>
        </div>
      </div>
    );
  }

  const chatMessages = getChatMessages();

  return (
    <div className="flex-1 flex flex-col bg-slate-950 font-mono text-xs overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-slate-950 font-bold text-sm flex items-center justify-center shrink-0">
            {selectedChat[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">{selectedChat}</h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedAlgorithm}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> E2EE Channel Active
              </span>
              <span>•</span>
              <span className="text-slate-500">Node IP: 192.168.1.{selectedChat === 'Bob' ? '102' : '103'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">ECDH P-256 Key Shared</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Handshake Notification Banner */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-center text-center max-w-xl mx-auto space-x-2 text-[11px] text-slate-400">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Diffie-Hellman Handshake Complete. Ephemeral session key established between{' '}
            <strong className="text-cyan-300">{currentUser}</strong> and{' '}
            <strong className="text-cyan-300">{selectedChat}</strong>.
          </span>
        </div>

        {chatMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No messages sent yet. Send an encrypted message below to inspect its cryptographic packet.
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.sender === currentUser;
            const isExpanded = !!expandedCiphertexts[msg.id];
            const isSelected = activePacketId === msg.packet?.packetId;
            const isTampered = msg.packet?.layer6?.tampered || msg.tampered;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Sender badge */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span className="font-semibold">{msg.sender}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble Card */}
                <div
                  onClick={() => msg.packet && onInspectPacket(msg.packet)}
                  className={`max-w-xl rounded-2xl p-4 transition-all cursor-pointer border ${
                    isSelected
                      ? 'ring-2 ring-cyan-500 border-cyan-400'
                      : 'border-slate-800 hover:border-slate-700'
                  } ${
                    isTampered
                      ? 'bg-rose-950/40 border-rose-800 text-slate-200'
                      : isMe
                      ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 text-slate-100'
                      : 'bg-slate-900 text-slate-100'
                  }`}
                >
                  {/* Tampered Warning Alert */}
                  {isTampered ? (
                    <div className="p-3 mb-3 rounded-lg bg-rose-900/60 border border-rose-700 text-rose-200 flex items-start gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wider text-rose-300">
                          Security Alert: Cryptographic Integrity Verification Failed
                        </div>
                        <p className="text-[11px] text-rose-200/90 leading-relaxed mt-1">
                          The message was intercepted and modified in-flight by a Man-in-the-Middle adversary (Eve). Authentication tag mismatch detected: payload execution aborted!
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Decrypted Plaintext */}
                  <div className="text-sm font-sans leading-relaxed mb-3 break-words">
                    {isTampered ? (
                      <span className="line-through text-rose-400 italic">
                        [BLOCKED BY MAC INTEGRITY CHECK]
                      </span>
                    ) : (
                      msg.text
                    )}
                  </div>

                  {/* Cryptographic Metadata Badge Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Lock className="w-3 h-3" />
                        <span>{msg.packet?.layer6?.algorithm || 'AES-256-GCM'}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">IV: {msg.packet?.layer6?.iv?.substr(0, 8) || 'N/A'}...</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandCipher(msg.id);
                      }}
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide Raw Cipher' : 'Inspect Ciphertext'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Expandable Ciphertext Box */}
                  {isExpanded && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 p-3 bg-black/80 rounded-xl border border-slate-800 text-[11px] space-y-2 select-text"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-bold text-cyan-400">RAW CIPHERTEXT IN TRANSIT:</span>
                        <button
                          type="button"
                          onClick={() => copyCiphertext(msg.packet?.layer6?.ciphertext, msg.id)}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy Hex'}</span>
                        </button>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800 text-emerald-400 font-mono break-all text-[10px]">
                        {msg.packet?.layer6?.ciphertext}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                        <div>
                          <span className="text-slate-500">NONCE / IV: </span>
                          <span className="text-cyan-300 font-mono">{msg.packet?.layer6?.iv}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">AUTH TAG: </span>
                          <span className={isTampered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {msg.packet?.layer6?.authTag}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Packet ID Clickable Reference */}
                {msg.packet && (
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 pr-1">
                    <span>Packet:</span>
                    <button
                      onClick={() => onInspectPacket(msg.packet)}
                      className="text-cyan-400 hover:underline font-mono"
                    >
                      {msg.packet.packetId}
                    </button>
                    <span>(Click to inspect in Wireshark view)</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSend={onSend}
        selectedAlgorithm={selectedAlgorithm}
      />
    </div>
  );
};

export default ChatWindow;
