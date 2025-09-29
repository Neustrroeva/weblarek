import { cloneTemplate, setDisabled } from '../../utils/ui';

export abstract class Component {
  readonly root: HTMLElement;

  constructor(templateId: string) {
    this.root = cloneTemplate(templateId);
  }

  protected setTextContent(selector: string, text: string): void {
    const element = this.root.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  protected setDisplay(selector: string, display: 'block' | 'none' | 'flex' | 'grid'): void {
    const element = this.root.querySelector(selector) as HTMLElement;
    if (element) {
      element.style.display = display;
    }
  }

  protected setButtonDisabled(selector: string, disabled: boolean): void {
    const button = this.root.querySelector(selector) as HTMLButtonElement;
    if (button) {
      setDisabled(button, disabled);
    }
  }

  protected toggleClass(selector: string, className: string, condition: boolean): void {
    const element = this.root.querySelector(selector);
    if (element) {
      element.classList.toggle(className, condition);
    }
  }

  protected addEventListener(selector: string, event: string, handler: (e?: Event) => void): void {
    const element = this.root.querySelector(selector);
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  protected setAttribute(selector: string, attribute: string, value: string): void {
    const element = this.root.querySelector(selector);
    if (element) {
      element.setAttribute(attribute, value);
    }
  }

  protected setInputValue(selector: string, value: string): void {
    const input = this.root.querySelector(selector) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  protected getInputValue(selector: string): string {
    const input = this.root.querySelector(selector) as HTMLInputElement;
    return input ? input.value : '';
  }

  protected hasClass(selector: string, className: string): boolean {
    const element = this.root.querySelector(selector);
    return element ? element.classList.contains(className) : false;
  }
}
