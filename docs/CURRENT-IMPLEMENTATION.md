# NIATVerse — Current Implementation (Single Doc)

This document describes the **current front-end implementation** of the NIATVerse application. It is intended as a reference for wiring a real-time backend later. **Articles are documented in detail**; other features are summarized.

---

## 1. Tech Stack & Overview

- **Framework:** React 19, TypeScript, Vite
- **Routing:** React Router 7
- **Styling:** Tailwind CSS
- **Data:** All in-memory mock data in `src/data/mockData.ts`; no API calls
- **Purpose:** Campus-mapped student knowledge (articles, guides, campuses, clubs, contribute, search)

---

## 2. Routes (`src/App.tsx`)

| Route | Page | Purpose |
|-------|------|--------|
| `/` | Home | Hero, campus card, How-to Guides strip, campus grid, Watch & Learn (videos + guides), Start here (3 cards → Guide) |
| `/guide` | Guide | App guide: overview, Week 1, IRC, experiences, contribute, Q&A (hash sections: `#week1`, `#irc`, `#contribute`, etc.) |
| `/campuses` | CampusDirectory | List all 22 campuses with state filter |
| `/articles` | Articles | **Campus-only** article list with category + campus filters |
| `/how-to-guides` | HowToGuides | **Global guides only** (featured, topic chips, grid, CTA) |
| `/campus/:id` | Campus | Campus detail (sections, clubs, reviews, global guides strip) |
| `/campus/:id/clubs` | Clubs | Campus clubs list |
| `/campus/:id/clubs/:clubId` | ClubDetail | Single club |
| `/campus/:id/article/:articleId` | Article | **Campus-scoped** article detail |
| `/article/:articleId` | Article | **Global** article detail (used for how-to guides) |
| `/search` | Search | Search UI; uses `searchResults` mock (not `allArticles`) |
| `/contribute` | Contribute | Contribute landing (article, food, experience, trip) |
| `/contribute/write` | WriteArticle | Rich-text article editor (no submit to backend) |

---

## 3. Articles — Types (`src/types/index.ts`)

### 3.1 Article categories

- **ArticleCategory:** `'irc' | 'campus-life' | 'experiences' | 'academics' | 'howto'`
- **CATEGORY_ORDER** (in `articleCategories.ts`): `irc`, `campus-life`, `experiences`, `academics`, `howto`
- **CATEGORY_CONFIG:** per-category label, icon, bg, text, border (for chips/badges)

### 3.2 Guide topics (for How-to Guides page)

- **GuideTopic:** `'Placements' | 'Open Source' | 'Internships' | 'Competitive Programming' | 'GSoC' | 'Skills'`
- Used for topic chips and filtering on `/how-to-guides`.

### 3.3 Article type (legacy, for Campus-scoped cards)

- **Article** (used by `ArticleCard`): `id`, `campusId`, `section`, `title`, `excerpt`, `author`, `updatedDays`, `helpful`, `coverImage?`
- **ArticleCard** links to `/campus/${campusId}/article/${article.id}`.

### 3.4 Article page type (main list & detail)

- **ArticlePageArticle:** used in `allArticles`, Articles page, HowToGuides, Article detail, Home/Footer/Campus strips.

```ts
interface ArticlePageArticle {
  id: number;
  campusId: number | null;   // null = global guide
  campusName: string;        // e.g. "St. Mary's" or "Global"
  category: ArticleCategory;
  title: string;
  excerpt: string;
  updatedDays: number;
  helpful: number;
  featured?: boolean;
  clubId?: number | null;
  coverImage?: string;
  isGlobalGuide?: boolean;  // true => show on /how-to-guides, not on /articles
  topic?: GuideTopic;       // for how-to guide topic chips
}
```

- **Campus-scoped:** `campusId` is a number; shown on `/articles`; link format `/campus/:id/article/:articleId`.
- **Global guide:** `campusId === null`, `campusName === 'Global'`, `isGlobalGuide === true`; shown on `/how-to-guides`; link format `/article/:articleId` (no campus in path).

---

## 4. Articles — Data (`src/data/mockData.ts`)

### 4.1 Main list: `allArticles`

