# GymStart — Context voor Claude (web)

Plak dit bestand in een nieuwe Claude-conversatie op claude.ai om snel context te geven over dit project. Dit is een schoolproject (3-jarige opleiding, huidige inschatting: ~1-1.5 jaar effectieve coding-ervaring).

## Wat is GymStart?

Een mobiele app die studenten helpt om zelfstandig te beginnen met krachttraining en voeding, zonder personal trainer. Op basis van gebruikersgegevens (doel, ervaring, voorkeuren) genereert de app een persoonlijk workout- en voedingsschema.

## Tech stack

| Laag      | Technologie                          |
|-----------|---------------------------------------|
| Frontend  | React Native (Expo) — TypeScript      |
| Backend   | Laravel 11 (PHP 8.2)                  |
| Database  | PostgreSQL                            |
| Auth      | Laravel Sanctum (Bearer token)        |
| Externe APIs | ExerciseDB (oefeningen), OpenFoodFacts (voeding) |

## Monorepo structuur

```
GymStart/
├── frontend/          # React Native (Expo) app
│   └── src/
│       ├── app/        # Screens (Expo Router-stijl, bv. index.tsx = HomeScreen)
│       ├── contexts/    # AuthContext
│       ├── types/       # TS interfaces per feature (bv. types/home.ts)
│       └── utils/        # Pure helpers + API-laag (bv. utils/homeApi.ts, utils/homeHelpers.ts)
├── backend/            # Laravel REST API
│   └── app/
│       ├── Http/Controllers/   # UserController, ProfileController, OnboardingController, WorkoutLogController
│       └── Services/           # MealPlanService, NutritionCalculatorService
└── docs/                # ARCHITECTURE.md, API_V2.md, DATABASE_SCHEMA_V2.md (bron van waarheid)
```

## Belangrijkste features (gebouwd)

1. **Onboarding** — registratie → profiel invullen (leeftijd, gewicht, doel, ervaring, voedingsvoorkeuren/allergieën) → automatisch gegenereerd voedingsplan.
2. **Voedingsplan (meal plans)** — per dag-type (training/rust) een set maaltijden met macros, opgebouwd uit een lokale food-database + OpenFoodFacts.
3. **Workout plan generator** — splits (Full Body, Upper/Lower, PPL) op basis van ervaringsniveau en doel, met 1394 oefeningen uit ExerciseDB. Workout sessions/sets kunnen gelogd worden (CRUD).
4. **Gewicht bijhouden** — `weight_logs` tabel logt elke gewichtsupdate met timestamp; `updateWeight` retourneert de delta t.o.v. de vorige meting; `GET /profile/weight-history` geeft de laatste 90 entries.
5. **Home screen** (`frontend/src/app/index.tsx`) — toont dagelijkse progress, huidig gewicht + doelgewicht, vandaag's workout, vandaag's maaltijden. Huidig in refactor (zie onder).

## Database (kern, zie docs/DATABASE_SCHEMA_V2.md voor volledig schema)

- `users` — auth
- `user_profiles` — 1-op-1 met users: leeftijd, gewicht, doel, ervaring, voedingsvoorkeuren (JSON), onboarding_completed
- `workout_plans` — 1-op-1 met users: array van exercise-IDs
- `meal_plans` → `meal_plan_types` (training/rest) → `meals` → `meal_items` → `foods`
- `weight_logs` — historie van gewichtsupdates per user

## API (zie docs/API_V2.md voor volledige reference)

Base URL: `http://localhost:8000/api`, Bearer-token auth via Sanctum.

Belangrijkste endpoints: `/register`, `/login`, `/onboarding`, `/onboarding/profile`, `/profile`, `/profile/weight` (PATCH), `/profile/weight-history`, `/mealplans`, `/mealplans/generate`, `/workout-plans`, `/foods/search`.

## Huidige werk (branch `refactoring/index-screen`)

Bezig met het opschonen van `frontend/src/app/index.tsx` (HomeScreen):
- API-calls verplaatst naar `utils/homeApi.ts` (fetchProfile, fetchMealPlan, updateWeight) — losse functies, geen state.
- State, AsyncStorage en validatie blijven in het component (`loadAll`, `handleUpdateWeight`).
- Korte/onduidelijke variabelenamen vervangen door volledige namen (bv. `ts` → `weightUpdatedAt`, `d` → `dayType`, `greenBtn` → `greenButton`).
- Gewicht wordt afgerond (zie `formatWeight` in `utils/homeHelpers.ts`) zodat er geen lange decimale invoer doorslaat naar de UI/opslag.

## Hoe ik (de gebruiker) graag werk — belangrijk voor hoe Claude moet reageren

- **Codeerstijl:** early returns / guard clauses in plaats van geneste if/else, vooral bij data ophalen of valideren.
- **Naamgeving:** geen afkortingen of losse letters (`d`, `e`, `ts`, `Btn`) — altijd volledige, beschrijvende namen, ook in style-objecten.
- **Communicatie:** bij het bespreken van bestaande code altijd het regelnummer of regelbereik noemen (bv. "regel 71" of "regel 88 t/m 117"), zodat ik snel kan terugvinden waar het over gaat.
- **Leerdoel:** ik wil de code zelf kunnen uitleggen en verantwoorden in mijn schoolassessment. Schrijf dus alsof een beginnende junior developer het zou schrijven — simpele, expliciete stappen in plaats van compacte/geavanceerde patterns (bv. geen destructured discriminated unions met `in`-operator zonder uitleg, geen one-linders die meerdere dingen combineren).
