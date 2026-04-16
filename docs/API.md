# GymStart — API Reference

All endpoints are prefixed with `/api`.

---

## Authentication

Sanctum Bearer-token authentication is used for protected routes.

```
Authorization: Bearer <token>
```

---

## Endpoints

### POST `/api/user/onboarding`

Submit user onboarding data to create / configure a user account.

**Auth required:** No (public)

**Request body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "age": "integer",
  "weight_kg": "number",
  "height_cm": "number",
  "fitness_goal": "string (lose_weight | build_muscle | maintain)"
}
```

**Response `201`:**

```json
{
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

### GET `/api/workout-plan`

Retrieve the authenticated user's personalised workout plan.

**Auth required:** Yes

**Response `200`:**

```json
{
  "data": {
    "id": 1,
    "title": "Beginner Strength Plan",
    "user_id": 1
  }
}
```

---

### GET `/api/meal-plan`

Retrieve the authenticated user's personalised meal plan.

**Auth required:** Yes

**Response `200`:**

```json
{
  "data": {
    "id": 1,
    "title": "Balanced Nutrition Plan",
    "daily_calories": 2200,
    "user_id": 1
  }
}
```

---

### GET `/api/profile`

Retrieve the authenticated user's profile.

**Auth required:** Yes

**Response `200`:**

```json
{
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 22,
    "weight_kg": 65.0,
    "height_cm": 168,
    "fitness_goal": "build_muscle"
  }
}
```

---

## Error Responses

| Status | Meaning                                 |
|--------|-----------------------------------------|
| 400    | Validation error — check `errors` key  |
| 401    | Unauthenticated — missing/invalid token |
| 404    | Resource not found                      |
| 422    | Unprocessable entity                    |
| 500    | Server error                            |

**Example validation error `422`:**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```
