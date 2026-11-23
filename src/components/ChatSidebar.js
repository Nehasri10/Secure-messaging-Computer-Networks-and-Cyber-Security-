import React from 'react';
import { Users, Lock, ShieldAlert, Cpu, Key, ArrowRightLeft, Radio } from 'lucide-react';

const ChatSidebar = ({
  users,
  selectedChat,
  onSelectChat,
  currentUser,
  onSwitchUser,
  selectedAlgorithm,
  onSelectAlgorithm,
  isMitmEnabled,
  onToggleMitm,
  onOpenKeyModal
}) => {
  const algorithms = [
    { id: 'AES-256-GCM', name: 'AES-256-GCM (Recommended)', desc: '256-bit Authenticated Cipher', badge: 'HIGH SEC' },
    { id: 'ChaCha20-Poly1305', name: 'ChaCha20-Poly1305', desc: 'High-Speed Stream Cipher', badge: 'HIGH SEC' },
    { id: 'Triple-DES', name: 'Triple-DES (Legacy)', desc: '168-bit Block Cipher', badge: 'LEGACY' },
    { id: 'Caesar', name: 'Caesar Cipher', desc: 'Shift=3 (Educational)', badge: 'UNSAFE' }
  ];

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 font-mono text-xs select-none">
      {/* Top Section: User & Algorithm */}
      <div className="flex-1 overflow-y-auto">
        {/* Current User Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Active Node
            </span>
            <button
              onClick={onOpenKeyModal}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] border border-slate-700 transition-all"
              title="View Public/Private Keyring"
            >
              <Key className="w-3 h-3" />
              <span>Keyring</span>
            </button>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold text-base flex items-center justify-center shrink-0">
              {currentUser[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-200 text-sm truncate">{currentUser}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Node Online • E2EE</span>
              </div>
            </div>
          </div>

          {/* Quick Perspective Switcher */}
          <div className="mt-3">
            <label className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">
              Simulate perspective as:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Alice', 'Bob', 'Charlie', 'Mallory (Eve)'].map((name) => {
                const isCurrent = currentUser === name;
                return (
                  <button
                    key={name}
                    onClick={() => onSwitchUser(name)}
                    className={`px-2 py-1.5 rounded text-[11px] font-mono transition-all text-left truncate flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <ArrowRightLeft className="w-3 h-3 shrink-0" />
                    <span className="truncate">{name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Algorithm Configuration */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/20">
          <label className="text-[11px] text-slate-400 block mb-2 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Cryptographic Suite
          </label>
          <div className="space-y-1.5">
            {algorithms.map((algo) => {
              const isSelected = selectedAlgorithm === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => onSelectAlgorithm(algo.id)}
                  className={`w-full p-2.5 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-cyan-200'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs truncate">{algo.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        algo.badge === 'HIGH SEC'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : algo.badge === 'LEGACY'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {algo.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">{algo.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contacts List */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Secure Contacts
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              {users.length} Nodes
            </span>
          </div>

          <div className="space-y-2">
            {users.map((user) => {
              const isSelected = selectedChat === user;
              const isAttacker = user.includes('Eve') || user.includes('Mallory');

              return (
                <button
                  key={user}
                  onClick={() => onSelectChat(user)}
                  className={`w-full p-3 rounded-xl text-left transition-all border flex items-center gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      isAttacker
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : isSelected
                        ? 'bg-cyan-600 text-slate-950'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {user[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 truncate">{user}</span>
                      <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>ECDH Verified</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: MITM Adversary Simulation Toggle */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div
          className={`p-3 rounded-xl border transition-all ${
            isMitmEnabled
              ? 'bg-rose-950/40 border-rose-800/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${isMitmEnabled ? 'text-rose-400' : 'text-slate-500'}`} />
              <span className={`font-bold text-xs ${isMitmEnabled ? 'text-rose-300' : 'text-slate-300'}`}>
                MITM Adversary Simulation
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMitmEnabled}
                onChange={onToggleMitm}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {isMitmEnabled
              ? 'ACTIVE: In-flight ciphertext bits will be flipped by Eve to simulate wire tampering and trigger MAC rejection!'
              : 'OFF: Packets travel intact with valid cryptographic authentication tags.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
