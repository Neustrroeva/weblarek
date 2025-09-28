import { cloneTemplate } from '../utils/ui';

export class OrderSuccessView {
  readonly root: HTMLElement;
  private descEl: HTMLElement;
  private closeBtn: HTMLButtonElement;

  constructor(private onClose: () => void) {
    this.root = cloneTemplate('success');
    this.descEl = this.root.querySelector('.order-success__description')!;
    this.closeBtn = this.root.querySelector('.order-success__close') as HTMLButtonElement;
    this.closeBtn.addEventListener('click', () => this.onClose());
  }

  mount(message: string): HTMLElement {
    this.descEl.textContent = message;
    return this.root;
  }
}
