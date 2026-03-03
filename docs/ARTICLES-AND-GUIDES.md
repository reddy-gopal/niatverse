# Articles vs Guides — Current Implementation & Desired Behavior

This doc describes how **Articles** work today and what you want to add for **How to Guides** (or **Guides**) as a separate, global-focused nav and experience.

---

## 1. Current Implementation: Articles

### 1.1 Data & types

- **Source:** `src/data/mockData.ts` → `allArticles` (array of `ArticlePageArticle`).
- **Type:** `ArticlePageArticle` in `src/types/index.ts`:
  - `id`, `campusId` (number | null), `campusName`, `category`, `title`, `excerpt`, `updatedDays`, `helpful`, optional `featured`, `clubId`, `coverImage`.
  - **Global articles:** `campusId: null` and `campusName: "Global"`. They are not tied to any campus.
- **Categories:** `ArticleCategory` = `'irc' | 'campus-life' | 'experiences' | 'academics' | 'howto'`.
- **Category config:** `src/data/articleCategories.ts` — `CATEGORY_CONFIG` (label, icon, bg, text, border) and `CATEGORY_ORDER` for filters.

### 1.2 Navbar

- **Location:** `src/components/Navbar.tsx`.
- **Desktop:** Links shown are **Campuses**, **Articles**, **Contribute**.
- **Articles** is a single nav item that:
  - Links to `/articles`.
  - Has a **mega dropdown** on hover with:
    - **Left:** “Browse by Category” — 5 links: Campus Life, IRC & Skills, Experiences, Academics, **How-To Guides**. Each goes to `/articles?category=<key>`.
    - **Right:** “Featured” and “Recently Updated” from `allArticles` (featured first, then 2 recently updated). Each item links to campus-scoped URL if `campusId` is set, else `/article/:id`.
    - **Bottom:** “Browse all articles” → `/articles`.
- **Mobile:** Same links (Campuses, Articles, Contribute) without the dropdown.

So today there is **one** “Articles” entry; “How-To Guides” is only a category inside the Articles dropdown and on the Articles page.

### 1.3 Articles index page (`/articles`)

- **Component:** `src/pages/Articles.tsx`.
- **Data:** `allArticles` from mockData.
- **Filters:**
  - **Category:** All | Campus Life | IRC & Skills | Experiences | Academics | How-To Guides (query: `?category=...`).
  - **Campus:** “All Campuses” or a specific campus (query: `?campus=<id>`). List of campuses from `campuses` in mockData.
- **List:** Filtered list sorted by `helpful` desc. Each row shows category pill, campus pill (or “Global”), title, excerpt, updated/helpful. Link is:
  - `/campus/:campusId/article/:articleId` when `article.campusId` is set,
  - `/article/:articleId` when `article.campusId` is null (global).
- **Global articles** already appear here when category is “How-To Guides” or when no campus filter is applied; they show campus name “Global”.

### 1.4 Article detail page

- **Routes:**  
  - `/campus/:id/article/:articleId` — campus-scoped (breadcrumb: Home › Campus › Category › Title).  
  - `/article/:articleId` — global (breadcrumb: Home › Articles › Category › Title).
- **Component:** `src/pages/Article.tsx`. Resolves article from `allArticles` by `articleId`; uses `id` from URL only for campus context and breadcrumb. Global articles use `/article/:articleId` and don’t need a campus in the URL.

### 1.5 Summary (current)

| Piece            | Current behavior |
|------------------|-------------------|
| Nav              | One “Articles” item; “How-To Guides” is a category in its dropdown. |
| Articles page    | Single list: filter by category + campus. Global articles (e.g. How-To) appear when category = howto or campus = All. |
| Global articles  | `campusId: null`, `campusName: "Global"`. Shown in Articles list; opened via `/article/:articleId`. |
| How-To content   | Treated like any other category; no dedicated “Guides” nav or landing. |

---

## 2. What You Want: “How to Guides” / “Guides” as a Separate Nav

### 2.1 Intent

- **Guides** = articles that are **global** and useful for **everyone** (any campus), e.g.:
  - “How to register in GSOC?”
  - “How can we get 10LPA in placements?”
- You want a **dedicated nav item** (e.g. **“How to Guides”** or **“Guides”**) that:
  - Is a **global** thing (not campus-specific).
  - Surfaces these helpful-for-everyone articles in one place.
- You will **keep** the existing **Articles** nav and Articles page as they are; Guides is an **additional** entry point.

### 2.2 Desired behavior (to implement)

1. **New nav item**
   - Add a top-level nav link, e.g. **“Guides”** or **“How to Guides”**.
   - It should go to a dedicated route (e.g. `/guides` or `/articles/guides` — you can decide in your solution).

2. **Guides landing / list**
   - A page that shows **only** articles that count as “guides” (global, helpful-for-everyone).
   - In current data terms, that could be:
     - Articles with `campusId === null` (and optionally `category === 'howto'`), or
     - A dedicated flag/type later (e.g. `isGuide` or section “guides”) if you want to separate “howto” from “guides” in the future.
   - No campus filter (or “Global” only); focus on one list of guide-like articles.

3. **Articles unchanged**
   - **Articles** nav and `/articles` stay as today: all categories (including How-To), all campuses + Global, same filters and behavior.
   - So: **Articles** = full catalog (campus + global, all categories). **Guides** = curated global/how-to list with its own nav and page.

### 2.3 Open points for your solution

- **Route:** e.g. `/guides` vs `/articles/guides` vs something else.
- **Definition of “guide”:**  
  - For now: “global articles” (`campusId === null`) and/or `category === 'howto'`.  
  - Later: optional dedicated field (e.g. `isGuide`) or separate content type if you want to distinguish “How to 10 LPA” (guide) from other howto that might stay campus-specific.
- **Reuse:** Whether the Guides page reuses the same `ArticlePageArticle` list + filter (e.g. “only global + howto”) or uses a separate slice of data / component.
- **Nav order:** Where to put “Guides” (e.g. after Campuses, before Articles, or after Articles).

---

## 3. Quick reference

| Topic              | Current                                               | Desired (your direction)                                      |
|--------------------|--------------------------------------------------------|---------------------------------------------------------------|
| Nav                | Campuses, Articles, Contribute                        | Add **Guides** (or “How to Guides”) as separate nav item     |
| Articles page      | All articles, filter by category + campus             | Unchanged                                                     |
| Guides page        | Does not exist                                        | New page: only global / guide-like articles                  |
| Global articles    | `campusId: null`, “Global”; shown in Articles          | Same; also surfaced as the main content of the new Guides nav |
| Article detail     | `/campus/:id/article/:id` or `/article/:id`            | Unchanged                                                    |

Once you have the exact route, label (“Guides” vs “How to Guides”), and definition of which articles appear on the Guides page, you can implement it (new route, new or reused page, and new nav link) as you prefer.
