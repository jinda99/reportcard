# DECISIONS.md

Architectural and product decisions made for the **ReportCard** portal, following instructions in Section 0.

---

## 1. Multi-Tenancy Architecture
- **Decision:** Shared schema with a mandatory `schoolId` column on every tenant-owned table.
- **Enforcement:** Enforced in API route handlers and server actions via session extraction (`session.user.schoolId`). Tenant-aware database helper wraps queries to prevent cross-tenant data leakage.
- **Future Target:** Schema-per-tenant documented as long-term roadmap post-MVP once multi-region or enterprise requirements mandate it.

---

## 2. Grading Engine Contract (Section 8 Assumptions)
- **Score Composition:** CA component scores + Exam score must sum to a total out of 100.
  - Default configuration: Test 1 (10), Test 2 (10), Project/Assignment (20), Exam (60) = 100.
- **Grading Schemes:**
  - **WAEC 9-Point (Default Nigerian Standard):**
    - `75 - 100`: A1 (Excellent, 1 point)
    - `70 - 74`: B2 (Very Good, 2 points)
    - `65 - 69`: B3 (Good, 3 points)
    - `60 - 64`: C4 (Credit, 4 points)
    - `55 - 59`: C5 (Credit, 5 points)
    - `50 - 54`: C6 (Credit, 6 points)
    - `45 - 49`: D7 (Pass, 7 points)
    - `40 - 44`: E8 (Pass, 8 points)
    - `0 - 39`: F9 (Fail, 9 points)
  - **Letter A–F Scale:**
    - `70 - 100`: A (Excellent, 1 point)
    - `60 - 69`: B (Very Good, 2 points)
    - `50 - 59`: C (Good, 3 points)
    - `45 - 49`: D (Pass, 4 points)
    - `40 - 44`: E (Fair, 5 points)
    - `0 - 39`: F (Fail, 6 points)
- **Position Calculation:**
  - **Ranking System:** Standard competition ranking ("1224" rank tie-breaker). Tied scores receive identical positions; subsequent positions account for ties.
  - **Subject Position:** Computed per `classSubjectId` per `termId` based on `totalScore`.
  - **Class Position:** Computed per `classId` per `termId` based on overall `average` (and total score as tie-breaker).

---

## 3. Deferred Features (Section 12 Non-Negotiables)
As commanded in Section 0 & 12, the following are strictly excluded from MVP:
1. Native iOS / Android apps (Mobile PWA web is prioritized).
2. True offline score entry with background sync (Synchronous autosave with network check is used).
3. CBT / online student exam taking.
4. Direct parent–teacher chat messaging.
5. Attendance module beyond static term totals (`attendanceDaysOpen`, `attendanceDaysPresent`) on the report card.
6. Multi-term historical analytics and trend graphs.
7. Dark mode.
8. SMS provider integration.
9. Timetable, school fees, library, and hostel management modules.
10. Student role logins (parents log in; students do not have credentials in MVP).

---

## 4. Authentication & Role Permissions
- **Framework:** NextAuth.js (Auth.js v4) with Credentials provider and JWT session strategy.
- **JWT Payload:** Includes `userId`, `email`, `fullName`, `role` (`PLATFORM_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `PARENT`), `schoolId`, and `membershipId`.
- **Role Isolation:** Middleware guards ensure teachers cannot access admin or parent paths, parents only see `/parent/*`, and admins only see their own `schoolId`.
- **Parent-Student Binding:** Parents only view results for students linked via `ParentStudent`.
- **Publication Gate:** No scores or report cards are visible to parents until `ResultPublication.status === 'PUBLISHED'`.

---

## 5. UI/UX Contract (Section 10 Requirements)
- **States:** Every screen and table provides:
  1. Animated Loading skeleton / spinner state
  2. Clear Empty state with actionable call-to-action
  3. User-friendly Error state with retry
  4. Tested mobile responsiveness verified down to 360px viewport width
- **Printing:** Clean CSS `@media print` stylesheets for parents and administrators to print high-quality physical report cards.
