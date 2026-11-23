// Re-export modern cryptographic suite while preserving backward compatibility
export * from './crypto';

// Legacy fallback aliases
export const encrypt = (text, shift = 3) => {
  return text.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      const base = code >= 65 && code <= 90 ? 65 : 97;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }
    return char;
  }).join('');
};

export const decrypt = (text, shift = 3) => {
  return encrypt(text, 26 - shift);
};
