import type { BasketItem } from '../types';
import type { IEvents } from '../components/base/events';
import { cloneTemplate, setDisabled } from '../utils/ui';
import { formatPrice } from '../utils/format';

export class BasketView {
  readonly root: HTMLElement;
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private emptyEl: HTMLElement;

  constructor(private events: IEvents) {
    this.root = cloneTemplate('basket');
    this.listEl = this.root.querySelector('.basket__list')!;
    this.totalEl = this.root.querySelector('.basket__price')!;
    this.buttonEl = this.root.querySelector('.basket__button') as HTMLButtonElement;
    this.emptyEl = this.root.querySelector('.basket__empty-text') as HTMLElement;

    this.buttonEl.addEventListener('click', () => this.events.emit('order:open-step1'));
  }

  render(items: BasketItem[], total: number): HTMLElement {
    const isEmpty = items.length === 0;

    this.listEl.replaceChildren(
      ...items.map((item, idx) => {
        const tpl = cloneTemplate('card-basket');
        tpl.querySelector('.basket__item-index')!.textContent = String(idx + 1);
        tpl.querySelector('.basket__item-title')!.textContent = item.title;
        tpl.querySelector('.basket__item-price')!.textContent = formatPrice(item.price);
        tpl.querySelector('.basket__item-delete')!.addEventListener('click', () => {
          this.events.emit('basket:remove', { id: item.id });
        });
        return tpl;
      })
    );

    this.totalEl.textContent = formatPrice(total);
    this.emptyEl.style.display = isEmpty ? 'block' : 'none';
    this.listEl.style.display = isEmpty ? 'none' : 'flex';
    setDisabled(this.buttonEl, isEmpty);

    return this.root;
  }
}