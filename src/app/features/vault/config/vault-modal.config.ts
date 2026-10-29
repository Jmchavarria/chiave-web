import { ModalMode } from '../../../core/types/modal-mode.type';
import { ModalHeader } from '../../../core/types/modal.type';

export const VaultModalHeaders: Record<Exclude<ModalMode, null>, ModalHeader> = {
  create: {
    title: 'New',
    description: 'Fill in the information to create a new user.',
  },
  edit: {
    title: 'Edit',
    description: "Update the user's information.",
  },
  detail: {
    title: 'User detail',
    description: "View the user's information.",
  },
};
