# GymStart — Database Schema V2

Current production schema. PostgreSQL via Laravel migrations.

---

## Table: `users`

| Column              | Type           | Constraints          | Description                 |
|---------------------|----------------|----------------------|-----------------------------|
| `id`                | `BIGSERIAL`    | PK                   | Auto-increment              |
| `name`              | `VARCHAR(255)` | NOT NULL             | Display name                |
| `email`             | `VARCHAR(255)` | NOT NULL, UNIQUE     | Login email                 |
| `email_verified_at` | `TIMESTAMP`    | NULLABLE             | Email verification          |
| `password`          | `VARCHAR(255)` | NOT NULL             | Bcrypt-hashed               |
| `remember_token`    | `VARCHAR(100)` | NULLABLE             | Laravel remember me token   |
| `created_at`        | `TIMESTAMP`    | NOT NULL             |                             |
| `updated_at`        | `TIMESTAMP`    | NOT NULL             |                             |

---

## Table: `user_profiles`

One-to-one with `users`. Populated after onboarding is completed.

| Column                | Type                | Constraints                    | Description                                               |
|-----------------------|---------------------|--------------------------------|-----------------------------------------------------------|
| `id`                  | `BIGSERIAL`         | PK                             |                                                           |
| `user_id`             | `BIGINT`            | NOT NULL, UNIQUE, FK → `users` | CASCADE DELETE                                            |
| `age`                 | `INTEGER`           | NULLABLE                       | Age in years                                              |
| `gender`              | `ENUM`              | NULLABLE                       | `male`, `female`, `other`                                 |
| `weight_kg`           | `DECIMAL(5,2)`      | NULLABLE                       | Body weight in kg                                         |
| `height_cm`           | `SMALLINT UNSIGNED` | NULLABLE                       | Height in centimetres                                     |
| `fitness_goal`        | `ENUM`              | NULLABLE                       | `lose_weight`, `build_muscle`, `maintain`                 |
| `experience_level`    | `ENUM`              | NULLABLE                       | `beginner`, `intermediate`, `advanced`                    |
| `training_days`       | `TINYINT`           | NULLABLE                       | Days per week willing to train (1–7)                      |
| `meals_per_day`       | `TINYINT UNSIGNED`  | NOT NULL, DEFAULT 4            | Meals per day chosen during onboarding (3, 4 or 5)        |
| `activity_level`      | `ENUM`              | NULLABLE                       | `sedentary`, `light`, `moderate`, `active`, `very_active` |
| `workout_preference`  | `ENUM`              | NULLABLE                       | `gym`, `home`, `outdoor`                                  |
| `food_preferences`    | `JSON`              | NULLABLE                       | Array of preferred food names                             |
| `food_dislikes`       | `JSON`              | NULLABLE                       | Array of disliked food names                              |
| `dietary_preferences` | `JSON`              | NULLABLE                       | e.g. `["Vegetarian", "Keto"]`                             |
| `allergies`           | `JSON`              | NULLABLE                       | e.g. `["Gluten-free", "Nut-free"]`                        |
| `onboarding_completed`| `BOOLEAN`           | NOT NULL, DEFAULT false        | Set to `true` after onboarding submit                     |
| `created_at`          | `TIMESTAMP`         | NOT NULL                       |                                                           |
| `updated_at`          | `TIMESTAMP`         | NOT NULL                       |                                                           |

---

## Table: `workout_plans`

One-to-one with `users`. Stores the active workout plan with exercises from ExerciseDB.

| Column      | Type        | Constraints                    | Description                               |
|-------------|-------------|--------------------------------|-------------------------------------------|
| `id`        | `BIGSERIAL` | PK                             |                                           |
| `user_id`   | `BIGINT`    | NOT NULL, UNIQUE, FK → `users` | CASCADE DELETE                            |
| `exercises` | `JSON`      | NULLABLE                       | Array of exercise IDs from ExerciseDB API |
| `notes`     | `TEXT`      | NULLABLE                       | Additional notes                          |
| `is_active` | `BOOLEAN`   | NOT NULL, DEFAULT true         |                                           |
| `created_at`| `TIMESTAMP` | NOT NULL                       |                                           |
| `updated_at`| `TIMESTAMP` | NOT NULL                       |                                           |

---

## Table: `meal_plans`

One active plan per user. Regenerated on demand.

| Column         | Type          | Constraints             | Description                               |
|----------------|---------------|-------------------------|-------------------------------------------|
| `id`           | `BIGSERIAL`   | PK                      |                                           |
| `user_id`      | `BIGINT`      | NULLABLE, FK → `users`  | CASCADE DELETE                            |
| `goal`         | `VARCHAR(20)` | NULLABLE                | `lose_weight`, `build_muscle`, `maintain` |
| `calories`     | `INTEGER`     | NULLABLE                | Daily calorie target (rest day baseline)  |
| `protein`      | `INTEGER`     | NULLABLE                | Daily protein target in grams             |
| `carbs`        | `INTEGER`     | NULLABLE                | Daily carbs target in grams               |
| `fats`         | `INTEGER`     | NULLABLE                | Daily fats target in grams                |
| `is_active`    | `BOOLEAN`     | NOT NULL, DEFAULT true  |                                           |
| `generated_at` | `TIMESTAMP`   | NULLABLE                | When the plan was generated               |
| `created_at`   | `TIMESTAMP`   | NOT NULL                |                                           |
| `updated_at`   | `TIMESTAMP`   | NOT NULL                |                                           |

