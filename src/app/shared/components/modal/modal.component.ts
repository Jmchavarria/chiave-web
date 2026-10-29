import { Component, computed, effect, HostListener, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMarkSolid } from '@ng-icons/heroicons/solid';

export interface TabOption {
  id: string;
  label: string;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';

// Mismos anchos que tenían las clases max-w-* de Tailwind
const MODAL_WIDTHS: Record<ModalSize, string> = {
  sm: '24rem', // 384px
  md: '28rem', // 448px
  lg: '32rem', // 512px
  xl: '36rem', // 576px
  '2xl': '42rem', // 672px
  '4xl': '56rem', // 896px
  full: '100%',
};

@Component({
  selector: 'app-modal',
  standalone: true,
  providers: [provideIcons({ heroXMarkSolid })],
  imports: [NgIcon],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  // Publica el ancho como variable CSS para que el SCSS la use
  host: { '[style.--modal-max-width]': 'maxWidth()' },
})
export class ModalComponent {
  title = input<string | null>(null);
  description = input<string | null>(null);
  size = input<ModalSize>('md'); // Valor por defecto
  onCancel = output<void>();

  // Soporte para pestañas
  tabs = input<TabOption[]>([]);
  activeTab = signal<string>('');
  tabChange = output<string>();

  readonly maxWidth = computed(() => MODAL_WIDTHS[this.size()]);

  constructor() {
    // Autoselect primera pestaña si no hay una activa
    effect(
      () => {
        const currentTabs = this.tabs();
        if (currentTabs.length > 0 && !this.activeTab()) {
          this.activeTab.set(currentTabs[0].id);
        }
      },
      { allowSignalWrites: true },
    );
  }

  // Cierra solo si el clic empieza en el fondo, no dentro de la tarjeta.
  // Con "mousedown" no se cierra si seleccionas texto y sueltas fuera.
  handleBackdropMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.handleCancel();
    }
  }

  selectTab(tabId: string): void {
    this.activeTab.set(tabId);
    this.tabChange.emit(tabId);
  }

  @HostListener('document:keydown.esc')
  handleKeyEvent(): void {
    this.handleCancel();
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}
