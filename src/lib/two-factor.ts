import { generateSecret as genSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

const APP_NAME = "NorthLend Financial";

export function generateSecret(): string {
  return genSecret();
}

export async function generateQRCode(
  email: string,
  secret: string
): Promise<string> {
  const otpauth = generateURI({
    secret,
    issuer: APP_NAME,
    label: email,
    algorithm: "sha1",
    digits: 6,
    period: 30,
  });
  return QRCode.toDataURL(otpauth);
}

export function verifyToken(token: string, secret: string): boolean {
  try {
    const result = verifySync({ token, secret }) as { valid: boolean };
    return result.valid;
  } catch {
    return false;
  }
}

export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 36).toString(36)
    )
      .join("")
      .toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}
