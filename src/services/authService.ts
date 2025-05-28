import crypto from "crypto";
import jwt  from 'jsonwebtoken'

export const createPasswordHash = (
  password: string
): { hash: Buffer; salt: Buffer } => {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
  return { hash, salt };
};

export const verifyPasswordHash = (
  password: string,
  hash: Buffer,
  salt: Buffer
): boolean => {
  const newHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
  return crypto.timingSafeEqual(hash, newHash);
};

export const createToken = (user: {
  id: number;
  username: string | null;
  email: string;
}) => {
  return jwt.sign(
    { sub: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};
