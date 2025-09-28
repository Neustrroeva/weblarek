import type { IEvents } from '../components/base/events';
import type { IProductApi, EventPayloadMap } from '../types';
import { CardView } from './CardView';

export class MainPageView {
  private root: HTMLElement;
  private events: IEvents;
  private listEl: HTMLElement;
  private basketBtn: HTMLButtonElement;
  private counterEl: HTMLElement;

  constructor(root: HTMLElement, events: IEvents) {
    this.root = root;
    this.events = events;
    this.listEl = root;
    this.basketBtn = document.querySelector('.header__basket') as HTMLButtonElement;
    this.counterEl = document.querySelector('.header__basket-counter') as HTMLElement;

    this.basketBtn.addEventListener('click', () => this.events.emit('basket:open'));

    events.on('items:change', (payload) => {
      const { items } = payload as EventPayloadMap['items:change'];
      this.render(items);
    });

    events.on('basket:updated', (payload) => {
      const { state } = payload as EventPayloadMap['basket:updated'];
      this.counterEl.textContent = String(state.items.length);
    });
  }

  private render(items: IProductApi[]) {
    const fragments = items.map((p) => new CardView(this.events).render(p));
    this.listEl.replaceChildren(...fragments);
  }
}
