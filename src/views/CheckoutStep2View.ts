import type { IOrderPart2 } from '../types';
import type { IEvents } from '../components/base/events';
import { cloneTemplate, setDisabled } from '../utils/ui';

export class CheckoutStep2View {
  readonly root: HTMLElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private payBtn: HTMLButtonElement;
  private errorsEl: HTMLElement;

  constructor(private events: IEvents, private onSubmit: () => void) {
    this.root = cloneTemplate('contacts');

    this.emailInput = this.root.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = this.root.querySelector('input[name="phone"]') as HTMLInputElement;
    this.payBtn = this.root.querySelector('.button') as HTMLButtonElement;
    this.errorsEl = this.root.querySelector('.form__errors') as HTMLElement;

    this.emailInput.addEventListener('input', () => this.validateForm());
    this.phoneInput.addEventListener('input', () => this.validateForm());

    this.payBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.submitForm();
    });
  }

  mount(part: IOrderPart2): HTMLElement {
    this.emailInput.value = part.email ?? '';
    this.phoneInput.value = part.phone ?? '';
    this.validateForm();
    return this.root;
  }

  private validateForm() {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);

    const isValid = emailValid && phoneValid;
    setDisabled(this.payBtn, !isValid);

    const errors = [];
    if (!emailValid && email.length > 0) errors.push('Введите корректный email');
    if (!phoneValid && phone.length > 0) errors.push('Введите корректный номер телефона');
    this.errorsEl.textContent = errors.join(', ');
  }

  private submitForm() {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);

    if (emailValid && phoneValid) {
      this.events.emit('order:fill-step2', { email, phone });
      this.onSubmit(); // вызов отправки заказа
    }
  }
}