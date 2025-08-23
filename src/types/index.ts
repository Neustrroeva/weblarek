// Типы данных для проекта «Веб-ларёк» (только данные, без интерфейсов классов)

export type ID = string;
export type Nullable<T> = T | null;

// Товары (API)
export type ProductCategory = string;

export interface IProductApi {
  id: ID;
  title: string;
  description: string;
  category: ProductCategory;
  image: string;
  price: Nullable<number>; // null = «Бесценно»
}

export interface ApiListResponse<T> {
  total: number;
  items: T[];
}

// Корзина
export type BasketItem = Pick<IProductApi, 'id' | 'title' | 'price'>;

export interface IBasketState {
  items: BasketItem[];
  total: number;
}

// Оформление заказа
export type PaymentMethod = 'card' | 'cash';

export interface IOrderPart1 {
  payment: PaymentMethod;
  address: string;
}

export interface IOrderPart2 {
  email: string;
  phone: string;
}

export interface IOrderRequest extends IOrderPart1, IOrderPart2 {
  items: ID[];
  total: number;
}

export interface IOrderResponseApi {
  id: ID;
  total: number;
}

// Валидация
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface IValidationResult<T> {
  valid: boolean;
  errors: FormErrors<T>;
}

// Утилиты
export type PriceFormatter = (price: IProductApi['price']) => string;

// События приложения
export type AppEvent =
  | 'app:init'
  | 'items:change'
  | 'product:select'
  | 'modal:open'
  | 'modal:close'
  | 'basket:open'
  | 'basket:add'
  | 'basket:remove'
  | 'basket:updated'
  | 'order:fill-step1'
  | 'order:fill-step2'
  | 'order:submit'
  | 'order:success'
  | 'order:error'
  | 'form:errors'
  | 'form:valid';

export interface EventPayloadMap {
  'app:init': undefined;

  'items:change': { items: IProductApi[] };

  'product:select': { id: ID };

  'modal:open': { content: HTMLElement };
  'modal:close': undefined;

  'basket:open': undefined;
  'basket:add': BasketItem;
  'basket:remove': { id: ID };
  'basket:updated': { state: IBasketState };

  'order:fill-step1': IOrderPart1;
  'order:fill-step2': IOrderPart2;
  'order:submit': IOrderRequest;
  'order:success': { orderId: ID; total: number };
  'order:error': { message: string };

  'form:errors': { errors: Partial<Record<keyof (IOrderPart1 & IOrderPart2), string>> };
  'form:valid': { step: 1 | 2; isValid: boolean };
}

// Окружение
export interface EnvConfig {
  API_ORIGIN: string;
}