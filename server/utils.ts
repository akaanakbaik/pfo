import * as crypto from 'crypto';

// Simple password hashing using SHA-256
// In a production app, use a proper library like bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  return `${salt}:${hash}`;
}

export async function comparePassword(password: string, storedPassword: string): Promise<boolean> {
  const [salt, hash] = storedPassword.split(':');
  const calculatedHash = crypto.createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  return hash === calculatedHash;
}
