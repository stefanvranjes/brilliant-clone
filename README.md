# Brilliant Clone

A gamified interactive learning platform built with React, TypeScript, and Tailwind CSS. This project demonstrates a scalable Feature-Sliced architecture, complex state management, and engaging UI animations.

## 🚀 Features

*   **Interactive Problem Solving:**
    *   Multiple Choice questions with instant feedback.
    *   Fill-in-the-blank text inputs with validation.
    *   Hint system and explanation support.
*   **Gamification Engine:**
    *   **XP System:** Earn XP for every correct answer.
    *   **Leveling:** Automatically level up as you gain XP (1000 XP per level).
    *   **Streaks:** Smart logic tracks daily activity. Consecutive days increase your streak; missing a day resets it.
*   **Dashboard & Analytics:**
    *   Visual Activity Chart (using Recharts).
    *   Stats overview (Total XP, Problems Solved, Current Level).
*   **Polished UI/UX:**
    *   Smooth page transitions (Framer Motion).
    *   Responsive design for mobile and desktop.
    *   Category filtering for learning paths.
*   **Persistence:**
    *   All progress is saved to the browser's `localStorage`. Refreshing the page doesn't lose your stats.

## 🛠️ Tech Stack

*   **Framework:** React 18 (Create React App)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Charts:** Recharts
*   **Routing:** React Router DOM v6

## 📂 Architecture

This project follows a **Feature-Sliced Design** approach for scalability:

```text
client/src/
├── components/       # Shared UI atoms (Buttons, Modals, Loaders)
├── features/         # Domain-specific logic
│   ├── dashboard/    # Progress stats and charts
│   └── problem/      # Interactive solver logic
├── hooks/            # Custom React hooks (useProgress, useProblem)
├── services/         # Data layer (API mocks, Persistence logic)
├── utils/            # Shared helpers
└── App.tsx           # Routing and Layout
```

## 🏃‍♂️ Getting Started

1.  **Install Dependencies:**
    ```bash
    cd client
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3.  **Run Tests:**
    ```bash
    npm test
    ```

## 🧪 Testing

Unit tests are included for the core business logic in `src/services/api.service.test.ts`.
This ensures that:
*   Streaks calculate correctly across date changes.
*   XP accumulation and Level ups work as intended.
*   Data persistence behaves correctly.

## 📝 License

MIT
