# GymStart — Frontend

React Native mobile app built with **Expo** and **TypeScript**.

## Requirements

- Node.js ≥ 18
- npm ≥ 10 or Yarn ≥ 1.22
- Expo CLI: `npm install -g expo-cli`

## Setup

```bash
npm install
cp .env.example .env   # not yet created — set EXPO_PUBLIC_API_URL
npx expo start
```

## Project Structure

```
frontend/
├── App.tsx                  # Root component — mounts navigator
├── app.json                 # Expo / EAS configuration
├── babel.config.js          # Babel + module-resolver (path aliases)
├── tsconfig.json            # TypeScript config + path aliases
├── package.json
└── src/
    ├── components/          # Reusable UI components (Button, Card, …)
    ├── screens/             # Full-screen views
    │   ├── HomeScreen.tsx
    │   ├── WorkoutPlanScreen.tsx
    │   ├── MealPlanScreen.tsx
    │   └── ProfileScreen.tsx
    ├── navigation/
    │   └── AppNavigator.tsx # Stack + Tab navigator setup
    ├── services/            # Axios-based API call wrappers
    │   ├── api.ts           # Shared Axios client instance
    │   ├── userService.ts
    │   ├── workoutPlanService.ts
    │   └── mealPlanService.ts
    ├── types/               # TypeScript interfaces & navigation types
    │   ├── index.ts
    │   └── navigation.ts
    └── utils/               # Pure utility / helper functions
        └── index.ts
```

## Path Aliases

Import from any directory using short aliases:

```ts
import HomeScreen from '@screens/HomeScreen';
import { User } from '@types/index';
import apiClient from '@services/api';
```

## Code Style

Run the linter:

```bash
npm run lint
npm run type-check
```
