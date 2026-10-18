import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VerifyEmailUseCase } from '../../../application/use-cases/verify-email.use-case';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  heroArrowRightSolid,
  heroCheckSolid,
  heroClockSolid,
  heroEnvelopeSolid,
  heroLinkSolid,
  heroLockClosedSolid,
  heroXMarkSolid,
} from '@ng-icons/heroicons/solid';

type VerificationStatus = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  providers: [
    provideIcons({
      heroArrowRightSolid,
      heroCheckSolid,
      heroClockSolid,
      heroEnvelopeSolid,
      heroLinkSolid,
      heroLockClosedSolid,
      heroXMarkSolid,
    }),
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, RouterLink],
})
export class VerifyEmailComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  readonly status = signal<VerificationStatus>('loading');
  readonly message = signal('Verifying your email...');

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.route.snapshot.queryParamMap.get('token');
    const userId = this.route.snapshot.queryParamMap.get('id');

    if (!token || !userId) {
      this.status.set('error');
      this.message.set('The verification link is invalid or missing its token.');
      return;
    }

    try {
      await this.verifyEmailUseCase.execute(Number(userId), token);
      this.status.set('success');
      this.message.set('Your email has been verified successfully.');
    } catch {
      this.status.set('error');
      this.message.set('The verification link is invalid, expired, or has already been used.');
    }
  }
}
