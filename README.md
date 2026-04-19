# FlashCards

A lightweight vocabulary learning app built with React + Vite. Create word collections in two languages, browse your cards, and train in a focused learning stream that uses a multi-armed bandit algorithm to surface the right cards at the right time.

---

## Features

### Collections
- Create multiple collections, each with a name and a language pair (learning language → known language)
- Rename or delete collections at any time

### Cards
- Each card has a **front** (the language you are learning) and a **back** (the language you know)
- Add, edit, and delete cards within any collection
- Cards display lifetime stats: times seen, correct guesses, and wrong guesses

### Learning mode
- One card at a time — front is shown first, click to flip and reveal the translation
- After flipping, mark the card as **Correct** or **Wrong**
- A progress bar tracks your session results
- A summary screen appears when you finish, showing accuracy for that session
- Scores can be reset per collection at any time

### Card selection — UCB1 algorithm
Card order is driven by the [Upper Confidence Bound (UCB1)](https://en.wikipedia.org/wiki/Multi-armed_bandit) algorithm, adapted for spaced learning:

```
score = (wrong / seen) + C * √( ln(N) / n_i )
```

- **Unseen cards** score `∞` and are always shown first — you see every card before any repeats
- Once all cards have been seen, cards you get **wrong more often** score highest and appear more frequently
- Cards you consistently get right gradually fade as their exploration bonus shrinks
- **5% of picks are fully random**, keeping sessions from feeling mechanical

### Persistence
All data (collections, cards, scores) is saved to `localStorage` automatically. Nothing is lost on page refresh or between sessions.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Language | TypeScript |
| Routing | React Router v6 |
| Styling | CSS Modules + CSS custom properties |
| Storage | Browser `localStorage` |

---

## Running the app

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node)

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is written to `dist/`. Serve it with any static file server:

```bash
npm run preview
```

---

## Project structure

```
src/
├── types/
│   └── index.ts              # Shared TypeScript interfaces (Card, Collection, etc.)
├── store/
│   └── useCollections.ts     # Custom hook — all state and localStorage persistence
├── utils/
│   └── weightedRandom.ts     # UCB1 card selection algorithm
├── pages/
│   ├── HomePage.tsx          # Collection list and creation
│   ├── CollectionPage.tsx    # Card grid, add/edit/delete, start learning
│   └── LearningPage.tsx      # Learning stream with flip interaction
├── components/
│   ├── FlipCard.tsx          # 3D CSS flip card
│   ├── FlashCard.tsx         # Card tile for the grid view
│   ├── CollectionCard.tsx    # Collection tile for the home view
│   ├── Modal.tsx             # Generic modal wrapper
│   ├── CardForm.tsx          # Add/edit card form
│   ├── CollectionForm.tsx    # Create/rename collection form
│   └── ProgressBar.tsx       # Session progress indicator
└── styles/
    └── global.css            # CSS custom properties (design tokens) and reset
```

### Key files

**`src/store/useCollections.ts`** — single source of truth. Exposes CRUD operations for collections and cards, and syncs to `localStorage` on every change.

**`src/utils/weightedRandom.ts`** — pure, stateless card selection. Takes the current card list and the last-shown card id, returns the next card. Tune the `UCB_C` constant to adjust how aggressively the algorithm revisits infrequently-seen cards.

**`src/styles/global.css`** — all design tokens (colors, spacing, typography, shadows) as CSS custom properties. Edit this file to retheme the entire app.