- **Type:** `ArticlePageArticle[]`
- **Content:** Mix of campus-scoped and global guides.
  - Campus-scoped: `campusId` 1–22, various categories (irc, campus-life, experiences, academics, howto), optional `clubId`, optional `featured`.
  - Global guides: `campusId: null`, `campusName: 'Global'`, `category: 'howto'`, `isGlobalGuide: true`, `topic` set (GSoC, Placements, Open Source, etc.). IDs 23–28 in current mock.
- **Sorting:** Done in UI (e.g. by `helpful` desc) when filtering.

### 4.2 How the app splits articles

- **Articles page (`/articles`):** Uses `campusOnlyArticles = allArticles.filter(a => a.campusId !== null)`. No global guides; filter by `category` and `campus` (campus id in URL).
- **How-to Guides page (`/how-to-guides`):** Uses `allArticles.filter(a => a.isGlobalGuide === true)`, sorted by `helpful` desc. Filter by `topic` and client-side search (title/excerpt).
- **Home / Footer / Campus:** Use `allArticles.filter(a => a.isGlobalGuide === true)` for “top N” global guides; links go to `/article/:id`.

### 4.3 Related data for article detail

- **articleComments:** `Comment[]` — `id`, `author`, `date`, `content`. Used on Article page; not keyed by article id in mock (same comments for all).
- **relatedArticles:** `{ id, title, updatedDays, helpful }[]`. Shown on Article page; links use `relatedLinkBase` (campus vs global route).

### 4.4 Search (separate from `allArticles`)

- **searchResults:** `SearchResult[]` — `id`, `title`, `campus`, `category`, `excerpt`, `updatedDays`. Search page filters this list; no live link to `allArticles` by id (search is mock-only).

---

## 5. Articles — Pages & Components

### 5.1 Articles page (`/articles`)

- **Source:** `campusOnlyArticles` (campus-scoped only).
- **URL params:** `category` (ArticleCategory), `campus` (campus id number).
- **UI:** Sticky filter bar (All + category chips, campus dropdown), list of `ArticleRow`, sidebar (Top Articles This Week, Browse by Campus, Missing Something).
- **Article row:** Category chip, campus chip, title, excerpt, updated/helpful. Link: `article.campusId ? /campus/${campusId}/article/${id} : /article/${id}` (in practice all rows have `campusId`).
- **Counts:** Total and per-campus counts from `campusOnlyArticles`.

### 5.2 HowToGuides page (`/how-to-guides`)

- **Source:** `allArticles` where `isGlobalGuide === true`, sorted by `helpful` desc.
- **Featured:** First article with `isGlobalGuide && featured`, by `helpful` desc (full-width card).
- **Topic chips:** All | Placements | Open Source | Internships | Competitive Programming | GSoC | Skills. Filter grid by `topic`.
- **Search:** Client-side filter by title/excerpt.
- **Grid:** Cards with cover, topic chip, title, excerpt, helpful, “Read Guide →” to `/article/:id`.
- **CTA:** “Write a Guide” → `/contribute/write`.

### 5.3 Article detail page (`/article/:articleId` and `/campus/:id/article/:articleId`)

- **Resolve:** `pageArticle = allArticles.find(a => a.id === articleIdNum)`. Same data for both routes; route only affects breadcrumb and related-article links.
- **Breadcrumb:** Global route + `isGlobalGuide` → How-To Guides; else Articles + category; campus route → Campus name + category.
- **Display:** Category/campus pills, title, cover image, meta (author “NIAT Student”, updated, helpful), **static body content** (same prose for every article in current code).
- **Related:** `relatedArticles` from mock; link to `/article/:rid` or `/campus/:id/article/:rid` depending on route.
- **Comments:** `articleComments` rendered below body. No per-article key in mock.

**Important:** Article **body is not from mock**. It is hardcoded HTML in `Article.tsx`. For real-time, body should come from API (e.g. `pageArticle.body` or a separate content endpoint).

### 5.4 Home / Footer / Campus

- **Home:** “How-to Guides for Every NIAT Student” under Watch & Learn: top 3 `isGlobalGuide` by `helpful`, cards link to `/article/:id`, “View all guides” → `/how-to-guides`. “New to NIAT?” 3 cards → `/guide#week1`, `/guide#irc`, `/guide#contribute`.
- **Footer:** “Guides” column: top 4 `isGlobalGuide` by `helpful`, each → `/article/:id`, “View all guides” → `/how-to-guides`.
- **Campus:** “Also useful for you” strip: top 3 `isGlobalGuide` by `helpful`, “View all” → `/how-to-guides`.

