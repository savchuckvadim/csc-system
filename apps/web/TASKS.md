# Frontend Development Tasks

## Обзор проекта

Создание форм регистрации и логина с использованием FSD архитектуры, React Hook Form, Zod, TanStack Query и API клиента.

## Этап 1: Подготовка инфраструктуры

### 1.1 Установка зависимостей

- [ ] `react-hook-form`
- [ ] `@hookform/resolvers` (для Zod)
- [ ] `zod`
- [ ] `react-signature-canvas` (для подписи)
- [ ] `@tanstack/react-query` (уже установлен)
- [ ] `next-intl` или `i18next` (для мультиязычности)
- [ ] `react-dropzone` (для загрузки файлов)

### 1.2 Настройка i18n

- [ ] Создать структуру переводов (ru, en, es)
- [ ] Настроить провайдер языков
- [ ] Создать хуки для использования переводов

### 1.3 Настройка API клиента

- [ ] Проверить генерацию API клиента
- [ ] Создать конфигурацию axios для API
- [ ] Настроить interceptors для токенов

## Этап 2: Создание FSD структуры

### 2.1 Структура папок

```
apps/web/
├── app/                    # Next.js app router
├── shared/                 # Переиспользуемые компоненты и утилиты
│   ├── ui/                 # Базовые UI компоненты
│   │   ├── card/
│   │   ├── input/
│   │   ├── field/
│   │   ├── button/
│   │   └── signature-canvas/
│   ├── lib/                # Утилиты
│   │   ├── utils.ts
│   │   ├── api.ts
│   │   └── validations.ts
│   └── config/             # Конфигурация
│       ├── routes.ts
│       └── i18n.ts
├── entities/               # Бизнес-сущности
│   └── user/
│       ├── model/
│       └── ui/
├── features/               # Функциональные возможности
│   ├── auth/
│   │   ├── login/
│   │   │   ├── ui/
│   │   │   └── model/
│   │   └── register/
│   │       ├── ui/
│   │       └── model/
│   └── file-upload/
│       ├── ui/
│       └── model/
└── widgets/                # Композитные блоки
    ├── header/
    │   ├── ui/
    │   └── model/
    └── auth-forms/
        ├── ui/
        └── model/
```

### 2.2 Создание базовых компонентов в shared/ui

- [ ] `Card` - карточка с настраиваемыми padding, border, height
- [ ] `Input` - базовый инпут с типизацией и ...rest
- [ ] `Field` - обертка для поля с label, error, helper text
- [ ] `SignatureCanvas` - компонент для рисования подписи
- [ ] `FileUpload` - компонент для загрузки файлов

## Этап 3: Централизованные стили и тема

### 3.1 Конфигурация темы

- [x] Тема управляется через CSS переменные в `@workspace/ui/src/styles/globals.css`
    - Border radius: `--radius`
    - Цвета: `--background`, `--foreground`, `--primary`, и т.д.
    - Все значения настраиваются через CSS переменные в UI пакете

### 3.2 Обновление UI пакета

- [ ] Добавить варианты размеров для Card
- [ ] Добавить варианты размеров для Input
- [ ] Создать токены для spacing и borders

## Этап 4: Форма логина

### 4.1 Создание схемы валидации (Zod)

- [ ] Схема для логина (email, password)
- [ ] Использование DTO из API клиента

### 4.2 UI компоненты

- [ ] `features/auth/login/ui/login-form.tsx` (< 50 строк)
- [ ] Разбить на мелкие компоненты:
    - `login-form-header.tsx`
    - `login-form-fields.tsx`
    - `login-form-footer.tsx`

### 4.3 Модель (TanStack Query)

- [ ] Хук `useLoginMutation`
- [ ] Обработка ошибок
- [ ] Редирект после успешного логина

### 4.4 Интеграция

- [ ] Создать страницу `/login`
- [ ] Подключить переводы
- [ ] Добавить обработку состояний (loading, error)

## Этап 5: Форма регистрации

### 5.1 Создание схемы валидации (Zod)

- [ ] Полная схема регистрации со всеми полями:
    - name, surname, email, phone, date
    - documentType, documentNumber
    - documentFirst, documentSecond (файлы)
    - signature (base64 строка)
    - password, repeatPassword
    - isMedical, isRecreation, isMj
- [ ] Кастомные валидации:
    - Совпадение паролей
    - Минимум один тип потребления выбран
    - Валидация файлов (размер, тип)
    - Валидация подписи (не пустая)

### 5.2 Компоненты формы

- [ ] `features/auth/register/ui/register-form.tsx` (контейнер)
- [ ] Разбить на секции (< 50 строк каждая):
    - `register-form-header.tsx`
    - `register-form-personal-info.tsx` (name, surname, email, phone, date)
    - `register-form-documents.tsx` (documentType, documentNumber, files)
    - `register-form-signature.tsx`
    - `register-form-password.tsx`
    - `register-form-status.tsx` (checkboxes)
    - `register-form-footer.tsx`

