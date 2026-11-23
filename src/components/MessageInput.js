import React from 'react';
import { Send, Lock, Cpu } from 'lucide-react';

const MessageInput = ({ newMessage, setNewMessage, onSend, selectedAlgorithm }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-800">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type a confidential message (Encrypted using ${selectedAlgorithm})...`}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
        </div>

        <button
          onClick={onSend}
          disabled={!newMessage.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-6 py-3 rounded-xl font-bold font-mono text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Send className="w-4 h-4" />
          <span>Encrypt & Send</span>
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-cyan-400">
            <Lock className="w-3 h-3" />
            <span>Authenticated Cryptographic Handshake Active</span>
          </span>
          <span>•</span>
          <span>Zero Server Plaintext Storage</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>Algorithm: <strong className="text-slate-200">{selectedAlgorithm}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