---

## Table: `meal_plan_types`

Each meal plan has exactly two types: one for training days, one for rest days.

| Column         | Type        | Constraints                 | Description                      |
|----------------|-------------|-----------------------------|----------------------------------|
| `id`           | `BIGSERIAL` | PK                          |                                  |
| `meal_plan_id` | `BIGINT`    | NOT NULL, FK → `meal_plans` | CASCADE DELETE                   |
| `type`         | `ENUM`      | NOT NULL                    | `training`, `rest`               |
| `calories`     | `INTEGER`   | NULLABLE                    | Total calories for this day type |
| `protein`      | `INTEGER`   | NULLABLE                    | Protein target in grams          |
| `carbs`        | `INTEGER`   | NULLABLE                    | Carbs target in grams            |
| `fats`         | `INTEGER`   | NULLABLE                    | Fats target in grams             |
| `created_at`   | `TIMESTAMP` | NOT NULL                    |                                  |
| `updated_at`   | `TIMESTAMP` | NOT NULL                    |                                  |

**Unique constraint:** `(meal_plan_id, type)`

---

## Table: `meals`

Individual meals within a day type. Count equals `meals_per_day` from user profile.

| Column              | Type        | Constraints                      | Description                              |
|---------------------|-------------|----------------------------------|------------------------------------------|
| `id`                | `BIGSERIAL` | PK                               |                                          |
| `meal_plan_type_id` | `BIGINT`    | NOT NULL, FK → `meal_plan_types` | CASCADE DELETE                           |
| `type`              | `ENUM`      | NOT NULL                         | `standard`, `pre_workout`, `post_workout`|
| `order_index`       | `INTEGER`   | NOT NULL                         | Display order (1-based)                  |
| `created_at`        | `TIMESTAMP` | NOT NULL                         |                                          |
| `updated_at`        | `TIMESTAMP` | NOT NULL                         |                                          |

---

## Table: `foods`

Food database. Seeded locally and supplemented via OpenFoodFacts API (results cached).

| Column        | Type        | Constraints | Description                             |
|---------------|-------------|-------------|-----------------------------------------|
| `id`          | `BIGSERIAL` | PK          |                                         |
| `external_id` | `BIGINT`    | NULLABLE    | OpenFoodFacts product ID                |
| `name`        | `VARCHAR`   | NULLABLE    | Food name                               |
| `source`      | `VARCHAR`   | NULLABLE    | `seed` (local seeder) or `api` (fetched)|
| `calories`    | `INTEGER`   | NULLABLE    | kcal per 100g                           |
| `protein`     | `INTEGER`   | NULLABLE    | Protein grams per 100g                  |
| `carbs`       | `INTEGER`   | NULLABLE    | Carbs grams per 100g                    |
| `fats`        | `INTEGER`   | NULLABLE    | Fat grams per 100g                      |
| `created_at`  | `TIMESTAMP` | NOT NULL    |                                         |
| `updated_at`  | `TIMESTAMP` | NOT NULL    |                                         |

---

## Table: `meal_items`

Junction between `meals` and `foods`. One row per food item in a meal.

| Column      | Type        | Constraints            | Description           |
|-------------|-------------|------------------------|-----------------------|
| `id`        | `BIGSERIAL` | PK                     |                       |
| `meal_id`   | `BIGINT`    | NOT NULL, FK → `meals` | CASCADE DELETE        |
| `food_id`   | `BIGINT`    | NOT NULL, FK → `foods` | CASCADE DELETE        |
| `grams`     | `INTEGER`   | NULLABLE               | Portion size in grams |
| `created_at`| `TIMESTAMP` | NOT NULL               |                       |
| `updated_at`| `TIMESTAMP` | NOT NULL               |                       |

---

## Relationships

```
users (1) ──────────────────── (1) user_profiles
users (1) ──────────────────── (1) workout_plans
users (1) ──────────────────── (N) meal_plans
  meal_plans (1) ────────────── (2) meal_plan_types  [training | rest]
    meal_plan_types (1) ──────── (N) meals
      meals (1) ────────────────── (N) meal_items
        meal_items (N) ──────────── (1) foods
```

---

## Seeders

| Seeder              | Inhoud                                            |
|---------------------|---------------------------------------------------|
| `FoodSeeder`        | ~60 veelgebruikte voedingsmiddelen met macro's per 100g |
| `MealPlanTypeSeeder`| Initiële meal plan type records                   |
