# GymStart — PostgreSQL Database Schema

This document describes the proposed schema for the GymStart PostgreSQL database.
**Migrations and seeders are not included here** — they will be added in a later step.

---

## Table: `users`

Stores app user accounts and onboarding profile data.

| Column          | Type                        | Constraints                  | Description                                      |
|-----------------|-----------------------------|------------------------------|--------------------------------------------------|
| `id`            | `BIGSERIAL`                 | PRIMARY KEY                  | Auto-incrementing user identifier                |
| `name`          | `VARCHAR(255)`              | NOT NULL                     | Display name                                     |
| `email`         | `VARCHAR(255)`              | NOT NULL, UNIQUE             | LoginScreen email address                              |
| `password`      | `VARCHAR(255)`              | NOT NULL                     | Bcrypt-hashed password                           |
| `age`           | `SMALLINT`                  | NULLABLE                     | User's age (collected during onboarding)         |
| `weight_kg`     | `NUMERIC(5,2)`              | NULLABLE                     | Body weight in kilograms                         |
| `height_cm`     | `SMALLINT`                  | NULLABLE                     | Height in centimetres                            |
| `fitness_goal`  | `VARCHAR(50)`               | NULLABLE                     | `lose_weight`, `build_muscle`, or `maintain`     |
| `remember_token`| `VARCHAR(100)`              | NULLABLE                     | Laravel "remember me" token                      |
| `created_at`    | `TIMESTAMP WITH TIME ZONE`  | NOT NULL, DEFAULT NOW()      | Record creation timestamp                        |
| `updated_at`    | `TIMESTAMP WITH TIME ZONE`  | NOT NULL, DEFAULT NOW()      | Last update timestamp                            |

---

## Table: `workout_plans`

Stores a personalised workout plan for each user.

| Column        | Type                        | Constraints                              | Description                                      |
|---------------|-----------------------------|------------------------------------------|--------------------------------------------------|
| `id`          | `BIGSERIAL`                 | PRIMARY KEY                              | Auto-incrementing plan identifier                |
| `user_id`     | `BIGINT`                    | NOT NULL, FK → `users(id)` ON DELETE CASCADE | Owner of this plan                         |
| `title`       | `VARCHAR(255)`              | NOT NULL                                 | Human-readable plan title                        |
| `description` | `TEXT`                      | NULLABLE                                 | Optional longer description                      |
| `difficulty`  | `VARCHAR(50)`               | NULLABLE                                 | `beginner`, `intermediate`, or `advanced`        |
| `days_per_week`| `SMALLINT`                 | NULLABLE                                 | Number of training days per week                 |
| `created_at`  | `TIMESTAMP WITH TIME ZONE`  | NOT NULL, DEFAULT NOW()                  | Record creation timestamp                        |
| `updated_at`  | `TIMESTAMP WITH TIME ZONE`  | NOT NULL, DEFAULT NOW()                  | Last update timestamp                            |

---

## Table: `meal_plans`

Stores a personalised meal plan for each user.

| Column           | Type                        | Constraints                              | Description                                      |
|------------------|-----------------------------|------------------------------------------|--------------------------------------------------|
| `id`             | `BIGSERIAL`                 | PRIMARY KEY                              | Auto-incrementing plan identifier                |
| `user_id`        | `BIGINT`                    | NOT NULL, FK → `users(id)` ON DELETE CASCADE | Owner of this plan                         |
| `title`          | `VARCHAR(255)`              | NOT NULL                                 | Human-readable plan title                        |
| `description`    | `TEXT`                      | NULLABLE                                 | Optional longer description                      |
| `daily_calories` | `INTEGER`                   | NULLABLE                                 | Target daily calorie intake                      |
| `protein_g`      | `NUMERIC(6,2)`              | NULLABLE                                 | Daily protein target in grams                    |
| `carbs_g`        | `NUMERIC(6,2)`              | NULLABLE                                 | Daily carbohydrate target in grams               |
| `fat_g`          | `NUMERIC(6,2)`              | NULLABLE                                 | Daily fat target in grams                        |
| `created_at`     | `TIMESTAMP WITH TIME ZONE`  | NOT NULL, DEFAULT NOW()                  | Record creation timestamp                        |
| `updated_at`     | `TIMESTAMP WITH TIME ZONE`  | NOT NULL, DEFAULT NOW()                  | Last update timestamp                            |

---

## Relationships

```
users (1) ──────< workout_plans (N)   [user_id FK]
users (1) ──────< meal_plans    (N)   [user_id FK]
```

> Each user can have multiple workout plans and meal plans over time (e.g. when
> goals change), though typically one active plan per type is displayed in the app.
