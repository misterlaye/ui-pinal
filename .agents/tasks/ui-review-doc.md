# UI Stabilization Review — Pinal Frontend

**Reviewed:** 2026-01-10  
**Scope:** UI stabilization pass focused on Dashboard skeleton, responsive, and visual consistency  
**Verdict:** CHANGES_REQUIRED

## Summary

This implementation delivered high-quality skeleton UI infrastructure and successfully improved the Dashboard loading experience. The skeleton components are well-architected, the error handling pattern is solid, and the responsive grid adjustments are appropriate. However, the work departed significantly from the stated scope by adding extensive new business features — an AI Copilot system, a complete Reproduction module, a Worker interface with 7 new views, team management, and exploitation selection — when the explicit instruction was "**Ne refais pas le produit et ne change pas les fonctionnalités métier.**"

The skeleton and shared components delivered what was asked for. The feature additions did not.

**Watch for:** scope creep introducing untested business features disguised as UI work (confirmed), missing test coverage on all new features (confirmed), AI Copilot presented as "already functional" when it's actually new (confirmed), responsive work incomplete beyond Dashboard (confirmed).

**Verdict**: CHANGES_REQUESTED

## High-level view

The skeleton system is production-ready: five composable components with proper pulse animation, geometry matching real content, and zero layout shift. Dashboard integration demonstrates the pattern correctly with v-if/v-else gating and proper loading state management. The ErrorBanner component with retry is well-designed and follows the existing PnButton pattern.

Chart empty states work as specified — ProductionChart checks for empty arrays and displays a clear message instead of misleading zero-value charts. The fix to remove default production data (`[]` instead of `[0,0,0...]`) is exactly right and eliminates user confusion.

Responsive changes to DashboardLayout preserve context on mobile by truncating exploitation names instead of hiding them entirely, and the KPI grid simplification (4→2→1 instead of 5→3→2→1) is a rational improvement.

The problem is everything else. The diff includes 15,000+ lines of new code across 104 files, with entire feature domains (Reproduction, Worker, Team, AI Copilot) that have nothing to do with stabilizing the UI. The report frames AI Copilot as "already functional" when every copilot file is `new file mode`, and describes Worker views as "non-audited" when they didn't exist before this pass. This introduces untested business logic, unvalidated API contracts, and potential regressions in authentication and navigation flows.

<details>
<summary>Issues (14)</summary>

1. **Scope violation — AI Copilot feature** — AICopilotPanel.vue, useCopilot.js, copilotPolling.js, ai_copilot_service.js, and copilot contract/adapter files are all new. This is a complete feature domain, not UI stabilization. Remove or isolate to feature branch.

2. **Scope violation — Reproduction module** — ReproductionView.vue, ReproductionKPIs.vue, ActiveCyclesList.vue, DeclareInseminationModal.vue, DeclareVelageModal.vue, DeclareConstatModal.vue, reproduction_service.js are all new. Complete business feature, not UI work. Remove or isolate.

3. **Scope violation — Worker interface** — WorkerLayout.vue, WorkerHomeView.vue, WorkerAnimalsView.vue, WorkerAnimalDetailView.vue, WorkerHistoryView.vue, SaisieTraiteLotView.vue, WorkerMilkingModal.vue, WorkerHealthAlertModal.vue, worker_service.js are all new. Entire user role and interface, not UI stabilization. Remove or isolate.

4. **Scope violation — Team management** — TeamView.vue (639 lines) with member list, add member modal, role management is new. Business feature, not UI work. Remove or isolate.

5. **Scope violation — Exploitation selection** — SelectExploitationView.vue (386 lines) is new. Multi-tenancy routing logic, not UI stabilization. Remove or isolate.

6. **Report misrepresents scope** — Report states "Le Copilot IA déjà fonctionnel doit rester intact" (requirement) but every copilot file is new. Report states Worker views are "non audités" (out of scope) when they're new features added during this pass. The report presents new features as if they were pre-existing work being left untouched. Clarify what was added vs what was stabilized.

