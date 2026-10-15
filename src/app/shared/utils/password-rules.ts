import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

/** Requisitos de contraseña; los muestra el formulario de registro y los valida el validator. */
export const PASSWORD_RULES: PasswordRule[] = [
  { label: '8+ characters', test: (v) => v.length >= 8 },
  { label: 'Upper & lowercase', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: 'A number', test: (v) => /\d/.test(v) },
  { label: 'A symbol', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const passwordRulesValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = (control.value ?? '') as string;
  return PASSWORD_RULES.every((rule) => rule.test(value)) ? null : { passwordRules: true };
};

export function matchFields(first: string, second: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(first)?.value;
    const b = group.get(second)?.value;
    return a === b ? null : { mismatch: true };
  };
}
