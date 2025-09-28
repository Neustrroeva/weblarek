import type { IProductApi } from '../types';
import type { IEvents } from '../components/base/events';
import { cloneTemplate } from '../utils/ui';
import { formatPrice } from '../utils/format';

export class CardView {
  readonly root: HTMLElement;
  private productId?: string;

  constructor(private events: IEvents) {
    this.root = cloneTemplate('card-catalog');
    this.root.addEventListener('click', () => {
      if (this.productId) {
        this.events.emit('product:select', { id: this.productId });
      }
    });
  }

  render(product: IProductApi): HTMLElement {
    this.productId = product.id;
    this.root.querySelector('.card__title')!.textContent = product.title;
    this.root.querySelector('.card__price')!.textContent = formatPrice(product.price);
    
    const categoryEl = this.root.querySelector('.card__category')!;
    categoryEl.textContent = product.category;
    categoryEl.className = `card__category card__category_${this.getCategoryClass(product.category)}`;
    
    const imageEl = this.root.querySelector('.card__image') as HTMLImageElement;
    imageEl.src = product.image;
    imageEl.alt = product.title;
    
    return this.root;
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
