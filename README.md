# CineScope 🎬

React + TypeScript movie browser powered by the [TMDB API](https://www.themoviedb.org/documentation/api).

## Features

- Browse **Trending**, **Popular**, **Top Rated**, and **Upcoming** movies
- **Search** movies by title with paginated results
- **Movie details** page with cast, trailer link, and similar movies
- **Favorites** list persisted in `localStorage`
- Fully **responsive** design with Tailwind CSS
- Loading and error states on every async operation

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | UI & type safety |
| Vite | Build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS v4 | Styling |

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── Pagination.tsx
├── features/
│   ├── catalog/         # Browse movies
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── CatalogPage.tsx
│   │   ├── MovieCard.tsx
│   │   └── MovieGrid.tsx
│   ├── search/          # Search functionality
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── SearchPage.tsx
│   ├── details/         # Movie details
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── MovieDetailsPage.tsx
│   └── favorites/       # Favorites list
│       ├── types.ts
│       └── FavoritesPage.tsx
├── services/
│   └── tmdbClient.ts    # Axios instance + image helpers
└── App.tsx              # Root component with global state & routing
```

## Getting Started

1. Get a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api)

2. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd tmdb-app
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Then replace `your_tmdb_api_key_here` with your actual key.

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```
