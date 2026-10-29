import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  output,
  signal,
  viewChild,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCommandLineSolid,
  heroCreditCardSolid,
  heroDocumentTextSolid,
  heroExclamationCircleSolid,
  heroEyeSlashSolid,
  heroEyeSolid,
  heroGlobeAltSolid,
  heroIdentificationSolid,
  heroSparklesSolid,
  heroStarSolid,
} from '@ng-icons/heroicons/solid';
import { CreateVaultProps } from '../../domain/repositories/vault.repository';
import { VaultItemTypeEnum } from '../../domain/enums/vault-item-type.enum';
import { VaultModalService } from '../../services/vault-modal.service';

interface IdentityField {
  name: string;
  label: string;
  full?: boolean;
}

const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

function cardNumberValidator(control: AbstractControl): ValidationErrors | null {
  const digits = String(control.value ?? '').replace(/[\s-]/g, '');
  if (!digits) return null;
  if (!/^\d{12,19}$/.test(digits)) return { cardNumber: true };

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0 ? null : { cardNumber: true };
}

@Component({
  selector: 'app-new-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [
    provideIcons({
      heroCommandLineSolid,
      heroCreditCardSolid,
      heroDocumentTextSolid,
      heroExclamationCircleSolid,
      heroEyeSlashSolid,
      heroEyeSolid,
      heroGlobeAltSolid,
      heroIdentificationSolid,
      heroSparklesSolid,
      heroStarSolid,
    }),
  ],
  templateUrl: './new-item-form.component.html',
  styleUrl: './new-item-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewItemFormComponent implements OnInit {
  readonly saved = output<CreateVaultProps>();
  readonly cancelled = output<void>();

  private readonly fb = inject(FormBuilder);

  // Inyectamos el servicio de estado local del modal
  readonly modalState = inject(VaultModalService);

  readonly types: { value: VaultItemTypeEnum; label: string; icon: string }[] = [
    { value: VaultItemTypeEnum.LOGIN, label: 'Login', icon: 'heroGlobeAltSolid' },
    { value: VaultItemTypeEnum.CARD, label: 'Card', icon: 'heroCreditCardSolid' },
    { value: VaultItemTypeEnum.IDENTITY, label: 'Identity', icon: 'heroIdentificationSolid' },
    { value: VaultItemTypeEnum.SECURE_NOTE, label: 'Secure note', icon: 'heroDocumentTextSolid' },
    { value: VaultItemTypeEnum.SSH_KEY, label: 'SSH key', icon: 'heroCommandLineSolid' },
  ];

  readonly courtesyTitles = [
    { value: 'MR', label: 'Mr' },
    { value: 'MRS', label: 'Mrs' },
    { value: 'MS', label: 'Ms' },
    { value: 'MX', label: 'Mx' },
    { value: 'DR', label: 'Dr' },
  ];

  readonly identitySections: { title: string; fields: IdentityField[] }[] = [
    {
      title: 'Name',
      fields: [
        { name: 'courtesyTitle', label: 'Title' },
        { name: 'firstName', label: 'First name' },
        { name: 'middleName', label: 'Middle name' },
        { name: 'lastName', label: 'Last name' },
      ],
    },
    {
      title: 'Account',
      fields: [
        { name: 'identityUsername', label: 'Username' },
        { name: 'company', label: 'Company' },
      ],
    },
    {
      title: 'Documents',
      fields: [
        { name: 'ssn', label: 'Social security number' },
        { name: 'passportNumber', label: 'Passport number' },
        { name: 'licenseNumber', label: 'License number' },
      ],
    },
    {
      title: 'Contact',
      fields: [
        { name: 'email', label: 'Email' },
        { name: 'phone', label: 'Phone' },
      ],
    },
    {
      title: 'Address',
      fields: [
        { name: 'address1', label: 'Address 1', full: true },
        { name: 'address2', label: 'Address 2', full: true },
        { name: 'address3', label: 'Address 3', full: true },
        { name: 'city', label: 'City' },
        { name: 'state', label: 'State / Province' },
        { name: 'postalCode', label: 'Postal code' },
        { name: 'country', label: 'Country' },
      ],
    },
  ];

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    notes: ['', Validators.maxLength(5000)],
    isFavorite: [false],

    login: this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.maxLength(128)]],
      authenticatorKey: ['', Validators.maxLength(256)],
      website: ['', [Validators.maxLength(2048), Validators.pattern(URL_PATTERN)]],
    }),

    card: this.fb.nonNullable.group({
      cardholderName: ['', [Validators.required, Validators.maxLength(100)]],
      brand: ['', Validators.maxLength(30)],
      number: ['', [Validators.required, cardNumberValidator]],
      expMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expYear: ['', [Validators.required, Validators.pattern(/^([0-9]{2}|[0-9]{4})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
    }),

    identity: this.fb.nonNullable.group({
      courtesyTitle: [''],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      identityUsername: [''],
      company: [''],
      ssn: [''],
      passportNumber: [''],
      licenseNumber: [''],
      email: ['', [Validators.email, Validators.maxLength(254)]],
      phone: [''],
      address1: [''],
      address2: [''],
      address3: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
    }),

    sshKey: this.fb.nonNullable.group({
      publicKey: [''],
      privateKey: [''],
      fingerPrint: [''],
    }),
  });

  readonly login = this.form.controls.login.controls;
  readonly card = this.form.controls.card.controls;
  readonly identity = this.form.controls.identity.controls;

  readonly type = signal<VaultItemTypeEnum>(VaultItemTypeEnum.LOGIN);
  readonly showPassword = signal(false);
  isSubmitted = false;

  private readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');

  constructor() {
    afterNextRender(() => this.titleInput()?.nativeElement.focus());
  }

  ngOnInit(): void {
    // Sincronizamos el tipo inicial y precargamos datos si estamos editando
    const activeType = this.modalState.activeType();
    const vaultToEdit = this.modalState.selectedVault();

    this.type.set(activeType);
    this.applyType(activeType);

    if (vaultToEdit) {
      this.form.patchValue(vaultToEdit);
    }
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.isSubmitted);
  }

  setType(type: VaultItemTypeEnum): void {
    this.type.set(type);
    this.isSubmitted = false;
    this.applyType(type);

    // Notificamos al servicio local el cambio de tipo para actualizar el título del modal al instante
    this.modalState.setActiveType(type);
  }

  generatePassword(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_';
    const values = crypto.getRandomValues(new Uint32Array(18));
    const password = Array.from(values, (v) => chars[v % chars.length]).join('');

    this.login.password.setValue(password);
    this.showPassword.set(true);
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit(this.buildPayload());
  }

  private applyType(type: VaultItemTypeEnum): void {
    const { login, card, identity, sshKey } = this.form.controls;
    const groups = { LOGIN: login, CARD: card, IDENTITY: identity, SSH_KEY: sshKey };

    for (const [key, group] of Object.entries(groups)) {
      if (key === type) group.enable();
      else group.disable();
    }

    const notes = this.form.controls.notes;
    notes.setValidators(
      type === 'SECURE_NOTE'
        ? [Validators.required, Validators.maxLength(5000)]
        : [Validators.maxLength(5000)],
    );
    notes.updateValueAndValidity();
  }

  private buildPayload(): CreateVaultProps {
    const { title, notes, isFavorite, login, card, identity, sshKey } = this.form.getRawValue();
    const type = this.type();

    const byType = {
      LOGIN: login,
      CARD: { ...card, number: card.number.replace(/[\s-]/g, '') },
      IDENTITY: identity,
      SSH_KEY: sshKey,
      SECURE_NOTE: {},
    }[type];

    const payload = { type, title: title.trim(), isFavorite, notes, ...byType };

    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== ''),
    ) as unknown as CreateVaultProps;
  }
}
