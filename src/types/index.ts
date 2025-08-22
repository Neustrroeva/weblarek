export type ID = string;
export type Nullable<T> = T | null;

// Товары (API и UI)

export type ProductCategory = string;

export interface IProductApi {
  id: ID;
  title: string;
  description: string;
  category: ProductCategory;
  image: string;
  price: Nullable<number>; // null = «Бесценно»
}

export interface IProduct {
  id: ID;
  title: string;
  description: string;
  category: ProductCategory;
  image?: string;
  price: Nullable<number>;
  priceLabel: string; // для отображения («750 синапсов» / «Бесценно»)
}

// Обёртка списочных ответов API
export interface ApiListResponse<T> {
  total: number;
  items: T[];
}

// Корзина

export interface IBasketItem {
  id: ID;
  title: string;
  price: Nullable<number>;
}

export interface IBasketState {
  items: IBasketItem[];
  total: number;
  canOrder: boolean;
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

export interface IOrderRequest {
  items: ID[];
  total: number;
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderResponseApi {
  id: ID;
  total: number;
}

// Валидация форм

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface IValidationResult<T> {
  valid: boolean;
  errors: FormErrors<T>;
}

// События приложения (для брокера событий)

export type AppEvent =
  | 'app:init'
  | 'catalog:loaded'
  | 'catalog:load-error'
  | 'product:select'
  | 'modal:open'
  | 'modal:close'
  | 'basket:open'
  | 'basket:add'
  | 'basket:remove'
  | 'basket:updated'
  | 'order:open'
  | 'order:fill-step1'
  | 'order:fill-step2'
  | 'order:validate'
  | 'order:submit'
  | 'order:success'
  | 'order:error'
  | 'form:errors'
  | 'form:valid';

// Карта полезных нагрузок событий
export interface EventPayloadMap {
  'app:init': undefined;

  'catalog:loaded': { items: IProduct[] };
  'catalog:load-error': { message: string; error?: unknown };

  'product:select': { id: ID };

  'modal:open': { content: HTMLElement };
  'modal:close': undefined;

  'basket:open': undefined;
  'basket:add': { id: ID };
  'basket:remove': { id: ID };
  'basket:updated': IBasketState;

  'order:open': undefined;
  'order:fill-step1': IOrderPart1;
  'order:fill-step2': IOrderPart2;
  'order:validate': undefined;
  'order:submit': IOrderRequest;
  'order:success': { orderId: ID; total: number };
  'order:error': { message: string; error?: unknown };

  'form:errors': { errors: Partial<Record<keyof (IOrderPart1 & IOrderPart2), string>> };
  'form:valid': { step: 1 | 2; isValid: boolean };
}

// Конфигурация окружения

export interface EnvConfig {
  API_ORIGIN: string; // без завершающего слэша
}
