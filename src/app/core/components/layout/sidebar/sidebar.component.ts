import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowRightOnRectangleSolid,
  heroBoltSolid,
  heroCog6ToothSolid,
  heroCreditCardSolid,
  heroDocumentTextSolid,
  heroGlobeAltSolid,
  heroLockClosedSolid,
  heroPlusSolid,
  heroShieldCheckSolid,
  heroStarSolid,
} from '@ng-icons/heroicons/solid';

interface NavItem {
  label: string;
  icon: string;
  link: string;
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [
    provideIcons({
      heroArrowRightOnRectangleSolid,
      heroBoltSolid,
      heroCog6ToothSolid,
      heroCreditCardSolid,
      heroDocumentTextSolid,
      heroGlobeAltSolid,
      heroLockClosedSolid,
      heroPlusSolid,
      heroShieldCheckSolid,
      heroStarSolid,
    }),
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly userName = input('User');
  readonly userEmail = input('');
  readonly logout = output<void>();

  readonly initials = computed(
    () =>
      this.userName()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || '?',
  );

  readonly sections: NavSection[] = [
    {
      title: 'Vault',
      items: [
        { label: 'All items', icon: 'heroLockClosedSolid', link: '/app/vault', exact: true },
        { label: 'Favorites', icon: 'heroStarSolid', link: '/vault/favorites' },
      ],
    },
    {
      title: 'Categories',
      items: [
        { label: 'Logins', icon: 'heroGlobeAltSolid', link: '/vault/logins' },
        { label: 'Cards', icon: 'heroCreditCardSolid', link: '/vault/cards' },
        { label: 'Secure notes', icon: 'heroDocumentTextSolid', link: '/vault/notes' },
      ],
    },
    {
      title: 'Tools',
      items: [
        { label: 'Password generator', icon: 'heroBoltSolid', link: '/generator' },
        { label: 'Security check', icon: 'heroShieldCheckSolid', link: '/security' },
      ],
    },
  ];
}
