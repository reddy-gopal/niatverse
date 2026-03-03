# NIATVerse

A React web app for NIAT (Narayana IIT Academy Trust) students: campus guides, clubs, articles, and community-contributed content.

**Stack:** React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS, Lucide React. Data is mock-only in `src/data/mockData.ts`.

---

## Quick start

```bash
npm install
npm run dev    # dev server
npm run build  # production build
npm run lint   # ESLint
```

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing and navigation |
| `/campuses` | CampusDirectory | List of NIAT campuses (cards, state filter) |
| `/articles` | Articles | Articles index with category/campus filters and featured |
| `/campus/:id` | Campus | Campus detail: hero, sticky section nav, sections (Week 1, Living, Food, IRC, Experiences, Contacts, Reviews) |
| `/campus/:id/clubs` | Clubs | Clubs listing for that campus (2-col desktop, 1-col mobile); filter by type and “Open to All”. Each card links to club detail. |
| `/campus/:id/clubs/:clubId` | ClubDetail | Single club: summary card, then “Articles related to this Club” list below |
| `/campus/:id/article/:articleId` | Article | Article detail (campus-scoped) |
| `/article/:articleId` | Article | Article detail (global fallback) |
| `/search` | Search | Search UI (uses `searchResults`) |
| `/contribute` | Contribute | Contribute entry |
| `/contribute/write` | WriteArticle | Write article flow |

All main pages use the shared **Navbar** and **Footer**.

---

## Project structure

```
src/
├── App.tsx              # Router and route definitions
├── main.tsx
├── index.css            # Global + Tailwind
├── pages/                # Route-level components
│   ├── Home.tsx
│   ├── CampusDirectory.tsx
│   ├── Campus.tsx       # Campus detail + section nav
│   ├── Clubs.tsx        # Campus clubs listing (grid)
│   ├── ClubDetail.tsx   # Club detail + related articles
│   ├── Article.tsx
│   ├── Articles.tsx
│   ├── Search.tsx
│   ├── Contribute.tsx
│   └── WriteArticle.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CampusCard.tsx
│   ├── ArticleCard.tsx
│   └── ui/               # shadcn-style primitives
├── data/
│   ├── mockData.ts      # All mock data (see Data section)
│   └── articleCategories.ts
├── types/
│   └── index.ts         # Campus, Club, Article, ArticlePageArticle, etc.
├── constants/
│   └── clubBadges.ts    # Club type badge styles + filter options
├── lib/
│   └── utils.ts
└── hooks/
    └── use-mobile.ts
```

---

## Campus page (`/campus/:id`)

- **Component:** `src/pages/Campus.tsx`
- **Sections:** Fixed list with sticky nav and scroll spy. Each section has a ref and an id used for navigation.

| Section ID   | Label       | Icon          | Content / data source |
|-------------|-------------|---------------|------------------------|
| `week1`     | Week 1      | Calendar      | Static copy (Day 1–7 cards, CTA, common mistakes) |
| `living`    | Living      | Home          | `accommodation` |
| `food`      | Food        | Utensils      | `foodSpots` |
| `irc`       | IRC         | FlaskConical  | `ircInfo` (lab, coordinator, tips) |
| `experiences` | Experiences | Briefcase   | `experiences` (filtered by `campusId`) |
| `contacts`  | Contacts    | UserCheck     | `faculty` |
| `reviews`   | Reviews     | MessageSquare | `ratings` |

- **Scroll spy:** `activeSection` is updated on scroll; clicking a nav item scrolls to the section ref.
- **Articles:** Only the hero shows `campus.articleCount`. No per-section article lists on this page.
- **Clubs:** Clubs are not a section on the Campus page. Use `/campus/:id/clubs` for the clubs listing.

---

## Clubs

- **Types:** `Club`, `ClubType` in `src/types/index.ts`. Badge styles and filter options in `src/constants/clubBadges.ts`.
- **Data:** `clubs` in `mockData.ts` (each has `campusId`). Some `allArticles` entries have `clubId` for club-related articles.

