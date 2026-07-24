const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidatorFn = (value: any, fieldName: string) => string | null;

export const validators = {
  required: (value: any, fieldName: string): string | null => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string, fieldName: string): string | null => {
    if (value && value.length > max) {
      return `${fieldName} must be ${max} characters or less`;
    }
    return null;
  },

  email: (value: string, fieldName: string = "Email"): string | null => {
    if (value && !EMAIL_REGEX.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    return null;
  },

  inclusion: (allowedValues: any[]) => (value: any, fieldName: string): string | null => {
    if (value !== undefined && value !== null && !allowedValues.includes(value)) {
      return `Invalid ${fieldName} selected`;
    }
    return null;
  }
};

/**
 * Ejecuta una lista de validadores para un campo y retorna el primer mensaje de error.
 */
export function validateField(value: any, fieldName: string, rules: ValidatorFn[]): string | null {
  for (const rule of rules) {
    const error = rule(value, fieldName);
    if (error) return error;
  }
  return null;
}