### 5.5 Navbar

- **Articles dropdown:** Category links to `/articles?category=...`; How-To Guides link to `/how-to-guides` (with separator and icon). Featured / Recently Updated from `allArticles`; link by `campusId` → campus article or `/article/:id`.

### 5.6 ArticleCard (`src/components/ArticleCard.tsx`)

- **Props:** `article: Article` (legacy type with `author`), `campusId: number`.
- **Link:** `/campus/${campusId}/article/${article.id}` only. Used on Campus page for campus-scoped articles (when wired to list from backend, ensure shape matches or map from `ArticlePageArticle`).

---

## 6. Article URL Conventions

| Context | URL pattern | When |
|--------|-------------|------|
| Campus-scoped list/detail | `/campus/:id/article/:articleId` | Article belongs to a campus |
| Global guide list/detail | `/article/:articleId` | `campusId === null` / how-to guides |
| How-to guides hub | `/how-to-guides` | All global guides |
| Articles hub | `/articles` | Campus-scoped only; no global |

---

## 7. Other Features (Brief)

- **Campuses:** `campuses` array (id, name, university, city, state, batchSize, articleCount, rating, coverImage, etc.). Campus page uses `accommodation`, `foodSpots`, `faculty`, `experiences`, `ratings`, `clubs` keyed or filtered by campus.
- **Clubs:** Per-campus; ClubDetail shows club info and optional club-linked articles (filter `allArticles` by `clubId` if needed).
- **Contribute / WriteArticle:** Form and rich-text editor; no submit to backend; “Submit for Review” is UI only.
- **Search:** Uses `searchResults` and filters by category/campus/date in UI; does not query `allArticles`.
- **Guide:** Static sections with anchors; links to campuses, articles, how-to-guides, contribute, Q&A (coming soon).
- **Niat Reviews Platform:** Nav link to external URL (e.g. `http://localhost:3000`), configurable in Navbar.
- **Community:** Route `/community` and page exist; link in nav (no Beta badge).

---

## 8. What’s Not Implemented (For Real-Time Backend)

- No REST or GraphQL client; no auth.
- Article **body** is static in `Article.tsx`; should be from API.
- **Comments** and **related articles** are global mock; should be per-article from API.
- **Create/update article:** WriteArticle does not persist; no draft/publish flow.
- **Search** does not use `allArticles` or server search; should be backend-driven.
- **Counts** (e.g. article count per campus, total) are derived from mock; should come from backend or be kept in sync.
- **Featured / helpful:** Currently static fields; could be updated in real time (e.g. “mark helpful” API).

---

## 9. File Reference (Articles-Focused)

| File | Role |
|------|------|
| `src/types/index.ts` | `Article`, `ArticlePageArticle`, `ArticleCategory`, `GuideTopic`, `Comment` |
| `src/data/mockData.ts` | `allArticles`, `articleComments`, `relatedArticles`, `searchResults` |
| `src/data/articleCategories.ts` | `CATEGORY_CONFIG`, `CATEGORY_ORDER` |
| `src/pages/Articles.tsx` | Campus-only list, category + campus filters, `campusOnlyArticles` |
| `src/pages/HowToGuides.tsx` | Global guides list, featured, topic chips, search |
| `src/pages/Article.tsx` | Detail for both routes; resolves from `allArticles`; static body |
| `src/components/ArticleCard.tsx` | Campus article card → `/campus/:id/article/:id` |
| `src/components/Navbar.tsx` | Articles dropdown, How-To Guides → `/how-to-guides` |
| `src/components/Footer.tsx` | Guides column from `isGlobalGuide` |
| `src/pages/Home.tsx` | How-to strip (Watch & Learn), guide cards |
| `src/pages/Campus.tsx` | “Also useful” strip (global guides) |
| `src/pages/Search.tsx` | Uses `searchResults` (not `allArticles`) |

---

You can use this doc as the “current implementation” spec when you receive the backend prompt to make the app real-time. Focus areas for articles: single source of truth for list/detail (e.g. `allArticles` → API), article body and comments per article, and consistent use of `campusId` vs global for URLs and filters.
