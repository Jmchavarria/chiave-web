import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCreditCardSolid,
  heroDocumentTextSolid,
  heroExclamationCircleSolid,
  heroEyeSlashSolid,
  heroEyeSolid,
  heroGlobeAltSolid,
  heroSparklesSolid,
  heroStarSolid,
} from '@ng-icons/heroicons/solid';

export type ItemType = 'LOGIN' | 'NOTE' | 'CARD';

// Payload sensible (se cifra en bloque) + metadatos no sensibles
export interface NewItemData {
  payload: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  };
  type: ItemType;
  isFavorite: boolean;
}

interface NewItemForm {
  type: FormControl<ItemType>;
  title: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  url: FormControl<string>;
  notes: FormControl<string>;
  isFavorite: FormControl<boolean>;
}

// Opcional: acepta vacío, o un dominio con o sin http(s)://
const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

@Component({
  selector: 'app-new-item-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [
    provideIcons({
      heroCreditCardSolid,
      heroDocumentTextSolid,
      heroExclamationCircleSolid,
      heroEyeSlashSolid,
      heroEyeSolid,
      heroGlobeAltSolid,
      heroSparklesSolid,
      heroStarSolid,
    }),
  ],
  templateUrl: './new-item-form.component.html',
  styleUrl: './new-item-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewItemFormComponent {
  readonly saved = output<NewItemData>();
  readonly cancelled = output<void>();

  readonly types: { value: ItemType; label: string; icon: string }[] = [
    { value: 'LOGIN', label: 'Login', icon: 'heroGlobeAltSolid' },
    { value: 'NOTE', label: 'Note', icon: 'heroDocumentTextSolid' },
    { value: 'CARD', label: 'Card', icon: 'heroCreditCardSolid' },
  ];

  readonly form: FormGroup<NewItemForm>;
  readonly showPassword = signal(false);
  isSubmitted = false;

  private readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      type: ['LOGIN' as ItemType],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.maxLength(128)]],
      url: ['', [Validators.maxLength(2048), Validators.pattern(URL_PATTERN)]],
      notes: ['', Validators.maxLength(1000)],
      isFavorite: [false],
    });

    // Al abrir, el cursor cae en el título
    afterNextRender(() => this.titleInput()?.nativeElement.focus());
  }

  showError(name: keyof NewItemForm): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.isSubmitted);
  }

  setType(type: ItemType): void {
    this.form.controls.type.setValue(type);
  }

  generatePassword(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_';
    const values = crypto.getRandomValues(new Uint32Array(18));
    const password = Array.from(values, (v) => chars[v % chars.length]).join('');

    this.form.controls.password.setValue(password);
    this.showPassword.set(true);
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { type, isFavorite, ...payload } = this.form.getRawValue();
    this.saved.emit({ payload, type, isFavorite });
  }
}