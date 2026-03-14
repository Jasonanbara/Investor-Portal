import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number; // 0-5
  errors: string[];
}

export function validatePasswordStrength(
  password: string
): PasswordStrengthResult {
  const errors: string[] = [];
  let score = 0;

  if (password.length >= 12) {
    score++;
  } else {
    errors.push("Password must be at least 12 characters long");
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    errors.push("Password must contain at least one number");
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    score++;
  } else {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    score,
    errors,
  };
}
