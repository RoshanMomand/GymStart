# GymStart — API Reference V2

Base URL: `http://localhost:8000/api`

All protected routes require a Sanctum Bearer token:
```
Authorization: Bearer <token>
```

---

## Authentication

### POST `/register`

Register a new user account.

**Auth required:** No

**Request:**
```json
{
  "name": "Roshan Momand",
  "email": "roshan@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response `200`:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Roshan Momand",
      "email": "roshan@example.com",
      "created_at": "2026-06-02T10:00:00.000000Z",
      "updated_at": "2026-06-02T10:00:00.000000Z"
    },
    "token": "1|abc123..."
  }
}
```

---

### POST `/login`

Authenticate an existing user.

**Auth required:** No

**Request:**
```json
{
  "email": "roshan@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Roshan Momand",
      "email": "roshan@example.com"
    },
    "token": "2|xyz456..."
  }
}
```

---

### POST `/logout`

Invalidate the current token.

**Auth required:** Yes

**Response `200`:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Onboarding

### GET `/onboarding`

Check onboarding status (public, used on app start).

**Auth required:** No

**Response `200`:**
```json
{
  "onboarding_required": true
}
```

---

### POST `/onboarding`

Submit the full onboarding form. Creates a `user_profile` record and generates the initial meal plan.

**Auth required:** Yes

**Request:**
```json
{
  "gender": "male",
  "age": 25,
  "height_cm": 180,
  "weight_kg": 80.0,
  "fitness_goal": "build_muscle",
  "experience_level": "intermediate",
  "activity_level": "moderate",
  "training_days": 4,
  "meals_per_day": 4,
  "workout_preference": "gym",
  "food_preferences": ["Chicken", "Rice", "Broccoli"],
  "dietary_preferences": ["Omnivore"],
  "allergies": [],
  "food_dislikes": ["Dairy"]
}
```

**Validation rules:**

| Field                | Rule                                                              |
|----------------------|-------------------------------------------------------------------|
| `gender`             | required, `male`/`female`/`other`                                 |
| `age`                | required, integer, min 10, max 100                                |
| `height_cm`          | required, integer, min 50, max 300                                |
| `weight_kg`          | required, numeric, min 20, max 500                                |
| `fitness_goal`       | required, `lose_weight`/`build_muscle`/`maintain`                 |
| `experience_level`   | required, `beginner`/`intermediate`/`advanced`                    |
| `activity_level`     | required, `sedentary`/`light`/`moderate`/`active`/`very_active`   |
| `training_days`      | required, integer, min 1, max 7                                   |
| `meals_per_day`      | nullable, integer, min 3, max 5                                   |
| `workout_preference` | required, `gym`/`home`/`outdoor`                                  |
| `food_preferences`   | required, array, min 1 item                                       |
| `dietary_preferences`| nullable, array                                                   |
| `allergies`          | nullable, array                                                   |
| `food_dislikes`      | nullable, array                                                   |

**Response `200`:**
```json
{
  "message": "Onboarding completed successfully",
  "data": {
    "user_id": 1,
    "profile": {
      "age": 25,
      "gender": "male",
      "weight_kg": 80.0,
      "height_cm": 180,
      "fitness_goal": "build_muscle",
      "experience_level": "intermediate",
      "training_days": 4,
      "meals_per_day": 4,
      "activity_level": "moderate",
      "workout_preference": "gym",
      "food_preferences": ["Chicken", "Rice", "Broccoli"],
      "dietary_preferences": ["Omnivore"],
      "allergies": [],
      "food_dislikes": ["Dairy"],
      "onboarding_completed": true
    }
  }
}
```

---

### GET `/onboarding/profile`

Retrieve the authenticated user's full profile data.

**Auth required:** Yes

**Response `200`:**
```json
{
  "data": {
    "age": 25,
    "gender": "male",
    "weight_kg": 80.0,
    "height_cm": 180,
    "fitness_goal": "build_muscle",
    "experience_level": "intermediate",
    "training_days": 4,
    "meals_per_day": 4,
    "activity_level": "moderate",
    "workout_preference": "gym",
    "food_preferences": ["Chicken", "Rice", "Broccoli"],
    "dietary_preferences": ["Omnivore"],
    "allergies": [],
    "food_dislikes": ["Dairy"],
    "onboarding_completed": true
  }
}
```

---

## Profile

### GET `/profile`

Retrieve the user's profile summary (name, email + user_profile fields).

**Auth required:** Yes

**Response `200`:**
```json
{
  "data": {
    "id": 1,
    "name": "Roshan Momand",
    "email": "roshan@example.com",
    "profile": {
      "age": 25,
      "gender": "male",
      "weight_kg": 80.0,
      "height_cm": 180,
      "fitness_goal": "build_muscle",
      "experience_level": "intermediate",
      "training_days": 4,
      "meals_per_day": 4,
      "activity_level": "moderate",
      "workout_preference": "gym",
      "food_preferences": ["Chicken", "Rice", "Broccoli"],
      "dietary_preferences": ["Omnivore"],
      "allergies": [],
      "food_dislikes": ["Dairy"]
    }
  }
}
```

