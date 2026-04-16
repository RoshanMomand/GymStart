# GymStart — Project Architecture

## Overview

GymStart is a **mobile-first fitness app** built as a monorepo containing:

| Package    | Technology               | Location     |
|------------|--------------------------|--------------|
| Mobile app | React Native (Expo) + TS | `/frontend`  |
| REST API   | Laravel 11 (PHP 8.2)     | `/backend`   |
| Database   | PostgreSQL               | (cloud/local)|

---

## Monorepo Structure

```
GymStart/
├── frontend/                    # React Native Expo app
│   ├── App.tsx                  # Entry point
│   ├── app.json                 # Expo config
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── screens/             # Screen-level components
│       │   ├── HomeScreen.tsx
│       │   ├── WorkoutPlanScreen.tsx
│       │   ├── MealPlanScreen.tsx
│       │   └── ProfileScreen.tsx
│       ├── navigation/          # React Navigation config
│       │   └── AppNavigator.tsx
│       ├── services/            # API call wrappers (axios)
│       │   ├── api.ts           # Axios client
│       │   ├── userService.ts
│       │   ├── workoutPlanService.ts
│       │   └── mealPlanService.ts
│       ├── types/               # TypeScript interfaces & param lists
│       │   ├── index.ts
│       │   └── navigation.ts
│       └── utils/               # Pure helper functions
│           └── index.ts
│
├── backend/                     # Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/    # HTTP controllers
│   │   │   ├── Controller.php   # Base controller
│   │   │   ├── UserController.php
│   │   │   ├── WorkoutPlanController.php
│   │   │   ├── MealPlanController.php
│   │   │   └── ProfileController.php
│   │   ├── Models/              # Eloquent models
│   │   │   ├── User.php
│   │   │   ├── WorkoutPlan.php
│   │   │   └── MealPlan.php
│   │   └── Services/            # Business logic layer
│   │       ├── UserService.php
│   │       ├── WorkoutPlanService.php
│   │       └── MealPlanService.php
│   ├── routes/
│   │   └── api.php              # API route definitions
│   ├── composer.json
│   └── .env.example
│
└── docs/                        # Project documentation
    ├── ARCHITECTURE.md          # (this file)
    ├── API.md                   # API reference
    └── DATABASE_SCHEMA.md       # PostgreSQL schema
```

---

## Data Flow

```
Mobile App (React Native)
        │
        │  HTTP / JSON (axios)
        ▼
Laravel API  (/api/*)
        │
        │  Eloquent ORM
        ▼
   PostgreSQL DB
```

### Request Lifecycle (Laravel)

1. `routes/api.php` matches the incoming URL
2. The matching **Controller** method is invoked
3. The Controller delegates business logic to a **Service**
4. The Service interacts with **Models** (Eloquent)
5. A JSON response is returned to the client

---

## Authentication

Laravel Sanctum is used for API token authentication.

- Mobile app stores the token in secure storage after login / onboarding
- Every protected request sends `Authorization: Bearer <token>`
- Routes inside `auth:sanctum` middleware are protected

---

## Environment Configuration

| File                          | Purpose                                  |
|-------------------------------|------------------------------------------|
| `backend/.env.example`        | Template — copy to `.env` and fill in    |
| `frontend/app.json`           | Expo / React Native config               |
| `EXPO_PUBLIC_API_URL` env var | Backend URL used by the Axios client     |