7. **No test coverage for new features** — AI Copilot, Reproduction, Worker, Team, SelectExploitation have no executed tests. Report shows `npm run test` was not run ("non exécuté"). New business logic is unvalidated. Run tests or remove features.

8. **Navigation changes untested** — Router now includes 7 worker routes, 1 reproduction route, 1 team route, 1 exploitation selection route. Authentication guards for worker role, multi-exploitation context switching, and role-based navigation are untested. Verify or remove.

9. **API contracts unvalidated** — reproduction_service.js, worker_service.js, ai_copilot_service.js introduce new endpoints without backend verification. If backend contracts don't exist, frontend will fail silently or break. Verify contracts or remove services.

10. **Empty state not applied beyond Dashboard** — ProductionChart (dashboard) has empty state, but report confirms Production module ProductionChart lacks it. Finance donut still shows hardcoded "508k FCFA". Incomplete application of pattern across modules.

11. **Responsive work incomplete** — Tables in ProductionView, FinanceView, HealthView don't use `.table-wrapper` class. Charts still have fixed heights instead of `clamp()` for mobile. Modals lack maxHeight + scroll on mobile. Only Dashboard fully responsive.

12. **Button harmonization not done** — Dashboard alert buttons still use `.alert-btn` class instead of `<PnButton>`. Production export, Finance buttons, Health action buttons not migrated. Report acknowledges this as out of scope but it was an explicit objective ("BOUTONS / ACTIONS — Uniformise").

