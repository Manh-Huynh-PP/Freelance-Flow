
import CryptoJS from 'crypto-js';

// Use a distinct secret for the app. In production, this should be in .env
// For now, we'll use a fallback if the env var is not set, but log a warning.
const SECRET_KEY = process.env.NEXT_PUBLIC_APP_SECRET || 'freelance-flow-default-secret-key-change-me';

if (!process.env.NEXT_PUBLIC_APP_SECRET) {
  console.warn('⚠️ Encryption warning: NEXT_PUBLIC_APP_SECRET is not set. Using default insecure key.');
}

/**
 * Encrypts a text string using AES.
 * Returns the ciphertext string.
 */
export const encrypt = (text: string | null | undefined): string => {
  if (!text) return '';
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return text; // Fallback: return original (or handle differently based on strictness)
  }
};

/**
 * Decrypts a ciphertext string using AES.
 * Returns the original text.
 */
export const decrypt = (ciphertext: string | null | undefined): string => {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // Check if decryption actually produced a string (empty string might mean wrong key or empty input)
    // AES.decrypt returns empty if malformed often, but let's be safe.
    if (!originalText && ciphertext.length > 0) {
      // It might be legacy unencrypted data? 
      // Strategy: if decryption fails (produces empty/garbage) but input wasn't empty, 
      // assume it might be plain text (backward compatibility). 
      return ciphertext;
    }

    return originalText;
  } catch (error) {
    // console.warn('Decryption failed (returning original):', error);
    // This allows gradual migration: if it's not encrypted, we return it as is.
    return ciphertext;
  }
};
