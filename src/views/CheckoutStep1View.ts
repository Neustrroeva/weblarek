import type { IOrderPart1, PaymentMethod } from '../types';
import type { IEvents } from '../components/base/events';
import { cloneTemplate, setDisabled } from '../utils/ui';

export class CheckoutStep1View {
  readonly root: HTMLElement;
  private addressInput: HTMLInputElement;
  private paymentCardBtn: HTMLButtonElement;
  private paymentCashBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private errorsEl: HTMLElement;

  constructor(private events: IEvents) {
    this.root = cloneTemplate('order');
    this.addressInput = this.root.querySelector('input[name="address"]') as HTMLInputElement;
    this.paymentCardBtn = this.root.querySelector('button[name="card"]') as HTMLButtonElement;
    this.paymentCashBtn = this.root.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.nextBtn = this.root.querySelector('.order__button') as HTMLButtonElement;
    this.errorsEl = this.root.querySelector('.form__errors') as HTMLElement;

    this.addressInput.addEventListener('input', () => this.validateForm());
    this.paymentCardBtn.addEventListener('click', () => this.togglePayment('card'));
    this.paymentCashBtn.addEventListener('click', () => this.togglePayment('cash'));

    this.nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.submitForm();
    });
  }

  mount(part: IOrderPart1): HTMLElement {
    this.addressInput.value = part.address ?? '';
    this.setActivePayment(part.payment ?? null);
    this.validateForm();
    return this.root;
  }

  private togglePayment(method: Exclude<PaymentMethod, null>) {
    const current = this.getActivePayment();
    const next = current === method ? null : method;
    this.setActivePayment(next);
    this.validateForm();
  }

  private setActivePayment(method: PaymentMethod) {
    this.paymentCardBtn.classList.toggle('button_alt-active', method === 'card');
    this.paymentCashBtn.classList.toggle('button_alt-active', method === 'cash');
  }

  private getActivePayment(): PaymentMethod {
    if (this.paymentCardBtn.classList.contains('button_alt-active')) return 'card';
    if (this.paymentCashBtn.classList.contains('button_alt-active')) return 'cash';
    return null;
  }

  private validateForm() {
    const address = this.addressInput.value.trim();
    const method = this.getActivePayment();
    const addressValid = address.length >= 5;
    const methodValid = method !== null;
    const isValid = addressValid && methodValid;

    setDisabled(this.nextBtn, !isValid);

    if (!methodValid) {
      this.errorsEl.textContent = 'Необходимо выбрать способ оплаты';
    } else if (!addressValid) {
      this.errorsEl.textContent = 'Необходимо указать адрес';
    } else {
      this.errorsEl.textContent = '';
    }
  }

  private submitForm() {
    const address = this.addressInput.value.trim();
    const method = this.getActivePayment();

    if (method && address.length >= 5) {
      this.events.emit('order:fill-step1', { payment: method, address });
    } else {
      this.validateForm();
    }
  }
}