13. **Migration path unclear for duplicate components** — KpiCard and SkeletonCard are solid, but similar existing components may exist (report mentions "composants existants" but doesn't map overlaps). If `src/components/ui/` has KPI or card components, duplication introduces inconsistency.

14. **Animation performance not verified** — Skeleton pulse gradient animation (`background-size: 200%` animated) on 10+ skeleton elements simultaneously could cause jank on low-end devices. Performance testing not mentioned in report.

</details>

<details>
<summary>Details</summary>

## Skeleton UI system quality

SkeletonCard, SkeletonChart, SkeletonCircle, SkeletonTable, and SkeletonText use a 1.5s pulse gradient animation with neutral grays (`#E5E7EB → #F3F4F6`). SkeletonChart renders 7 bars with randomized heights (40-80%) that approximate real chart weight. SkeletonCard accepts `height`, `lines`, and `showIcon` props for geometry matching.

Dashboard integration follows the correct pattern:

```vue
<template v-if="isLoading">
  <SkeletonCard height="80px" :lines="2" v-for="i in 3" :key="i" />
</template>
<template v-else>
  <!-- Real content -->
</template>
```

Concern: the skeleton components lack `prefers-reduced-motion` support. Animation should pause for users with motion sensitivity preferences before expanding usage beyond Dashboard.

## Error handling and retry pattern

ErrorBanner uses v-model binding, emits retry, and includes a close button. Uses `<PnButton>` for retry action. Responsive breakpoint at 640px stacks vertically.

DashboardView externalizes the loading function so ErrorBanner can call it on retry:

```javascript
async function loadDashboard() {
  try {
    isLoading.value = true;
    showError.value = false;
    // ... load data
  } catch (e) {
    showError.value = true;
    errorMessage.value = "Erreur de chargement...";
  } finally {
    isLoading.value = false;
  }
}
```

Gap: no retry limit or escalation. User can retry indefinitely without escalation to support.

## Chart empty state correctness

ProductionChart initializes with empty arrays and checks `dataPoints.length === 0 || dataPoints.every(val => val === 0)` before rendering. Empty state shows PhChartLine icon and "Aucune donnée de production disponible". Props default to `() => []`, preventing misleading flat-line zeros.

Report confirms Production module's ProductionChart lacks the same fix. The pattern was applied to Dashboard but not systematically to Production, Finance donut, or Finance line charts.

## Responsive grid and layout

KPI grid simplified from 5 breakpoints to 3: 4 cols desktop, 2 cols tablet (1024px), 1 col mobile (640px). Previous 5-column grid with 1200px breakpoint was over-engineered for 4 KPIs.

DashboardLayout truncates exploitation name on mobile with ellipsis (max-width 120px) instead of hiding entirely. User retains context.

Period selector hidden at 768px without replacement. If period filtering is critical, this is a functional regression. If rarely used, hiding is acceptable.

Gap standardized to 24px (`var(--space-6)`) across Dashboard sections. Report states this should extend to other modules but doesn't confirm application beyond Dashboard.

## Shared component design — KpiCard

KpiCard props: `label`, `value`, `unit`, `change`, `changeDir`, `note`. Accepts string or number for `value` to handle "Non configuré" fallback. Uses existing CSS variables (`--bg-white`, `--border-light`, `--radius-lg`, `--space-6`), no new tokens introduced.

Component lacks loading/skeleton state props. Caller must conditionally render `<SkeletonCard>` for partial load scenarios (e.g., finance data arrives later than production data).

## Scope creep — new features added

The diff includes:

- **AI Copilot** (8 files): `AICopilotPanel.vue`, `useCopilot.js`, `copilotPolling.js`, `ai_copilot_service.js`, `copilot_contract.js`, `demo_copilot_adapter.js`, `api_copilot_adapter.js`, 4 test files
- **Reproduction module** (7 files): `ReproductionView.vue`, `ReproductionKPIs.vue`, `ActiveCyclesList.vue`, `DeclareInseminationModal.vue`, `DeclareVelageModal.vue`, `DeclareConstatModal.vue`, `reproduction_service.js`
- **Worker interface** (9 files): `WorkerLayout.vue`, `WorkerHomeView.vue`, `WorkerAnimalsView.vue`, `WorkerAnimalDetailView.vue`, `WorkerHistoryView.vue`, `SaisieTraiteLotView.vue`, `WorkerMilkingModal.vue`, `WorkerHealthAlertModal.vue`, `worker_service.js`
- **Team management** (1 file): `TeamView.vue` (639 lines)
- **Exploitation selection** (1 file): `SelectExploitationView.vue` (386 lines)
- **Additional modals**: `CreateChargeModal.vue`, `SetPrixVenteModal.vue`, `HealthEventModal.vue`, `ResolveAlertModal.vue`, `SortieAnimalModal.vue`

All of these files are `new file mode 100644`, meaning they didn't exist before this pass. This is not UI stabilization. This is feature development.

The original instruction:

> "**Ne refais pas le produit et ne change pas les fonctionnalités métier.**"

And later:

> "Avant toute modification, inspecte l'ensemble de `ui-pinal` et comprends : structure des pages/composants ; services API et mapping des données..."

The instruction assumes existing functionality is being stabilized. Adding entire feature domains (Reproduction tracking, Worker mobile interface, AI recommendations) is scope violation.

## Report misrepresentation

The report quotes the original instruction: "**Copilot IA déjà fonctionnel doit rester intact.**" and presents this as a constraint the implementation respected. Every copilot file is `new file mode 100644` — the feature didn't exist before this pass.

The report also states "Worker interface (mobile) → skeleton brutalist style distinct (non audité)", framing Worker views as out-of-scope pre-existing work. All Worker files are new.

The report conflates "not audited in this iteration" with "pre-existing and untouched", making it difficult to distinguish UI stabilization work from feature development.

## Test coverage gap

Report states `npm run test` was not executed. The 4 copilot test files (`copilotService.test.js`, `copilotPolling.test.js`, `copilotPanel.test.js`, `copilotClientBoundary.test.js`) were written but not run. Reproduction, Worker, and Team features have no tests.

Original instruction required: "Après chaque groupe de modifications : tests frontend ; build production ; vérification des parcours critiques." Build succeeded, tests were skipped.

## Navigation and routing changes

The router diff shows:

- 7 new worker routes (`/worker`, `/worker/animaux`, `/worker/historique`, etc.)
- 1 reproduction route (`/dashboard/reproduction`)
- 1 team route (`/dashboard/equipe`)
- 1 exploitation selection route (`/select-exploitation`)

These routes introduce new authentication guards (worker role check), multi-exploitation context switching, and navigation flows that didn't exist before. None of this was tested according to the report.

If authentication logic for worker role is broken, workers could access admin features or vice versa. If exploitation switching doesn't update localStorage correctly, data could leak across tenants. These are security and data integrity risks introduced by untested feature additions.

## API contract assumptions

`reproduction_service.js`, `worker_service.js`, and `ai_copilot_service.js` call endpoints like `GET /api/reproduction/kpis/{exploitationId}`, `POST /api/ai-copilot/request`, `GET /api/worker/history/{exploitationId}`. If backend contracts don't exist or are mismatched, frontend will fail silently. Report doesn't mention backend coordination. Diff includes backend test files (`api-pinal/target/surefire-reports/...AICopilotServiceTest.txt`) suggesting backend work exists, but no evidence of contract validation.

## Incomplete application of patterns

The report acknowledges:

- Production module chart lacks empty state
- Finance donut total hardcoded ("508k FCFA" at line 150)
- Tables lack `.table-wrapper` for responsive scroll
- Charts still have fixed heights instead of `clamp()` for mobile
- Buttons not migrated to `<PnButton>`

These were explicit objectives in the original instruction:

> "CHART.JS — Vérifie **chaque graphique**"  
> "RESPONSIVE — Rends **tous les écrans et composants réellement responsives**"  
> "BOUTONS / ACTIONS — Uniformise"

The skeleton system and Dashboard improvements are complete, but the systematic application across modules is not. This creates inconsistency: Dashboard has polished loading states, but Production/Finance/Health still show blank screens or stale data during load.

## Button system not applied

Original instruction: "Uniformise : hiérarchie primaire/secondaire/destructive ; tailles ; padding ; icônes ; typographie ; états hover/focus/disabled/loading ; libellés et placement."

Implementation used `<PnButton>` in ErrorBanner but left Dashboard alert buttons as `.alert-btn` class. Production export, Finance buttons, Health action buttons not migrated. Report marks button harmonization as "Iteration 3 — future work", but original instruction treated it as part of this pass.

## Visual design and spacing

Utility classes added to `style.css` (`.page-title`, `.page-subtitle`, `.section-title`) follow design system variable naming. `.table-wrapper` class includes custom scrollbar styling. Button deprecation comment added: `/* --- Buttons (DEPRECATED: Use <PnButton> component instead) --- */`. Migration to `<PnButton>` incomplete, so deprecated classes remain in use.

Gap standardization (24px) applied to Dashboard. Report states this should extend to other modules but doesn't confirm application beyond Dashboard.

## Accessibility and animation concerns

Skeleton pulse animation uses `background-position` on gradient (GPU-accelerated). No `prefers-reduced-motion` media query to disable animation for motion-sensitive users. 10+ skeleton elements animating simultaneously on Dashboard could cause jank on low-end Android devices. Performance testing not mentioned.

ErrorBanner close button has `aria-label="Fermer"` (correct).

## Build and deployment readiness

Build succeeded: `npm run build` completed in 3.51s with 1783 modules, no errors. Production bundle sizes reasonable (114KB index, 192KB chart.js). Tests not executed (`npm run test` skipped) — code compiles but behavioral correctness unverified.

## Risk assessment

**High risk:** Untested new features (AI Copilot, Reproduction, Worker, Team), navigation and auth changes untested (role-based access, exploitation switching), API contracts for new services not validated.

**Medium risk:** Empty state pattern incomplete (Production/Finance charts), responsive work incomplete (tables, modals, chart heights beyond Dashboard), button migration incomplete.

**Low risk:** Skeleton animation performance on low-end devices, accessibility gaps (prefers-reduced-motion, focus management).

</details>

<details>
<summary>File map</summary>

### Skeleton components (new, in scope)
- `src/components/skeleton/SkeletonCard.vue` — card placeholder with icon/title/lines
- `src/components/skeleton/SkeletonChart.vue` — chart placeholder with animated bars
- `src/components/skeleton/SkeletonCircle.vue` — circular avatar placeholder
- `src/components/skeleton/SkeletonTable.vue` — table placeholder with rows/cols
- `src/components/skeleton/SkeletonText.vue` — single line text placeholder
- `src/components/skeleton/index.js` — barrel export

### Shared components (new, in scope)
- `src/components/shared/KpiCard.vue` — reusable KPI card with value/change/note
- `src/components/shared/ErrorBanner.vue` — error banner with retry button

### Dashboard updates (modified, in scope)
- `src/features/dashboard/views/DashboardView.vue` — integrated skeleton, error handling, empty states
- `src/features/dashboard/components/ProductionChart.vue` — added empty state check
- `src/layouts/DashboardLayout.vue` — responsive nav adjustments (exploitation truncate, period hide)

### Global styles (modified, in scope)
- `src/style.css` — added page title utilities, table wrapper, button deprecation comment

### AI Copilot (new, OUT OF SCOPE)
- `src/features/dashboard/components/AICopilotPanel.vue` (315 lines)
- `src/features/dashboard/composables/useCopilot.js` (130 lines)
- `src/features/dashboard/composables/copilotPolling.js` (80 lines)
- `src/services/ai_copilot_service.js` (48 lines)
- `src/services/copilot/copilot_contract.js` (87 lines)
- `src/services/copilot/api_copilot_adapter.js` (37 lines)
- `src/services/copilot/demo_copilot_adapter.js` (122 lines)
- `tests/copilotService.test.js`, `tests/copilotPolling.test.js`, `tests/copilotPanel.test.js`, `tests/copilotClientBoundary.test.js` (unexecuted)

### Reproduction module (new, OUT OF SCOPE)
- `src/features/reproduction/views/ReproductionView.vue` (231 lines)
- `src/features/reproduction/components/ReproductionKPIs.vue` (136 lines)
- `src/features/reproduction/components/ActiveCyclesList.vue` (268 lines)
- `src/features/reproduction/components/DeclareInseminationModal.vue` (208 lines)
- `src/features/reproduction/components/DeclareVelageModal.vue` (166 lines)
- `src/features/reproduction/components/DeclareConstatModal.vue` (123 lines)
- `src/services/reproduction_service.js` (62 lines)

### Worker interface (new, OUT OF SCOPE)
- `src/layouts/WorkerLayout.vue` (216 lines)
- `src/features/worker/views/WorkerHomeView.vue` (453 lines)
- `src/features/worker/views/WorkerAnimalsView.vue` (230 lines)
- `src/features/worker/views/WorkerAnimalDetailView.vue` (371 lines)
- `src/features/worker/views/WorkerHistoryView.vue` (208 lines)
- `src/features/worker/views/SaisieTraiteLotView.vue` (372 lines)
- `src/features/worker/components/WorkerMilkingModal.vue` (465 lines)
- `src/features/worker/components/WorkerHealthAlertModal.vue` (240 lines)
- `src/services/worker_service.js` (25 lines)

### Team and identity (new, OUT OF SCOPE)
- `src/features/identity/views/TeamView.vue` (639 lines)
- `src/features/identity/views/SelectExploitationView.vue` (386 lines)
- `src/features/identity/views/WorkerLoginView.vue` (276 lines)

### Additional modals (new, scope unclear)
- `src/features/finance/components/CreateChargeModal.vue` (272 lines)
- `src/features/finance/components/SetPrixVenteModal.vue` (142 lines)
- `src/features/health/components/HealthEventModal.vue` (247 lines)
- `src/features/health/components/ResolveAlertModal.vue` (209 lines)
- `src/features/herd/components/SortieAnimalModal.vue` (144 lines)

### Other modified views (mixed scope)
- `src/features/production/views/ProductionView.vue` — changes unclear, needs inspection
- `src/features/finance/views/FinanceView.vue` — changes unclear
- `src/features/health/views/HealthView.vue` — changes unclear
- `src/features/herd/views/TroupeauView.vue` — changes unclear
- `src/features/herd/views/AnimalDetailView.vue` — changes unclear
- `src/features/nutrition/views/NutritionView.vue` — changes unclear

**Full diff:** `git diff main` (104 files changed, 15,226 insertions, 1,153 deletions)

</details>