### 5.3 Компонент подписи

- [ ] `shared/ui/signature-canvas/signature-canvas.tsx`
- [ ] Функционал:
    - Рисование мышью/тачем
    - Очистка
    - Экспорт в base64
    - Валидация (не пустая)

### 5.4 Компонент загрузки файлов

- [ ] `features/file-upload/ui/file-upload-field.tsx`
- [ ] Функционал:
    - Drag & drop
    - Превью изображения
    - Валидация размера и типа
    - Удаление файла
    - Показ прогресса

### 5.5 Модель (TanStack Query)

- [ ] Хук `useRegisterMutation`
- [ ] Загрузка файлов через Storage API
- [ ] Создание FormData для отправки
- [ ] Обработка ошибок

### 5.6 Интеграция

- [ ] Создать страницу `/register`
- [ ] Подключить все компоненты
- [ ] Добавить переводы для всех полей
- [ ] Обработка состояний

## Этап 6: Рефакторинг существующих компонентов

### 6.1 Header

- [ ] Разбить на мелкие компоненты:
    - `widgets/header/ui/header-logo.tsx`
    - `widgets/header/ui/header-nav.tsx`
    - `widgets/header/ui/header-actions.tsx`
- [ ] Добавить переключатель языков
- [ ] Улучшить переключатель темы
- [ ] Использовать централизованные стили

### 6.2 Home Page

- [ ] Создать полноэкранный Hero:
    - Фон на всю ширину
    - Контейнер для контента (ограниченная ширина)
    - Красивые градиенты и эффекты
- [ ] Разбить на компоненты:
    - `widgets/hero/ui/hero-section.tsx`
    - `widgets/hero/ui/hero-content.tsx`
    - `widgets/about/ui/about-section.tsx`

### 6.3 Footer

- [ ] Разбить на мелкие компоненты
- [ ] Добавить переводы

## Этап 7: Мультиязычность

### 7.1 Структура переводов

```
shared/config/i18n/
├── locales/
│   ├── ru/
│   │   ├── common.json
│   │   ├── auth.json
│   │   └── validation.json
│   ├── en/
│   └── es/
```

### 7.2 Переводы для форм

- [ ] Все labels и placeholders
- [ ] Сообщения об ошибках валидации
- [ ] Кнопки и ссылки
- [ ] Успешные сообщения

### 7.3 Интеграция

- [ ] Провайдер i18n в layout
- [ ] Хуки для использования переводов
- [ ] Переключатель языков в header

## Этап 8: Интеграция с API

### 8.1 Настройка API клиента

- [ ] Создать instance axios
- [ ] Настроить base URL
- [ ] Добавить interceptors для токенов
- [ ] Обработка ошибок

### 8.2 Использование DTO

- [ ] Импорт типов из `@workspace/api-client/generated`
- [ ] Типизация форм через DTO
- [ ] Валидация через Zod на основе DTO

### 8.3 Mutations и Queries

- [ ] `useLoginMutation` - использует API клиент
- [ ] `useRegisterMutation` - использует API клиент
- [ ] `useFileUploadMutation` - для загрузки файлов
- [ ] Кеширование и инвалидация

## Этап 9: Тестирование и полировка

### 9.1 Тестирование форм

- [ ] Валидация всех полей
- [ ] Обработка ошибок API
- [ ] Успешные сценарии
- [ ] Загрузка файлов
- [ ] Рисование подписи

### 9.2 Адаптивность

- [ ] Мобильная версия форм
- [ ] Планшеты
- [ ] Десктоп

### 9.3 Доступность

- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader support

## Приоритет выполнения

1. **Этап 1-2**: Инфраструктура и структура (КРИТИЧНО)
2. **Этап 3**: Централизованные стили (ВАЖНО)
3. **Этап 4**: Форма логина (БЫСТРЫЙ WIN)
4. **Этап 5**: Форма регистрации (САМОЕ СЛОЖНОЕ)
5. **Этап 6**: Рефакторинг (УЛУЧШЕНИЕ)
6. **Этап 7**: Мультиязычность (ПО ВСЕМУ ПРОЕКТУ)
7. **Этап 8**: API интеграция (ПАРАЛЛЕЛЬНО С 4-5)
8. **Этап 9**: Тестирование (ФИНАЛЬНЫЙ)

## Технические детали

### Компоненты должны быть:

- Максимум 50 строк кода
- Типизированы с TypeScript
- Использовать ...rest для пропсов
- Следовать FSD архитектуре
- Иметь переводы

### Стили:

- Использовать Tailwind CSS
- Централизованные токены для spacing, borders, heights
- Поддержка темной/светлой темы
- Адаптивный дизайн

### Валидация:

- Zod схемы на основе DTO
- Кастомные сообщения об ошибках
- Переводы для ошибок

### API:

- Использовать сгенерированный клиент
- TanStack Query для состояния
- Правильная обработка ошибок
- Loading states
