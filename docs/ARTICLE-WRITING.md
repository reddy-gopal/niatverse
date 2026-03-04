# Article Writing — UI and Backend Implementation

This document describes the current implementation of the article writing flow: UI (Write Article page), API usage, and backend (models, serializers, views, validation). Use it to understand the system or to propose changes.

---

## 1. Frontend: Write Article Page

**Location:** `campus/src/pages/WriteArticle.tsx`  
**Route:** `/contribute/write` (and `?edit=<id>` for editing)

### 1.1 Data and state

| State / data | Purpose |
|--------------|--------|
| `categoryId` | Selected section (FK to Category). Required for submit. |
| `categories` | List from `GET /api/categories/` — `{ id, name, slug }[]`. |
| `showSectionSelect` | When `false`, section is shown as selected text + edit icon; when `true`, section dropdown is shown. |
| `subcategory`, `subcategoryOther` | For **Club Directory** or **Amenities**: slug (e.g. `media-club`, `library`) and, when "Others", free text. |
| `isGlobalGuide` | If true, article is a global guide; `campus_id` is sent as `null`. |
| `title`, `subtitle` (excerpt), `body` | Article content. Body is HTML in a `contentEditable` div. |
| `username` | Current user from `fetchMe()`; displayed as "By {username}" (read-only; author is not editable). |
| `campusId` | Campus for non-global articles; from profile when creating, or from article when editing. |
| `editId` | Set when editing (`?edit=<id>`) or after first create (draft). |

No co-author UI: author is always the logged-in user (`author_username` set on the backend).

### 1.2 Section (category) display

