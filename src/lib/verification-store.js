// Simple in-memory storage for email verification tokens
// In production, this should be replaced with a database (Redis, PostgreSQL, etc.)

const verificationStore = new Map();

export function storeVerificationToken(email, token) {
  verificationStore.set(token, {
    email,
    name: null,
    resource: null,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function getVerificationData(token) {
  const data = verificationStore.get(token);
  if (!data) return null;

  // Check if token has expired
  if (Date.now() > data.expiresAt) {
    verificationStore.delete(token);
    return null;
  }

  return data;
}

export function consumeVerificationToken(token) {
  const data = verificationStore.get(token);
  if (!data) return null;

  // Check if token has expired
  if (Date.now() > data.expiresAt) {
    verificationStore.delete(token);
    return null;
  }

  verificationStore.delete(token);
  return data;
}

export function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of verificationStore.entries()) {
    if (now > data.expiresAt) {
      verificationStore.delete(token);
    }
  }
}

// Clean up expired tokens every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
}
