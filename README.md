# Relax Map — Backend

Бекенд для веб-застосунку Relax Map — платформи для пошуку місць відпочинку в Україні з реальними фото та відгуками мандрівників.

## 📌 Про проєкт

Relax Map допомагає користувачам знаходити перевірені локації для відпочинку за типом, регіоном та іншими критеріями. Основні можливості:

- реєстрація та авторизація користувачів (з підтвердженням через email, скиданням пароля);
- завантаження зображень локацій (через Cloudinary);
- фільтрація місць за типом, регіоном, наявністю зручностей;
- відгуки та оцінки від спільноти користувачів.

Цей репозиторій містить серверну частину (REST API), яка обробляє автентифікацію, роботу з базою даних та завантаження медіафайлів.

## 🛠 Технології

- Node.js
- Express 5
- MongoDB + Mongoose
- JSON Web Token (jsonwebtoken), bcrypt
- Multer + Cloudinary

## 🚀 Запуск проєкту локально

1. Clone the project

```bash
  git clone https://github.com/VadymHromyk/project-favorite-01_BE
```

2. Go to the project directory

```bash
  cd project-favorite-01_BE
```

3. Install dependencies

```bash
  npm install
```

4. Create .env file in the root of the project and add the variables

5. Start the server

```bash
  npm run dev
```

## 📡 Ендпоінти локацій

- `POST /locations` — приватний, потребує авторизації. Приймає multipart/form-data (`name`, `type`, `region`, `description`, файл `image` — jpg/png до 1MB), завантажує зображення в Cloudinary і створює нову локацію.
- `GET /locations/:id` — публічний, повертає одну локацію за її ObjectId.
