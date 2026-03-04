# Articles — Current Implementation

This document describes the end-to-end implementation of articles: backend (models, API, images), frontend Write Article flow (draft, images, submit, preview), and how image cards work (preview, description, remove).

---

## 1. Backend

### 1.1 Models

**Location:** `backend/articles/models.py`

- **Article**
  - **Identity / author:** `author_id`, `author_username` (set from request user).
  - **Place:** `campus_id`, `campus_name`; optional `category_fk` (Category), `category` (slug).
  - **Content:** `title`, `slug` (unique), `excerpt`, `body` (HTML).
  - **Images:**  
    - `cover_image` — single URL (first image in body, or explicitly sent).  
    - `images` — `JSONField` list of image URLs extracted from body (or sent by client). Used for multi-image support; cover is typically `images[0]` when present.
  - **Section / subcategory:** `subcategory`, `subcategory_other` (e.g. Club Directory / Amenities).
  - **Status:** `status` (`draft` | `pending_review` | `published` | `rejected`), `rejection_reason`, `reviewed_by_id`, `reviewed_at`, `published_at`.
  - **Other:** `featured`, `helpful_count`, `is_global_guide`, `topic`, `club_id`, timestamps.

- **Category**  
  Sections (e.g. The Onboarding Kit, Club Directory, Amenities). Seeded via migrations/fixtures.

- **ArticleHelpful**  
  User helpful votes (one per user per article).

- **ArticleComment**  
  Comments on an article.

### 1.2 API (high level)

