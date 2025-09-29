# Web‑ларёк

Интернет-магазин с товарами для веб-разработчиков и двухшаговым оформлением заказа.

## Стек технологий

- **TypeScript 5** — строгая типизация
- **Vite** — сборщик и dev-сервер с HMR
- **SCSS** — стили по методологии БЭМ
- **ESLint + Prettier** — линтинг и форматирование кода
- Собственная **событийная шина** (`EventEmitter`)
- HTTP-клиент на базе `Api`/`ShopApi`

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Разработка (http://localhost:3000)
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр собранного проекта
npm run preview

# Линтинг и форматирование
npm run lint
npm run format
```

## Структура проекта

```
src/
├── components/base/ # Базовые классы
│ ├── Component.ts # Базовый класс для компонентов
│ ├── Form.ts # Базовый класс для форм
│ ├── ProductCard.ts # Базовый класс для карточек товаров
│ ├── api.ts # HTTP-клиент
│ └── events.ts # Событийная шина
├── controllers/ # Контроллеры (презентеры)
│ └── app.ts # Главный контроллер приложения
├── models/ # Модели данных
│ ├── basket.ts # Модель корзины
│ ├── order.ts # Модель заказа
│ ├── OrderStep1ValidationModel.ts # Валидация 1-го шага
│ └── ContactValidationModel.ts # Валидация контактов
├── services/ # Сервисы
│ ├── modal.ts # Сервис модальных окон
│ └── shop-api.ts # API магазина
├── views/ # Представления
│ ├── MainPageView.ts # Главная страница
│ ├── CardView.ts # Карточка товара в каталоге
│ ├── ProductModalView.ts # Модальное окно товара
│ ├── BasketView.ts # Корзина
│ ├── BasketItemView.ts # Элемент корзины
│ ├── CheckoutStep1View.ts # Первый шаг оформления
│ ├── CheckoutStep2View.ts # Второй шаг оформления
│ └── OrderSuccessView.ts # Успешное оформление
├── types/ # Типы данных
│ └── index.ts # Все интерфейсы и типы
├── utils/ # Утилиты
│ ├── format.ts # Форматирование данных
│ └── ui.ts # DOM-утилиты
└── scss/ # Стили и миксины
```

## Архитектура

Проект реализован по паттерну **MVP** (Model-View-Presenter) с использованием событийной шины:

### Model (Модели)
- **BasketModel** — управление состоянием корзины
- **OrderModel** — данные заказа и базовая валидация
- **OrderStep1ValidationModel** — валидация адреса и способа оплаты
- **ContactValidationModel** — валидация email и телефона

### View (Представления)
- **MainPageView** — отображение каталога товаров
- **CardView** — карточка товара в каталоге  
- **ProductModalView** — детальная информация о товаре
- **BasketView** — содержимое корзины
- **CheckoutStep1View** — форма выбора оплаты и адреса
- **CheckoutStep2View** — форма ввода контактов
- **OrderSuccessView** — сообщение об успешном заказе

### Presenter (Контроллер)
- **AppController** — связывает модели, представления и API через события

### Базовые классы

#### Component
Базовый класс для всех компонентов интерфейса:
```typescript
class Component {
  readonly root: HTMLElement;
  
  // Методы для работы с DOM:
  // setTextContent, setDisplay, setButtonDisabled,
  // toggleClass, addEventListener, setAttribute, etc.
}
```

#### Form
Базовый класс для форм с валидацией:
```typescript  
abstract class Form<T> extends Component {
  // Автоматическая обработка submit, валидация,
  // управление состоянием кнопок
  
  abstract emitFieldChange(field: string, value: string): void;
  abstract requestValidation(): void; 
  abstract onSubmit(): void;
}
```

#### ProductCard
Базовый класс для карточек товаров:
```typescript
abstract class ProductCard extends Component {
  // Общая логика отображения товаров:
  // setProductInfo, setCategoryClass, setImage
}
```

## Основные события

```typescript
// Товары и каталог
'items:change'      // Каталог загружен
'product:select'    // Клик по товару

// Корзина  
'basket:add'        // Добавить в корзину
'basket:remove'     // Удалить из корзины
'basket:updated'    // Состояние корзины изменено
'basket:open'       // Открыть корзину

// Заказ
'order:open-step1'  // Открыть первый шаг
'order:fill-step1'  // Данные первого шага
'order:fill-step2'  // Данные второго шага
'order:success'     // Заказ успешно оформлен

// Модальные окна
'modal:open'        // Открыть модальное окно
'modal:close'       // Закрыть модальное окно

// Валидация форм
'form:validation:result'  // Результат валидации
```

## Типы данных

### Основные интерфейсы

```typescript
// Товар с сервера
interface IProductApi {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
}

// Элемент корзины
type BasketItem = Pick<IProductApi, 'id' | 'title' | 'price'>;

// Первый шаг заказа
interface IOrderPart1 {
  payment: 'card' | 'cash' | null;
  address: string;
}

// Второй шаг заказа  
interface IOrderPart2 {
  email: string;
  phone: string;
}

// Полный заказ
interface IOrderRequest extends IOrderPart1, IOrderPart2 {
  items: string[];
  total: number;
}
```

## Валидация

Валидация вынесена в отдельные модели:

- **OrderStep1ValidationModel** — проверяет адрес (мин. 5 символов) и выбор способа оплаты
- **ContactValidationModel** — проверяет email и телефон по регулярным выражениям

Модели валидации эмитят события `form:validation:result` с результатами проверки.

## Принципы разработки

1. **DRY** — дублирующийся код вынесен в базовые классы
2. **Единственная ответственность** — каждый класс решает одну задачу
3. **Событийная развязка** — компоненты общаются только через события
4. **Композиция** — `BasketView` использует `BasketItemView` для элементов
5. **Типизация** — строгие TypeScript типы без `any`

## Функциональность

- ✅ Просмотр каталога товаров
- ✅ Детальная информация о товаре  
- ✅ Добавление/удаление товаров в корзину
- ✅ Двухшаговое оформление заказа
- ✅ Валидация форм в реальном времени
- ✅ Адаптивные модальные окна
- ✅ Обработка ошибок API