### Clubs listing (`/campus/:id/clubs`)

- **Layout:** `grid grid-cols-1 lg:grid-cols-2 gap-8` (2 columns desktop, 1 column mobile), `max-w-6xl` container.
- **Card:** Whole card is a `<Link>` to `/campus/:id/clubs/:clubId`. Left: maroon strip (type, name, Est. year, open badge, member count). Right: white (about, activities, achievement, how to join, Email/Instagram, verified). Email/Instagram use `stopPropagation` so they don’t trigger the card link.
- **Filters:** Type chips (All, Coding, Cultural, Sports, Literary, Robotics, Social) and “Open to All” checkbox. Client-side filtering.

### Club detail (`/campus/:id/clubs/:clubId`)

- **Layout:** Hero (breadcrumb + club name), then one summary card (same fields as listing card, no articles inside).
- **Below:** “← Back to all [campus] clubs” link, then (if any) section **“Articles related to this Club”** with heading, divider, and list of article cards. Each article card links to `/campus/:campusId/article/:articleId`. Articles are `allArticles` with `clubId === club.id` and `campusId` match, sorted by `helpful` desc. Spacing between items: `space-y-8`.

---

## Articles

- **Article (detail page):** Type `Article` in `src/types/index.ts`; data in `articles` in mockData. Routes: `/campus/:id/article/:articleId` and `/article/:articleId`.
- **ArticlePageArticle:** Used on `/articles` and for club-related articles. Has `category`, `campusName`, `campusId`, optional `clubId` and `featured`. Data in `allArticles`.
- **Article index (`/articles`):** Uses `allArticles` with category/campus filters.
- **Club-linked articles:** Only shown on **Club detail** under “Articles related to this Club”. Not on Campus page and not in the main articles grid by club.

---

## Data (mockData)

| Export            | Type                     | Used for |
|-------------------|--------------------------|----------|
| `campuses`        | `Campus[]`               | Campus list, campus detail hero |
| `clubs`           | `Club[]`                 | Clubs listing, Club detail |
| `articles`        | `Article[]`              | Article detail page |
| `allArticles`     | `ArticlePageArticle[]`   | Articles index, club-related articles (via `clubId`) |
| `accommodation`   | `Accommodation[]`        | Campus Living section |
| `foodSpots`       | `FoodSpot[]`             | Campus Food section |
| `ircInfo`         | `IRCInfo`                | Campus IRC section |
| `experiences`     | `Experience[]`           | Campus Experiences section |
| `faculty`         | `Faculty[]`              | Campus Contacts section |
| `ratings`         | `Ratings`                | Campus Reviews section |
| `searchResults`   | `SearchResult[]`         | Search page |
| `articleComments` | `Comment[]`             | Article detail page |
| `relatedArticles` | `{ id, title, updatedDays, helpful }[]` | Article detail page |
| `stateCounts`     | `StateCount[]`           | Campus directory state filter |

---

## Key files

| File | Purpose |
|------|--------|
| `src/App.tsx` | All routes: Home, Campuses, Articles, Campus, Clubs, ClubDetail, Article, Search, Contribute, WriteArticle |
| `src/pages/Campus.tsx` | Campus detail: hero, sticky section nav, section content |
| `src/pages/Clubs.tsx` | Campus clubs listing: grid, filters, club cards (link to detail) |
| `src/pages/ClubDetail.tsx` | Club summary card + “Articles related to this Club” section |
| `src/data/mockData.ts` | All mock data listed in Data section above |
| `src/types/index.ts` | Campus, Club, Article, ArticlePageArticle, and other types |
| `src/constants/clubBadges.ts` | Club type badge styles and filter options |

---

*README reflects current implementation: routes, Campus sections (Week 1, Living, Food, IRC, Experiences, Contacts, Reviews), Clubs listing and detail, articles, and mock data usage.*