- **GET /api/articles/** — List (paginated). Query: `campus`, `category`, `subcategory`, `status`, etc.
- **GET /api/articles/:id/** — Detail (body, comments_count, etc.).
- **POST /api/articles/** — Create. Body: `title`, `excerpt`, `body`, `category_id`, `campus_id`, `campus_name`, `cover_image`, `images`, `subcategory`, `subcategory_other`, `is_global_guide`, optional `save_as_draft`.
- **PATCH /api/articles/:id/** — Update (same fields + `status` for submit-for-review).
- **POST /api/articles/:id/helpful/** — Toggle helpful.
- **GET /api/articles/my_articles/** — Current user’s articles.
- **GET /api/categories/** — List categories (id, name, slug).

On create/update, if `images` is not sent, the backend extracts all `<img src="...">` URLs from the HTML `body` and stores them in `Article.images`; `cover_image` is set from the first image when available.

---

## 2. Frontend: Write Article Page

**Location:** `campus/src/pages/WriteArticle.tsx`  
**Route:** `/contribute/write` (optional `?edit=<id>` for editing)

### 2.1 Flow overview

1. **Load:** Categories from API; if `?edit=<id>`, load article and fill form + body; else try restore from **localStorage draft**.
2. **Edit:** Title, subtitle (excerpt), section, subcategory (if Club/Amenities), campus, body (contentEditable). **Images** are inserted as **image cards** (see below).
3. **Draft:** Changes are persisted to **localStorage** (key `niat_article_draft`) so refresh/navigation keeps state. Draft is **cleared only** when user successfully clicks **Submit for Review**.
4. **Preview:** Opens a modal that renders the article like the real view (title, pills, first image as cover, meta, body HTML).
5. **Submit for Review:** Validates (title, section, body length, subcategory if needed); sends create or update with `status: 'pending_review'`; on success shows success modal and clears localStorage draft.

### 2.2 Draft (localStorage)

- **Stored:** `title`, `subtitle`, `body` (HTML), `attachedImages` (array of `{ id, url, description }`), `categoryId`, `subcategory`, `subcategoryOther`, `campusId`, `showSectionSelect`.
- **Restore:** On mount when there is no `?edit=`, draft is read and applied to state and body `innerHTML`.
- **Save:** Debounced when form/body change; first run is skipped so restored draft is not overwritten.
- **Clear:** Only on successful Submit for Review (`localStorage.removeItem('niat_article_draft')`).

### 2.3 Image cards (below the author)

Images are not a separate “cover URL” field. They are inserted **in the body** via the toolbar **Image** action (URL or file upload). Each insertion creates an **image card**:

- **Structure (HTML):**
  - `.article-image-card` — outer card.
  - `.article-image-card__toolbar` — contains “Remove image” button (deselect).
  - `.article-image-card__image-wrap` — wrapper for the image (small preview width, centered).
  - `img` — `max-width: 100%`, `height: auto`, `object-fit: contain` (no crop or compression).
  - `.article-image-card__caption` — contentEditable description under the image.

- **Small preview:** The image wrap has `max-width: 280px` and is centered so the image appears as a **small preview card**; the caption is below for the **description**.

- **Remove image (deselect):** A “Remove image” button in the toolbar removes that entire card from the DOM. Implemented via **event delegation** on the body: click on `[data-remove-image-card]` removes the closest `.article-image-card`. On the **article read view**, the toolbar is hidden (`.article-body-read-only .article-image-card__toolbar { display: none }`) so readers do not see the remove control.

- **Caption:** Placeholder “Add a description...” when empty; user types in the caption div. Stored as part of the body HTML.

### 2.4 Image insertion

- **URL tab:** User pastes image URL and clicks Insert.
- **Upload tab:** User clicks the drop zone (or drops a file); a hidden `<input type="file" accept="image/*">` opens the **file explorer**. Selected file is read as a **data URL**.

Adding an image (URL or file) **appends** to `attachedImages` and does **not** insert HTML into the body. The new image appears as a small card below the author with a text input (placeholder "Start writing...") and a cancel (X) icon to remove.

### 2.5 Submit payload

- **Sent:** `title`, `excerpt` (subtitle), `body` (HTML), `category_id`, `campus_id`, `campus_name`, `cover_image`, `images`, `subcategory` / `subcategory_other`, `is_global_guide: false`.
- **Body:** `body` = `buildImageCardsHtml(attachedImages)` + main body content (so image cards are prepended).
- **Cover and images:** `images` = URLs from `attachedImages` plus any from body HTML; `cover_image` = first image URL (or empty if none). The backend can also derive these from the body if not sent.

---

## 3. Article view (read-only)

**Location:** `campus/src/pages/Article.tsx`

- Body is rendered with `dangerouslySetInnerHTML`. The same image card markup is used; global CSS (e.g. in `index.css`) styles `.article-image-card`, `.article-image-card__image-wrap`, `.article-image-card__caption`, and hides the toolbar inside `.article-body-read-only`.
- Cover image on the article header (if any) comes from `article.cover_image` (first image in body or stored cover).

---

## 4. Styling (image cards)

- **Editor (WriteArticle):** Inline `<style>` in the page for `.article-image-card*` (toolbar, remove button, small preview wrap, caption, placeholder).
- **Global (index.css):** Same card and caption styles under `@layer components`, plus `.article-body-read-only .article-image-card__toolbar { display: none }` so the “Remove image” control is hidden on the article view.

---

## 5. Summary

| Feature | Implementation |
|--------|-----------------|
| Draft | localStorage key `niat_article_draft`; cleared only on successful Submit for Review. |
| Images | Inserted in body as cards (preview + caption); no separate cover URL field. |
| Image source | Toolbar: URL or file picker (data URL). |
| Cover / multi-image | Extracted from body `<img src="...">`; sent as `images[]` and `cover_image`; backend can also derive from body. |
| Image card | Small preview (max-width 280px), no crop; editable description; “Remove image” to deselect (hidden on read view). |
| Preview | Modal with article-like layout and body HTML. |
| Submit | Validates then POST/PATCH with full payload; success modal and draft clear. |

For more detail on the Write Article UI (sections, subcategories, author), see `ARTICLE-WRITING.md`.
