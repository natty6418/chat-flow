//import crypto from 'crypto';
export function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number (0-9).");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (e.g., !@#$%^&*).");
  }

  return errors;
}

export function validateUsername(username: string): string | null {
  if (!username || username.trim().length === 0) {
    return "Username cannot be empty.";
  }

  if (/\s/.test(username)) {
    return "Username cannot contain spaces.";
  }

  if (!/^[a-z]+$/.test(username)) {
    return "Username can only contain lowercase letters (a-z).";
  }

  if (username.length < 2) {
    return "Username must be at least 2 characters long.";
  }

  if (username.length > 128) {
    return "Username must be less than 128 characters.";
  }

  return null;
}

// Simple hash function for client secret (if needed)
//export async function simpleHash(message: string, secret: string): Promise<string> {
//  const encoder = new TextEncoder();
//  const data = encoder.encode(message + secret);
//  const hmac = crypto.createHmac('SHA256', secret);
//  hmac.update(data);
//
//  return hmac.digest('base64');
// }

export async function generateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const message = new TextEncoder().encode(username + clientId);
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(clientSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await window.crypto.subtle.sign('HMAC', key, message);

  // Convert the ArrayBuffer to a Base64 string
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
