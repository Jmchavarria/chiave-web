import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheckCircleSolid, heroExclamationCircleSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  providers: provideIcons({
    heroExclamationCircleSolid,
    heroCheckCircleSolid,
  }),
  imports: [NgIcon],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  constructor(protected readonly toastService: ToastService) {}
}