---

### PATCH `/profile/name`

Update the user's display name.

**Auth required:** Yes

**Request:**
```json
{
  "name": "Roshan M."
}
```

**Response `200`:**
```json
{
  "message": "Name updated successfully",
  "data": {
    "name": "Roshan M."
  }
}
```

---

### PATCH `/profile`

Partially update the user profile. All fields are optional.

**Auth required:** Yes

**Request (all fields optional):**
```json
{
  "workout_preference": "home",
  "training_days": 5,
  "food_preferences": ["Salmon", "Quinoa"],
  "dietary_preferences": ["Pescatarian"],
  "allergies": ["Nut-free"],
  "food_dislikes": ["Dairy"]
}
```

**Response `200`:**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "workout_preference": "home",
    "training_days": 5,
    "food_preferences": ["Salmon", "Quinoa"],
    "dietary_preferences": ["Pescatarian"],
    "allergies": ["Nut-free"],
    "food_dislikes": ["Dairy"]
  }
}
```

---

### PATCH `/profile/weight`

Update the user's body weight.

**Auth required:** Yes

**Request:**
```json
{
  "weight_kg": 78.5
}
```

**Response `200`:**
```json
{
  "message": "Weight updated successfully",
  "data": {
    "weight_kg": 78.5
  }
}
```

---

## Meal Plans

### GET `/mealplans`

Retrieve the user's current active meal plan with all meals and foods.

**Auth required:** Yes

**Response `200`:**
```json
{
  "data": {
    "id": 1,
    "goal": "build_muscle",
    "generated_at": "2026-06-02T10:00:00.000000Z",
    "daily_targets": {
      "calories": 3200,
      "protein": 240,
      "carbs": 400,
      "fats": 71
    },
    "day_types": [
      {
        "type": "training",
        "calories": 3520,
        "protein": 264,
        "carbs": 440,
        "fats": 78,
        "meals": [
          {
            "slot": 1,
            "meal_name": "Meal 1",
            "type": "standard",
            "calories": 880,
            "protein": 66,
            "carbs": 110,
            "fats": 20,
            "foods": [
              {
                "name": "Chicken Breast",
                "grams": 250,
                "calories": 413,
                "protein": 77,
                "carbs": 0,
                "fats": 9
              }
            ]
          },
          {
            "slot": 2,
            "meal_name": "Pre-Workout",
            "type": "pre_workout",
            "calories": 880,
            "protein": 66,
            "carbs": 110,
            "fats": 20,
            "foods": []
          }
        ]
      },
      {
        "type": "rest",
        "calories": 3200,
        "meals": []
      }
    ]
  }
}
```

---

### POST `/mealplans/generate`

Generate a new meal plan based on the user's current profile. Replaces the existing plan.

**Auth required:** Yes

**Request:** *(no body required)*

**Response `200`:** Same structure as `GET /mealplans`.

---

## Workout Plans

### GET `/workout-plans`

Retrieve the user's current workout plan.

**Auth required:** Yes

**Response `200`:**
```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "exercises": [
      {
        "id": "0001",
        "name": "Barbell Squat",
        "bodyPart": "upper legs",
        "equipment": "barbell",
        "target": "quads",
        "gifUrl": "https://..."
      }
    ],
    "notes": null,
    "is_active": true
  }
}
```

---

### POST `/workout-plans`

Store or update the user's workout plan.

**Auth required:** Yes

**Request:**
```json
{
  "exercises": ["0001", "0002", "0015"],
  "notes": "Focus on compound movements"
}
```

**Response `200`:**
```json
{
  "message": "Workout plan saved successfully",
  "data": {
    "exercises": ["0001", "0002", "0015"],
    "notes": "Focus on compound movements",
    "is_active": true
  }
}
```

---

## Foods

### GET `/foods/search`

Search for foods by name (public, no auth required). Used during onboarding food preferences step.

**Auth required:** No

**Query params:**

| Param | Type   | Description          |
|-------|--------|----------------------|
| `q`   | string | Search term (min 2 chars) |

**Example:** `GET /foods/search?q=chicken`

**Response `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Chicken Breast",
      "calories": 165,
      "protein": 31,
      "carbs": 0,
      "fats": 4,
      "source": "seed"
    }
  ]
}
```

---

## Error Responses

| Status | Meaning                                  |
|--------|------------------------------------------|
| `401`  | Unauthenticated — missing/invalid token  |
| `403`  | Forbidden — insufficient permissions     |
| `404`  | Resource not found                       |
| `422`  | Validation error — check `errors` key    |
| `500`  | Server error                             |

**Example `422`:**
```json
{
  "message": "The meals per day field must be at least 3.",
  "errors": {
    "meals_per_day": ["The meals per day field must be at least 3."]
  }
}
```
