import React, { useState } from 'react';
import { Network, ShieldAlert, Cpu, Eye, CheckCircle2, ChevronDown, ChevronUp, Layers, Terminal } from 'lucide-react';

const NetworkInspector = ({ activePacket, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('osi'); // 'osi' | 'wire' | 'hex'

  if (!isOpen) {
    return (
      <div className="border-t border-slate-800 bg-slate-950 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="font-mono font-semibold text-slate-200">Network Packet & OSI Inspector</span>
          {activePacket && (
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[11px] font-mono text-cyan-300 border border-slate-800">
              Active: {activePacket.packetId} ({activePacket.layer6?.algorithm || 'E2EE'})
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all font-mono text-xs"
        >
          <span>Expand Inspector</span>
          <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-800 bg-slate-950 flex flex-col h-72 transition-all">
      {/* Inspector Header */}
      <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold text-slate-200 text-xs">Wireshark & OSI Packet Dissector</span>
          </div>

          {activePacket && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">|</span>
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">{activePacket.packetId}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono">
                {activePacket.layer6?.algorithm}
              </span>
              {activePacket.layer6?.tampered ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 font-mono flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> TAMPERED IN TRANSIT
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> MAC VERIFIED
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('osi')}
              className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'osi' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" /> OSI 7-Layer View
            </button>
            <button
              onClick={() => setActiveTab('wire')}
              className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'wire' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" /> Wire (Eavesdropper) View
            </button>
            <button
              onClick={() => setActiveTab('hex')}
              className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'hex' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3 h-3" /> Hex Dump
            </button>
          </div>

          <button
            onClick={onToggle}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300">
        {!activePacket ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            Select or send a message to inspect its cryptographic transmission packet.
          </div>
        ) : activeTab === 'osi' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Layer 7 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" /> Layer 7: Application
              </div>
              <div className="text-slate-400 text-[11px]">Protocol: <span className="text-slate-200">{activePacket.layer7?.protocol}</span></div>
              <div className="text-slate-400 text-[11px]">Encoding: <span className="text-slate-200">{activePacket.layer7?.encoding}</span></div>
              <div className="text-slate-400 text-[11px]">Payload: <span className="text-emerald-400 font-semibold">Decrypted on Endpoints</span></div>
            </div>

            {/* Layer 6 */}
            <div className={`p-3 rounded-lg border space-y-1.5 ${activePacket.layer6?.tampered ? 'bg-rose-950/30 border-rose-800/80' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Layer 6: Presentation (E2EE)
              </div>
              <div className="text-slate-400 text-[11px]">Cipher: <span className="text-cyan-300 font-semibold">{activePacket.layer6?.algorithm}</span></div>
              <div className="text-slate-400 text-[11px] truncate" title={activePacket.layer6?.iv}>
                IV / Nonce: <span className="text-slate-300">{activePacket.layer6?.iv || 'None'}</span>
              </div>
              <div className="text-slate-400 text-[11px] truncate" title={activePacket.layer6?.authTag}>
                Auth Tag: <span className={activePacket.layer6?.tampered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{activePacket.layer6?.authTag}</span>
              </div>
            </div>

            {/* Layer 4 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Network className="w-3 h-3" /> Layer 4: Transport (TCP)
              </div>
              <div className="text-slate-400 text-[11px]">Src Port: <span className="text-slate-200">{activePacket.layer4?.srcPort}</span></div>
              <div className="text-slate-400 text-[11px]">Dst Port: <span className="text-slate-200">{activePacket.layer4?.dstPort} (HTTPS)</span></div>
              <div className="text-slate-400 text-[11px]">Flags: <span className="text-cyan-300">[{activePacket.layer4?.flags?.join(', ')}]</span></div>
            </div>

            {/* Layer 3 */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Network className="w-3 h-3" /> Layer 3: Network (IP)
              </div>
              <div className="text-slate-400 text-[11px]">Source IP: <span className="text-slate-200">{activePacket.layer3?.srcIp}</span></div>
              <div className="text-slate-400 text-[11px]">Dest IP: <span className="text-slate-200">{activePacket.layer3?.dstIp}</span></div>
              <div className="text-slate-400 text-[11px]">TTL / Checksum: <span className="text-slate-300">{activePacket.layer3?.ttl} / {activePacket.layer3?.headerChecksum}</span></div>
            </div>
          </div>
        ) : activeTab === 'wire' ? (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-3">
              <Eye className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-300 text-xs mb-1">What an In-Flight Eavesdropper (ISP / Hacker / Public Wi-Fi) sees on the wire:</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Because End-to-End Encryption was performed on the client prior to TCP socket transmission, only the Initialization Vector (IV), Ciphertext, and Authentication Tag traverse the network. Zero plaintext is exposed.
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-lg border border-slate-800 space-y-2">
              <div className="text-slate-400 text-[11px]">
                <span className="text-cyan-400 font-bold">TRANSIT CIPHERTEXT:</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-emerald-400 break-all select-all text-xs">
                {activePacket.layer6?.ciphertext}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400">INITIALIZATION VECTOR (IV): </span>
                  <span className="text-cyan-300">{activePacket.layer6?.iv}</span>
                </div>
                <div>
                  <span className="text-slate-400">AUTHENTICATION TAG (GHASH): </span>
                  <span className={activePacket.layer6?.tampered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{activePacket.layer6?.authTag}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-black/80 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1 select-all overflow-x-auto">
            <div className="text-slate-500 mb-2"># Hexadecimal Frame Dump - Packet {activePacket.packetId}</div>
            {formatHexDump(activePacket.layer6?.ciphertext || '00')}
          </div>
        )}
      </div>
    </div>
  );
};

// Utility to generate a realistic Wireshark style Hex Dump
function formatHexDump(hexString) {
  const lines = [];
  const bytes = hexString.match(/.{1,2}/g) || [];
  
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    const offset = i.toString(16).padStart(4, '0').toUpperCase();
    const hexPart = chunk.map(b => b.toUpperCase()).join(' ').padEnd(48, ' ');
    const asciiPart = chunk.map(b => {
      const code = parseInt(b, 16);
      return code >= 32 && code <= 126 ? String.fromCharCode(code) : '.';
    }).join('');
    lines.push(
      <div key={i} className="flex gap-4">
        <span className="text-slate-500">{offset}</span>
        <span className="text-cyan-300">{hexPart}</span>
        <span className="text-slate-400">{asciiPart}</span>
      </div>
    );
  }
  return lines;
}

export default NetworkInspector;
