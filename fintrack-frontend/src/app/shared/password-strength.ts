export interface PasswordChecks {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
}

const STRENGTH_LABELS = ['Muito fraca', 'Muito fraca', 'Fraca', 'Razoável', 'Forte', 'Muito forte'];

export function checkPassword(password: string): PasswordChecks {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function passwordScore(checks: PasswordChecks): number {
  return Object.values(checks).filter(Boolean).length;
}

export function passwordLabel(score: number): string {
  return STRENGTH_LABELS[score];
}

export function isStrongPassword(password: string): boolean {
  const checks = checkPassword(password);
  return checks.length && checks.upper && checks.lower && checks.number && checks.special;
}
