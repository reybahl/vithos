import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Native scrypt for Better Auth email/password.
 *
 * Wrangler resolves `@better-auth/utils/password` to the pure-JS `@noble/hashes`
 * fallback (no `workerd` export), which exceeds Workers CPU limits on sign-in.
 * This matches `@better-auth/utils/dist/password.node.mjs` (hex salt string, same params).
 */
const SCRYPT = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
  maxmem: 128 * 16384 * 16 * 2,
} as const;

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      SCRYPT.dkLen,
      { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, maxmem: SCRYPT.maxmem },
      (error, key) => {
        if (error) reject(error);
        else resolve(key);
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword({
  hash,
  password,
}: {
  hash: string;
  password: string;
}): Promise<boolean> {
  const [salt, keyHex] = hash.split(":");
  if (!salt || !keyHex) return false;

  const derived = await deriveKey(password, salt);
  const expected = Buffer.from(keyHex, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
