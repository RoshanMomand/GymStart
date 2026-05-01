# GymStart

A mobile app that helps students start with strength training and nutrition without a personal trainer. The app provides personalised workout schedules and nutrition advice based on user data and collected fitness information, so beginners can train independently and confidently.

---

## Monorepo Structure

```
GymStart/
├── frontend/          # React Native (Expo) app — TypeScript
├── backend/           # Laravel REST API
├── docs/              # Project documentation
└── README.md
```

## Getting Started

### Frontend
```bash
cd frontend-corrupt
npm install
npx expo start
```

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

## Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React Native (Expo) |
| Language | TypeScript          |
| Backend  | Laravel (PHP)       |
| Database | PostgreSQL          |

## Documentation

See the [`/docs`](./docs/) folder for:
- [Architecture overview](./docs/ARCHITECTURE.md)
- [API reference](./docs/API.md)
- [Database schema](./docs/DATABASE_SCHEMA.md)
