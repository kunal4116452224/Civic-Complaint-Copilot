# Civic Complaint Copilot — Implementation Plan (Version 4 final)

## 1. Core Data & Helpers (in `src/app/page.tsx`)
- **Asset Mapping**: Add `civicAssets` array mapping real images from `public/assets/` to `garbage`, `pothole`, and `street` issue types. Prevent use of placeholder or stock images.
- **Activity Data**: Create `ACTIVITY_FEED` static array of 6 items using realistic descriptions, varying timestamps, and thumbnails sourced from `civicAssets`.
- **Time Formatting**: Add `relativeTime(iso: string)` helper function to generate realistic relative times like "2h ago", "Yesterday".

## 2. New Component (`src/components/BeforeAfterCard.tsx`)
- **Structure**: Create a streamlined component that manages its own image cycling.
- **Behavior**: Auto-cycle (`Before` → `Progress` → `After`) every 3 seconds using `framer-motion` crossfade (`AnimatePresence`).
- **Interaction**: Pause auto-cycling when the user hovers over the card. Add `scale: 1.03` hover transition.
- **Realism Badges**: Provide a small "FIELD DATA" or "REAL CASE" tag in the top-left corner.
- **Status Overlay**: Add a solid pill in the bottom-left (`Reported` [red], `In Progress` [yellow], `Resolved` [green]) matching the current sequence step.
- *Constraint Check*: Removed complex CSS `clip-path` split view and hover-triggered cycling for better stability.

## 3. Page Enhancements (`src/app/page.tsx`)

### A. Hero Section (Home Screen)
- Keep the existing headline and call-to-action buttons on the left.
- Replace the right-side visual with a rotating `BeforeAfterCard` component that cycles through the three `civicAssets` categories every 4 seconds. Add a category label above it.

### B. Live Activity Feed (Home Screen)
- Add a "Recent Activity" list below the main statistics grid.
- Map over `ACTIVITY_FEED` displaying the thumbnail, icon (🧹, 🚧, 🔧), realistic text, relative time, and status dot.
- Apply a `framer-motion` staggered fade-in animation (`0.1s` delay per item).

### C. Report Screen
- **Evidence Guidance**: Below the image upload dropzone, insert an "Evidence Examples" section showing three 80x60 thumbnails mapped to the `before` images from `civicAssets` with non-interactive captions.

### D. Result Screen
- Place a `BeforeAfterCard` at the very top of the screen structure.
- **Image Logic**: 
  - `before`: Use the user's uploaded image. If no user image exists, use the `before` image of the matched `civicAsset`.
  - `after`: Use the `after` image of the matched `civicAsset`.
  - *Fallback*: If the AI `issue_type` doesn't strictly match our 3 asset categories, fallback to handling it as "garbage" to avoid broken UI components.
- Keep the generated complaint text and authority details below the visual component.

### E. Dashboard Screen
- **Empty State**: Render a clean city image and text ("No active issues in your area") if no complaints exist.
- **Card Enhancements**: 
  - Show a 48x48 rounded thumbnail from `civicAssets` based on the complaint's `issue_type` (defaulting to garbage/other if mismatched).
  - Add standard colored borders or rings representing SLA status.
- **Municipal Progress Bar**: Add an animated horizontal bar below the card to signify resolution status. Use randomized variance for realism:
  - Submitted: 10%–25%
  - In Progress: 40%–80%
  - Resolved: 100%
- **Escalate Action**: Present a red-outlined "Escalate" button when the complaint is "Submitted", triggering an "Escalated to senior officer" success toast upon click.

## 4. UI/UX Polish (Global)
- **Background Texture**: Swap the flat dark background for a very low-opacity textured city or subtle blur layer to improve the authentic feel.
- **ConfidenceBadge Upgrade**: Modify `src/components/ConfidenceBadge.tsx` to include an animated scaling ring (`animate={{ scale: [1, 1.05, 1] }}`) around the dot, and a hover tooltip that surfaces context like "Department: [Dept]".
- **Color Identity**: Adhere to structured civic colors for status tracking (Red = Urgent/Reported, Yellow = In progress, Green = Resolved).

## 5. Follow-Up Documentation
- Update `directives/civic-complaint-copilot.md` to catalog the new structural mapping, asset pipeline, and usage of `BeforeAfterCard`.
