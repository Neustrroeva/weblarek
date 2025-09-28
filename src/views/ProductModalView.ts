import type { IProductApi } from '../types';
import type { IEvents } from '../components/base/events';
import { cloneTemplate, setDisabled } from '../utils/ui';
import { formatPrice } from '../utils/format';

export class ProductModalView {
  readonly root: HTMLElement;
  private currentProduct: IProductApi | null = null;
  private buyBtn: HTMLButtonElement;

  constructor(private events: IEvents) {
    this.root = cloneTemplate('card-preview');
    this.buyBtn = this.root.querySelector('.card__button') as HTMLButtonElement;
  }

  render(product: IProductApi, inCart: boolean): HTMLElement {
    this.currentProduct = product;

    const media = this.root.querySelector('.card__media') as HTMLElement | null;
    if (!media) {
      const img = this.root.querySelector('.card__image') as HTMLImageElement | null;
      if (img) {
        const wrap = document.createElement('div');
        wrap.className = 'card__media';
        img.replaceWith(wrap);
        wrap.appendChild(img);
      }
    }

    this.root.querySelector('.card__title')!.textContent = product.title;
    this.root.querySelector('.card__price')!.textContent = formatPrice(product.price);

    const categoryEl = this.root.querySelector('.card__category')!;
    categoryEl.textContent = product.category;
    categoryEl.className = `card__category card__category_${this.getCategoryClass(product.category)}`;

    const imageEl = this.root.querySelector('.card__image') as HTMLImageElement;
    imageEl.src = product.image;
    imageEl.alt = product.title;

    const textEl = this.root.querySelector('.card__text') as HTMLElement | null;
    if (textEl) textEl.textContent = product.description || '';

    const isPriceless = product.price === null;
    if (isPriceless) {
      this.buyBtn.textContent = 'Недоступно';
      setDisabled(this.buyBtn, true);
    } else {
      this.updateButton(inCart);
    }

    return this.root;
  }

  private updateButton(inCart: boolean) {
    if (!this.currentProduct) return;
    this.buyBtn.disabled = false;
    this.buyBtn.onclick = null;

    if (inCart) {
      this.buyBtn.textContent = 'Удалить из корзины';
      this.buyBtn.onclick = () => {
        if (!this.currentProduct) return;
        this.events.emit('basket:remove', { id: this.currentProduct.id });
        this.updateButton(false);
      };
    } else {
      this.buyBtn.textContent = 'Купить';
      this.buyBtn.onclick = () => {
        if (!this.currentProduct) return;
        this.events.emit('basket:add', { id: this.currentProduct.id });
        this.updateButton(true);
      };
    }
  }

  private getCategoryClass(category: string): string {
    const categoryMap: Record<string, string> = {
      'софт-скил': 'soft',
      'другое': 'other',
      'дополнительное': 'additional',
      'кнопка': 'button',
      'хард-скил': 'hard'
    };
    return categoryMap[category] || 'other';
  }
}
