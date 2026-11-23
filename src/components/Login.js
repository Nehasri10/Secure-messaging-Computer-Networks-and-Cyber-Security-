import React, { useState } from 'react';
import { Shield, Terminal, Network, Key, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = (nameToUse) => {
    const finalName = nameToUse || username;
    if (finalName.trim()) {
      onLogin(finalName.trim());
    }
  };

  const demoAccounts = [
    { name: 'Alice', role: 'Security Analyst', ip: '192.168.1.101', icon: 'A' },
    { name: 'Bob', role: 'Network Engineer', ip: '192.168.1.102', icon: 'B' },
    { name: 'Charlie', role: 'DevOps Lead', ip: '192.168.1.103', icon: 'C' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-xl">
        {/* Terminal Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
          {/* Logo / Badge */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-cyan-400 mb-2 font-semibold">
                <Network className="w-3.5 h-3.5" />
                <span>Computer Networks (CN) & Cryptography Suite</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">SecureChat E2EE</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Zero-Trust End-to-End Encrypted Messaging Gateway with Real-Time Wireshark & OSI Packet Dissection.
              </p>
            </div>
          </div>

          {/* Direct Input */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Enter Client Identifier (Username)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="e.g. Alice, Bob, Administrator..."
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono transition-all"
              />
              <button
                onClick={() => handleLogin()}
                disabled={!username.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              >
                <span>Connect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Demo Personas */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              1-Click Fast Authentication (Pre-configured Keys):
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.name}
                  onClick={() => handleLogin(acc.name)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/60 hover:bg-cyan-950/20 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200 text-xs group-hover:text-cyan-300">
                      {acc.name}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{acc.role}</div>
                  <div className="text-[9px] text-cyan-400/80 mt-1 font-mono">{acc.ip}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cryptographic Badges Footer */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>AES-256-GCM Authenticated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>2048-bit RSA / ECDH Key Exchange</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wireshark & OSI Packet Dissector</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Active MITM Tamper Defense</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
