# GymStart — Backend

REST API built with **Laravel 11** (PHP 8.2) backed by **PostgreSQL**.

## Requirements

- PHP ≥ 8.2
- Composer ≥ 2
- PostgreSQL ≥ 15

## Setup

```bash
composer install
cp .env.example .env
# Edit .env: set DB_DATABASE, DB_USERNAME, DB_PASSWORD
php artisan key:generate
php artisan serve          # starts dev server at http://localhost:8000
```

## Project Structure

```
backend/
├── app/
│   ├── Http/Controllers/    # HTTP layer — thin, delegates to Services
│   │   ├── Controller.php   # Abstract base controller
│   │   ├── UserController.php
│   │   ├── WorkoutPlanController.php
│   │   ├── MealPlanController.php
│   │   └── ProfileController.php
│   ├── Models/              # Eloquent ORM models
│   │   ├── User.php
│   │   ├── WorkoutPlan.php
│   │   └── MealPlan.php
│   └── Services/            # Business logic (no HTTP coupling)
│       ├── UserService.php
│       ├── WorkoutPlanService.php
│       └── MealPlanService.php
├── routes/
│   └── api.php              # All /api/* routes
├── composer.json
└── .env.example
```

## API Endpoints

| Method | Path                  | Description                |
|--------|-----------------------|----------------------------|
| POST   | /api/user/onboarding  | Submit onboarding data     |
| GET    | /api/workout-plan     | Get user's workout plan    |
| GET    | /api/meal-plan        | Get user's meal plan       |
| GET    | /api/profile          | Get user's profile         |

See [`/docs/API.md`](../docs/API.md) for full request/response details.

## Design Principles

- **Controllers are thin** — validate input, call a Service, return a response.
- **Services contain business logic** — no HTTP Request/Response objects.
- **Models are data containers** — relationships, casts, and scopes only.
