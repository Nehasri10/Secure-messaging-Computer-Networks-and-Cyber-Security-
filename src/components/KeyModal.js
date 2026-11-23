import React, { useState } from 'react';
import { ShieldCheck, Key, Copy, Check, X, Lock, Cpu, RefreshCw } from 'lucide-react';

const KeyModal = ({ isOpen, onClose, currentUser, userKeys, onRegenerateKeys }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedFp, setCopiedFp] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedFp(true);
      setTimeout(() => setCopiedFp(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
                Cryptographic Keyring & Certificate
              </h2>
              <p className="text-xs text-slate-400">
                End-to-End Encryption Keys for <span className="text-cyan-300 font-semibold">{currentUser}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] font-mono text-xs">
          {/* Key Status Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-emerald-300 font-bold text-xs">2048-bit RSA-OAEP / ECDH Asymmetric Pair</div>
                <div className="text-[11px] text-emerald-400/80">Hardware-Isolated Simulation • Zero Server Storage</div>
              </div>
            </div>
            <button
              onClick={onRegenerateKeys}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] transition-all"
              title="Regenerate keypair"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rotate Key</span>
            </button>
          </div>

          {/* Fingerprint */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-[11px] font-semibold flex items-center justify-between">
              <span>PUBLIC KEY FINGERPRINT (SHA-256)</span>
              <button
                onClick={() => copyToClipboard(userKeys.fingerprint, 'fp')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
              >
                {copiedFp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFp ? 'Copied' : 'Copy'}</span>
              </button>
            </label>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 font-bold text-xs break-all">
              {userKeys.fingerprint}
            </div>
          </div>

          {/* Public Key */}
          <div className="space-y-1.5">
            <label className="text-slate-400 text-[11px] font-semibold flex items-center justify-between">
              <span>ACTIVE PUBLIC KEY (SHARED OVER THE WIRE)</span>
              <button
                onClick={() => copyToClipboard(userKeys.publicKey, 'key')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied PEM' : 'Copy PEM'}</span>
              </button>
            </label>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 text-[11px] leading-relaxed break-all select-all whitespace-pre-wrap max-h-36 overflow-y-auto">
              {userKeys.publicKey}
            </div>
          </div>

          {/* Cryptographic Primitives Info */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Symmetric Cipher
              </div>
              <p className="text-slate-400 leading-relaxed">
                Messages encrypted via AES-256-GCM authenticated cipher with dynamic 96-bit random IVs.
              </p>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Key Exchange
              </div>
              <p className="text-slate-400 leading-relaxed">
                Ephemeral Diffie-Hellman / ECDH handshake derives unique per-conversation session secrets.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition-all"
          >
            Close Keyring
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyModal;