- **Categories** come from **GET /api/categories/** and are rendered in a **dropdown** when `showSectionSelect === true`.
- After a section is chosen, the UI switches to **selected view**:
  - Shows the **section name** (e.g. "The Onboarding Kit") in a pill/chip.
  - An **edit icon** (pencil) button next to it; click sets `showSectionSelect(true)` to show the dropdown again.
- So: either "dropdown to select" or "selected name + icon to change" — not both at once.

### 1.3 Subcategories (Club / Amenity)

- Shown only when the selected section has **slug** `club-directory` or `amenities`.
- **One row, horizontal:** Section (left), then (when applicable) **Club** or **Amenity** dropdown, then (if "Others") a **Specify** text input.
- **Club Directory** options (frontend constant `CLUB_SUBCATEGORIES`): Media Club, Coding Club, Design Club, Robotics Club, Sports Club, Cultural Club, Others.
- **Amenities** options (`AMENITIES_SUBCATEGORIES`): Library, Sports and Ground, Cafeteria, Labs, Hostel, Transport, Others.
- If user selects **Others**, they must fill the "Specify" field (e.g. custom club or amenity name). Sent as `subcategory_other`.

### 1.4 Global guide

- **Checkbox:** "Global guide (applies to all campuses)".
- When checked (`isGlobalGuide === true`), payload sends `is_global_guide: true`, `campus_id: null`, `campus_name: ''`.
- When unchecked, campus comes from `campusId` / profile (or existing article when editing).

### 1.5 Author

- Single line: **"By {username}"** — `username` from `fetchMe()`. Read-only; no add/remove co-author. Backend always sets `author_username` from the authenticated user.

### 1.6 Submit and draft

- **Submit for review:** validation (title, section, body length, subcategory when needed); then POST create or PATCH update with `status: 'pending_review'` and `is_global_guide: isGlobalGuide`. Campus/subcategory payload as above.
- **Save draft:** same payload shape; `save_as_draft: true` on create, or PATCH with `status: 'draft'`. Validation for section/subcategory is relaxed for drafts but payload still sends category and optional subcategory.

---

## 2. Frontend: API and types

**Service:** `campus/src/lib/articleService.ts`  
**Types:** `campus/src/types/articleApi.ts`

### 2.1 Categories

- **GET /api/categories/**  
  Returns: `{ id: number, name: string, slug: string }[]`  
  Used to populate the section dropdown and to derive `slug` from `categoryId` (e.g. `club-directory`, `amenities`).

### 2.2 Article create/update payload

Sent as JSON to **POST /api/articles/** or **PATCH /api/articles/:id/**.

| Field | Type | When / notes |
|-------|------|----------------|
| `category_id` | number \| undefined | Required for submit. ID from categories list. |
| `campus_id` | number \| null | `null` when global guide; otherwise campus id. |
| `campus_name` | string | Resolved from campuses list (or profile); empty when global. |
| `title` | string | Required for submit. |
| `excerpt` | string | Subtitle. |
| `body` | string | HTML string from contentEditable. |
| `is_global_guide` | boolean | From "Global guide" checkbox. |
| `subcategory` | string | When section is Club Directory or Amenities; slug (e.g. `media-club`, `library`) or `others`. |
| `subcategory_other` | string | When subcategory is "others"; custom name. |
| `save_as_draft` | boolean | Create only; when true, article is created as draft. |
| `status` | 'draft' \| 'pending_review' | PATCH only; for draft vs submit. |

Author is **not** sent; backend sets `author_id` and `author_username` from the request user.

### 2.3 Article response (detail/list)

- Includes: `id`, `campus_id`, `campus_name`, `category`, `category_id`, `title`, `slug`, `excerpt`, `body`, `cover_image`, `status`, `featured`, `helpful_count`, `is_global_guide`, `topic`, `club_id`, `subcategory`, `subcategory_other`, `author_username`, `published_at`, `updated_at`, etc.
- For edit, the page loads **GET /api/articles/:id/** and sets `categoryId`, `subcategory`, `subcategory_other`, `isGlobalGuide`, and `showSectionSelect = false` so the section appears as selected.

---

## 3. Backend: Models

**Location:** `backend/articles/models.py`

### 3.1 Category

- **Category** (table `articles_category`): `id`, `name`, `slug` (unique).  
- Seeded with sections whose slugs match `CATEGORY_CHOICES` (e.g. `onboarding-kit`, `survival-food`, `club-directory`, `career-wins`, `local-travel`, `amenities`).

### 3.2 Article

- **Article** (table `articles_article`):  
  - Identity: `author_id`, `author_username` (set from request user on create).  
  - Placement: `campus_id`, `campus_name`, `category` (char slug), `category_fk` (FK to Category, `category_id` in DB).  
  - Content: `title`, `slug`, `excerpt`, `body`, `cover_image`.  
  - Flags: `status`, `featured`, `helpful_count`, `is_global_guide`, `topic`.  
  - Club/amenity: `club_id` (nullable), `subcategory` (char, e.g. `media-club`, `library`, `others`), `subcategory_other` (custom name when `subcategory == "others"`).  
  - Moderation: `rejection_reason`, `reviewed_by_id`, `reviewed_at`, `published_at`, `created_at`, `updated_at`.

### 3.3 Subcategory choices (backend)

- **Club Directory** (`CLUB_SUBCATEGORY_CHOICES`): media-club, coding-club, design-club, robotics-club, sports-club, cultural-club, others.  
- **Amenities** (`AMENITIES_SUBCATEGORY_CHOICES`): library, sports-and-ground, cafeteria, labs, hostel, transport, others.  
- Validation uses `CLUB_SUBCATEGORY_SLUGS` and `AMENITIES_SUBCATEGORY_SLUGS`; when slug is `others`, `subcategory_other` is required.

---

## 4. Backend: Serializers and validation

**Location:** `backend/articles/serializers.py`

### 4.1 ArticleWriteSerializer (create/update)

- Accepts: `campus_id`, `campus_name`, `category`, `category_id`, `title`, `excerpt`, `body`, `cover_image`, `is_global_guide`, `topic`, `club_id`, `subcategory`, `subcategory_other`, `save_as_draft`.
- **Global guide:** If `is_global_guide` is True, `campus_id` must be null.  
- **Non-global:** For submit (not draft), `campus_id` is required.  
- **Section:** For submit, `category_id` (or `category`) is required. Resolved to `Category` and stored as `category` (slug) and `category_fk`.  
- **Club Directory:** When category slug is `club-directory`, `subcategory` is required and must be in `CLUB_SUBCATEGORY_SLUGS`; if `subcategory == "others"`, `subcategory_other` is required.  
- **Amenities:** When category slug is `amenities`, `subcategory` is required and must be in `AMENITIES_SUBCATEGORY_SLUGS`; if `subcategory == "others"`, `subcategory_other` is required.  
- **Body:** For submit, body must be at least 100 characters.  
- **Title:** Required for submit.

### 4.2 List/Detail serializers

- Expose `category`, `category_id` (from `category_fk_id`), `subcategory`, `subcategory_other`, `is_global_guide`, and all other article fields used by the app.

---

## 5. Backend: Views and URLs

**Location:** `backend/articles/views.py`, `backend/articles/urls.py`

### 5.1 Categories

- **GET /api/categories/** — `CategoryListView`: returns all categories ordered by `id`; serialized as `{ id, name, slug }[]`. AllowAny.

### 5.2 Articles

- **GET /api/articles/** — List; optional query params: `campus`, `category`, `subcategory`, `is_global_guide`, `topic`, `status` (moderator), etc. Paginated.  
- **GET /api/articles/:id/** — Detail; 404 for non-published if not author/moderator.  
- **POST /api/articles/** — Create; body = ArticleWriteSerializer; `author_id`/`author_username` set from `request.user`; slug generated; status = draft or pending_review from `save_as_draft`.  
- **PATCH /api/articles/:id/** — Update; allowed fields for author include `campus_id`, `campus_name`, `category`, `category_id`, `title`, `excerpt`, `body`, `cover_image`, `is_global_guide`, `topic`, `club_id`, `subcategory`, `subcategory_other`; `_resolved_category` sets `category_fk`. Author can set `status` to draft or pending_review.  
- **POST /api/articles/:id/moderate/** — Moderator only; publish/reject.

Founding editors: on create/update, backend can override `campus_id`/`campus_name` from `FoundingEditorProfile` if present (unless global guide).

---

## 6. Flow summary

1. User opens **Write Article**; frontend loads **categories** and **me** (username).  
2. User selects **Section** from dropdown → selection is stored; UI then shows section name + **pencil icon** to change.  
3. If section is **Club Directory** or **Amenities**, user selects **Club/Amenity** (and optionally "Others" + specify).  
4. User can check **Global guide**; then campus is not used (sent as null).  
5. **Author** is shown as "By {username}" and is not editable.  
6. User fills title, subtitle, body; **Save draft** or **Submit for review**.  
7. Frontend sends one request (POST or PATCH) with category, optional subcategory/subcategory_other, is_global_guide, campus, title, excerpt, body, etc. Backend validates and stores; author and slug are set server-side.

---

## 7. Files reference

| Layer | File |
|-------|------|
| UI | `campus/src/pages/WriteArticle.tsx` |
| API client | `campus/src/lib/articleService.ts`, `campus/src/lib/articlesApi.ts` |
| Types | `campus/src/types/articleApi.ts` |
| Backend models | `backend/articles/models.py` |
| Backend serializers | `backend/articles/serializers.py` |
| Backend views | `backend/articles/views.py` |
| Backend URLs | `backend/articles/urls.py` (includes router for articles, path for categories) |

This is the full current implementation of article writing UI and backend as of the last update.
