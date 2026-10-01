# Plan d'implémentation — Stabilisation et harmonisation UI Pinal

## Résumé de l'audit

**Projet:** Application Vue 3 + Vite de gestion d'exploitation laitière  
**Build:** `npm run build` | **Test:** `npm run test` (Vitest)  
**Frameworks:** Vue 3 (Composition API), Vue Router, Chart.js 4.5.1, Axios

### Composants UI réutilisables existants
- `PnButton.vue` — 3 variants (primary, secondary, ghost), 3 sizes, loading state ✅
- `PnInput.vue` — label, error, hint, disabled, required ✅
- `PnModal.vue` — teleport, backdrop, escape key, maxWidth ✅
- `PnCheckbox.vue`, `PnOtpInput.vue`, `PnStepper.vue`, `PnDrawer.vue`, `PnLogo.vue`

### Design tokens (style.css)
Système cohérent de variables CSS :
- Couleurs : `--primary`, `--primary-hover`, `--text-dark`, `--text-muted`, `--bg-page`, etc.
- Spacing : `--space-1` à `--space-16` (4px → 64px)
- Radius : `--radius-sm` à `--radius-full`
- Shadows : `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Typography : `--font-size-xs` à `--font-size-4xl`
- Transitions : `--transition-fast`, `--transition-base`, `--transition-slow`

### Modules fonctionnels
1. **Dashboard** — Vue d'ensemble (alertes, production, KPIs, troupeau)
2. **Troupeau** — Gestion animaux (liste, détails, CRUD)
3. **Production** — Suivi laitier, traites, historique
4. **Santé** — Alertes sanitaires, historique, vaccinations, stress thermique
5. **Reproduction** — (à auditer)
6. **Nutrition** — (à auditer)
7. **Finance** — Revenus, charges, rentabilité, transactions
8. **Worker** — Interface mobile pour employés (traite, saisie lot, historique)
9. **Identity** — Onboarding, auth, gestion exploitation/équipe
10. **AI Copilot** — Panel d'analyse IA sur anomalies (fonctionnel, à préserver)

---

## PROBLÈMES IDENTIFIÉS

### 1. RESPONSIVE

#### 1.1 Navigation / Layout
**DashboardLayout.vue (ligne 120-250)**
- ❌ `.topnav-links` masqué `@media (max-width: 1024px)` mais menu mobile non testé
- ❌ `.topnav-exploitation` masqué sur mobile (640px) — perte d'info contexte
- ❌ `.topnav-period` masqué sur tablette — loss de contrôle période
- ⚠️ Menu mobile `.topnav-mobile-menu` s'affiche mais pas testé sur vrais devices
- ✅ Mobile toggle fonctionne

**WorkerLayout.vue (ligne 80-140)**
- ✅ Layout mobile-first bien structuré (bottom nav, 100dvh)
- ⚠️ Pas de breakpoints desktop — si ouvert sur desktop, layout mobile s'affiche

#### 1.2 Dashboard (DashboardView.vue)
**Ligne 800-900 (responsive)**
- ❌ `.production-grid` passe de `2fr 1fr` à `1fr` sur tablette (1024px) — OK
- ❌ `.kpi-grid` : 5 cols → 3 cols (1200px) → 2 cols (1024px) → 1 col (768px) — trop de breakpoints, manque de cohérence
- ❌ `.alert-card` passe en `flex-direction: column` sur mobile mais actions (`alert-card-actions`) non optimisées
- ❌ Herd bar (`.herd-bar`) passe en colonne sur tablette mais bouton prend 100% — perte de compacité

#### 1.3 TroupeauView
**Ligne 450-550 (responsive)**
- ❌ `.toolbar` passe en colonne sur 768px mais filtres pill-filters cassent l'alignement
- ❌ `.grid-container` utilise `auto-fill, minmax(280px, 1fr)` — bon mais peut créer 1 col trop tôt sur tablette
- ❌ `.stats-section` 3 cols → 1 col (1024px) — transition brutale, pas de breakpoint intermédiaire

#### 1.4 Tables
**ProductionView, FinanceView, HealthView**
- ❌ **Aucun responsive sur les tableaux** — `ProductionTable.vue`, `FinanceTransactions.vue` n'ont pas de scroll horizontal
- ❌ Débordement horizontal probable sur mobile

#### 1.5 Charts
**ProductionChart.vue, FinanceCharts.vue**
- ✅ `responsive: true, maintainAspectRatio: false` dans options Chart.js
- ⚠️ Hauteur fixe (300px, 350px) — peut être trop grande sur mobile
- ⚠️ Légende chart finance (pie) positionnée `right` — déborde sur mobile

#### 1.6 Modals
**PnModal.vue (ligne 80-100)**
- ❌ `.modal-wrapper` padding 24px — peut être trop sur petit mobile (< 400px)
- ❌ Pas de maxHeight sur `.modal-panel` — contenu long peut déborder

#### 1.7 Forms
**Onboarding, création animal, etc.**
- ⚠️ Formulaires longs (CreateExploitationView, FirstAnimalView) non auditées
- ❌ Inputs empilés correctement mais pas de test overflow sur petits écrans

---

### 2. DONNÉES / API

#### 2.1 Dashboard (DashboardView.vue ligne 20-90)
```javascript
const [summaryData, anomaliesData, prodData, aiCapability] = await Promise.all([...])
```
- ✅ Appels parallèles corrects
- ✅ Mapping `summary.value.troupeau`, `summary.value.finance`, `summary.value.production` cohérents
- ⚠️ `prodData.animalProduction` peut être vide — gestion OK (ligne 60-67)
- ⚠️ Pas de retry en cas d'erreur réseau

#### 2.2 Production (ProductionView.vue ligne 15-25)
```javascript
const data = await getProductionSummary();
```
- ❌ **Service retourne mock si échec** (production_service.js ligne 12-19) — masque les erreurs
- ❌ Pas d'indication utilisateur si données mock affichées
- ✅ KPIs, chartData, animalProduction mappés correctement

#### 2.3 Finance (FinanceView.vue ligne 20-35)
```javascript
if (error.response && error.response.status === 422) {
  missingPriceError.value = true;
}
```
- ✅ Gestion erreur 422 (prix manquant) bien implémentée
- ✅ Modal configuration prix proposée
- ⚠️ Autres erreurs API non affichées à l'utilisateur

#### 2.4 Santé (HealthView.vue ligne 15-25)
- ✅ Mapping alertes et historique correct
- ⚠️ Pas de gestion état vide si aucune alerte

#### 2.5 Troupeau (TroupeauView.vue ligne 25-50)
- ✅ Mapping races depuis API externe `getActiveRaces()`
- ✅ CRUD complet (create, update, delete, changeStatus)
- ⚠️ Refresh après CRUD fait mais pas de gestion erreur réseau

#### 2.6 Worker (WorkerHomeView.vue ligne 20-35)
- ✅ `getWorkerHomeData()` retourne dashboard worker
- ⚠️ Erreur chargement non affichée (console.error seulement)

#### 2.7 Race conditions / duplicate calls
- ✅ Pas de race conditions détectées
- ✅ Pas d'appels dupliqués dans les composants auditées
- ⚠️ Pas de cache / state management global (Vuex/Pinia) — rechargement complet à chaque navigation

---

### 3. CHART.JS

#### 3.1 Dashboard — ProductionChart.vue (dashboard)
**Ligne 25-50**
```javascript
const chartData = shallowRef({
  labels: props.labels,
  datasets: [{
    data: props.dataPoints,
    ...
  }]
});
```
- ✅ Source : `props.dataPoints` depuis `DashboardView` ligne 15-25
- ✅ Labels : `props.labels` depuis API `prodData.chartData.labels`
- ⚠️ Si API retourne tableau vide, chart affiche `[0,0,0,0,0,0,0]` (ligne 15 DashboardView) — **données par défaut masquent absence de données**
- ❌ **Pas d'état vide/loading/error** sur le chart lui-même
- ✅ Gradient fill, hover, tooltip corrects
- ✅ Axes configurés (y: beginAtZero false, x: labels)

#### 3.2 Production — ProductionChart.vue (production)
**Ligne 40-80**
```javascript
datasets: [
  { label: 'Semaine actuelle', data: props.chartData.currentWeek },
  { label: 'Semaine précédente', data: props.chartData.previousWeek }
]
```
- ✅ Source : `props.chartData` depuis ProductionView
- ✅ Deux datasets (currentWeek vs previousWeek) bien différenciés
- ⚠️ Si `currentWeek` ou `previousWeek` vides, chart affiche ligne vide — **pas de message**
- ❌ **Pas de vérification alignement temporel labels/data**
- ✅ Responsive, tooltip, legend custom OK

#### 3.3 Finance — FinanceCharts.vue
**Ligne 30-70 (Bar) + 85-110 (Pie)**
```javascript
// Bar
datasets: [
  { label: 'Revenus', data: props.revenueData.revenues },
  { label: 'Charges', data: props.revenueData.charges }
]
// Pie
datasets: [{ data: props.repartitionData.data }]
```
- ✅ Sources : `props.revenueData` et `props.repartitionData` depuis FinanceView
- ✅ Labels mois, datasets revenus/charges bien mappés
- ⚠️ Pie chart a label "Total 508k FCFA" hardcodé ligne 150 — **devrait venir de props**
- ❌ **Pas de gestion données nulles/vides**
- ✅ Formatage monétaire dans tooltip correct (Intl.NumberFormat)

#### 3.4 Herd — DonutChart.vue, LactationChartWidget.vue
**Non auditées dans cette phase** (TroupeauView les utilise)
- ⚠️ À vérifier : mapping races, statuts

#### 3.5 Problèmes généraux Chart.js
- ❌ **Aucun chart n'affiche un message si données vides** (array vide ou null)
- ❌ **Pas de skeleton/loading pendant fetch des données** — juste spinner texte global
- ⚠️ Hauteurs fixes (240px, 300px, 350px) — responsive OK mais peut être optimisé mobile
- ✅ Configurations Chart.js cohérentes (fonts Inter, couleurs design system)

---

### 4. LOADING / SKELETON UI

#### 4.1 États actuels
**Dashboard (DashboardView.vue ligne 90)**
```javascript
isLoading.value = true;
// ...fetch...
isLoading.value = false;
```
- ❌ Pendant `isLoading`, **aucun contenu affiché** — écran vide
- ❌ Pas de skeleton UI

**Troupeau (TroupeauView.vue ligne 360-380)**
```html
<div class="grid-container" v-else>
  <div v-for="i in 12" :key="i" class="skeleton-card">
    <div class="skel-header">...</div>
  </div>
</div>
```
- ✅ **Seul composant avec skeleton** (cartes animaux)
- ✅ Animation pulse CSS correct
- ⚠️ Skeleton hardcodé dans composant — pas réutilisable

**Production, Finance, Santé, Nutrition, Reproduction**
```html
<div v-if="isLoading" class="loading-state">
  Chargement du tableau de bord...
</div>
```
- ❌ Juste un texte centré — **pas de skeleton**

**Worker (WorkerHomeView.vue ligne 120)**
```html
<div v-else style="padding: 24px; text-align: center;">Chargement...</div>
```
- ❌ Texte inline — **pire expérience**

#### 4.2 Layout shift
- ❌ Dashboard : contenu apparaît brutalement (charts, cartes KPIs, alertes) — **layout shift majeur**
- ❌ Production/Finance : idem, grilles/charts surgissent
- ✅ Troupeau : skeleton conserve géométrie → minimal layout shift

#### 4.3 Spinner existant
**style.css ligne 250-265**
```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid transparent;
  border-top-color: currentColor;
  ...
}
```
- ✅ Spinner réutilisable défini
- ⚠️ Utilisé uniquement dans PnButton loading state

---

### 5. BOUTONS / ACTIONS

#### 5.1 Variantes identifiées

**PnButton.vue (ligne 30-100)**
- ✅ 3 variants : `primary`, `secondary`, `ghost`
- ✅ 3 sizes : `sm` (36px), `md` (48px), `lg` (52px)
- ✅ États : `disabled`, `loading`, `full` (width 100%)
- ✅ Slot pour icônes/contenu
- ✅ Animation scale(0.98) au clic

**Boutons CSS globaux (style.css ligne 180-230)**
- ⚠️ Classes `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-full`, `.btn-lg` dupliquent PnButton
- ⚠️ Inconsistance : hauteur `.btn` = 48px vs `.btn-lg` = 52px vs PnButton lg = 52px

**Boutons inline dans vues**
```html
<!-- DashboardView ligne 350 -->
<button class="alert-btn alert-btn--outline">Détails</button>
<button class="alert-btn alert-btn--accent">Copilot IA</button>

<!-- TroupeauView ligne 120 -->
<button class="btn-primary" @click="openCreateDrawer">
  <PhPlus :size="16" weight="bold" />
  Ajouter un animal
</button>

<!-- ProductionView ligne 45 -->
<button class="btn-export" @click="exportReport">...</button>

<!-- FinanceView ligne 65 -->
<button class="btn-secondary">Prix du lait</button>
<button class="btn-primary">Nouvelle charge</button>

<!-- WorkerLayout bottom nav (ligne 110-140) -->
<button class="nav-item">...</button>
```

#### 5.2 Incohérences détectées

| Composant | Classe | Hauteur | Padding | Border | Radius | BG Color |
|-----------|--------|---------|---------|--------|--------|----------|
| PnButton primary | `.pn-btn--primary` | 48px (md) | 0 32px | none | 8px | #C87533 |
| CSS global | `.btn-primary` | 48px | 0 32px | none | 8px | #C87533 |
| TroupeauView | `.btn-primary` | auto | 10px 20px | none | 8px | #C87533 |
| Dashboard alert | `.alert-btn--accent` | auto | 6px 14px | none | 6px | #C87533 |
| Production export | `.btn-export` | auto | 8px 16px | 1px solid | 8px | white |
| Finance secondary | `.btn-secondary` | auto | 8px 16px | 1px solid | 8px | white |
| Worker card action | `.action-card-main` | auto | 16px | 2px solid | 0 | #EBC137 |
| Worker bottom nav | `.nav-item` | 72px | 0 | 2px solid | 0 | white |

**Problèmes :**
1. ❌ **5 styles différents pour "bouton primaire"** (padding, hauteur)
2. ❌ **Alert buttons** (ligne 350 DashboardView) custom styles — devraient utiliser PnButton
3. ❌ **Export/secondary** parfois 8px 16px, parfois 10px 20px
4. ❌ **Worker UI** style brutalist distinct (border 2px, shadow 4px, no radius) — intentionnel mais non documenté
5. ⚠️ **Icônes** : tailles variées (14px, 16px, 20px, 24px) — pas de règle

#### 5.3 États manquants
- ❌ Boutons sans état `loading` (export CSV, delete, resolve alert) — pas de feedback pendant API call
- ⚠️ États `hover` inconsistents (certains scale, d'autres background)
- ❌ États `focus` : seul PnButton a un focus visible (keyboard nav)

---

### 6. DESIGN VISUEL

#### 6.1 Hiérarchie typographique
**style.css ligne 120-140**
```css
h1 { font-size: var(--font-size-4xl); } /* 36px */
h2 { font-size: var(--font-size-3xl); } /* 30px */
h3 { font-size: var(--font-size-2xl); } /* 24px */
h4 { font-size: var(--font-size-xl); } /* 20px */
```
- ✅ Échelle définie
- ⚠️ **Inconsistance dans l'usage :**
  - Dashboard h1 `.dash-greeting` = 28px (custom) vs h1 global = 36px
  - Troupeau `.page-title` = 32px vs h1 = 36px
  - Production `.page-title` = 28px
  - ❌ **Pas de classes utilitaires `.heading-1`, `.heading-2`** — chaque vue redéfinit

#### 6.2 Rythme vertical / espacement
- ✅ Variables `--space-*` bien définies (4px à 64px)
- ⚠️ **Usage inconsistant :**
  - Dashboard gaps : 28px entre sections
  - Production gaps : 32px entre sections
  - Troupeau gaps : 24px entre sections
  - ❌ Pas de règle unifiée "gap entre sections de page"

#### 6.3 Whitespace / densité
- ✅ Cards padding : généralement 24px (cohérent)
- ⚠️ **Worker UI** : padding 16px, 20px — plus dense (mobile-first)
- ❌ Certaines vues surchargées :
  - Dashboard : 4 sections empilées, KPIs grid 5 cols → dense sur desktop, vide sur mobile
  - Finance : KPIs + 2 charts + rentability bar + table → scroll long

#### 6.4 Alignement / grille
- ✅ `.dashboard-container` max-width 1360px centré
- ✅ Grids cohérentes (CSS Grid, auto-fill, gap 16-24px)
- ❌ **TroupeauView toolbar** : filtres mal alignés sur wrap (768px)
- ❌ **Dashboard alert cards** : icon + body + actions mal alignés sur mobile (flex-direction: column)

#### 6.5 Contraste / lisibilité
- ✅ Texte dark (#1A1A1A) sur fond blanc (#FFFFFF) — ratio AAA
- ✅ Texte muted (#6B7280) sur fond blanc — ratio AA
- ⚠️ **Worker UI** : texte #1A1A1A sur fond #EBC137 (jaune) — **contraste limite** (ratio ~3:1, devrait être 4.5:1)
- ❌ **Chart labels** : font-size 10-11px — trop petit sur mobile

#### 6.6 Bordures / ombres / radius
**style.css ligne 60-75**
```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--shadow-sm, --shadow-md, --shadow-lg
```
- ✅ Tokens définis
- ⚠️ **Usage inconsistant :**
  - Cards : généralement `--radius-lg` (12px) ✅
  - Boutons : `--radius-md` (8px) ✅
  - Inputs : `--radius-md` (8px) ✅
  - **Worker UI** : radius 0-2px (style brutalist) — intentionnel
  - ❌ **Pill filters** (TroupeauView) : `--radius-full` (9999px) vs autres boutons 8px — incohérent

- ✅ Ombres :
  - Cards : `--shadow-md` ou custom `0 1px 3px rgba(0,0,0,0.02)` — subtil ✅
  - Worker : `--w-shadow: 4px 4px 0px #1A1A1A` — brutalist intentionnel ✅

#### 6.7 Couleurs / identité
- ✅ Couleur primaire `--primary: #C87533` (ocre/brick) cohérente partout
- ✅ Palette feedback : success vert, error rouge, warning jaune
- ⚠️ **Worker UI** : palette distincte (--w-yellow #EBC137, --w-dark #1A1A1A) — **deux identités visuelles**

---

## PLAN D'IMPLÉMENTATION ORDONNÉ

### PHASE 1 — RESPONSIVE CRITIQUE (Priorité 1)

#### ✅ 1.1 Navigation responsive — DashboardLayout
**Fichier :** `src/layouts/DashboardLayout.vue`  
**Problème :** Menu desktop masqué sur tablette, exploitation masquée sur mobile, period selector inaccessible  
**Action :**
- Remplacer `.topnav-exploitation { display: none; }` @640px par version compacte (initiales seulement)
- Déplacer `.topnav-period` dans le menu mobile (actuellement absent)
- Tester menu mobile sur device réel (actuellement seulement en CSS)
- Ajouter breakpoint intermédiaire 768px pour ajuster gap/padding

**Vérifier :** `npm run dev`, ouvrir localhost:5173/dashboard, tester Chrome DevTools responsive (360px, 768px, 1024px)

---

#### ✅ 1.2 Tables responsive — ProductionTable, FinanceTransactions
**Fichiers :**
- `src/features/production/components/ProductionTable.vue`
- `src/features/finance/components/FinanceTransactions.vue`
- Créer : `src/features/health/components/HealthHistoryTable.vue` (si séparé)

**Problème :** Tables débordent horizontalement sur mobile  
**Action :**
- Wrapper table dans `<div class="table-wrapper">` avec `overflow-x: auto`
- Ajouter `min-width` sur colonnes critiques (nom animal, date)
- Ajouter scroll horizontal hint (shadow gradient gauche/droite)
- Optionnel : version card-list sur < 640px (plus lisible que scroll horizontal)

**Vérifier :** Naviguer vers /dashboard/production, /dashboard/finances, /dashboard/sante, ouvrir DevTools mobile, vérifier scroll horizontal fluide

---

#### ✅ 1.3 Grids responsive — Dashboard KPIs, Troupeau stats
**Fichiers :**
- `src/features/dashboard/views/DashboardView.vue` (ligne 600-650, `.kpi-grid`)
- `src/features/herd/views/TroupeauView.vue` (ligne 500-550, `.stats-section`)

**Problème :** Trop de breakpoints, transitions brutales  
**Action :**
- Dashboard `.kpi-grid` : simplifier 5 cols → 2 cols (1024px) → 1 col (640px) [supprimer breakpoint 1200px]
- Troupeau `.stats-section` : 3 cols → 2 cols (768px) → 1 col (640px) [ajouter breakpoint intermédiaire]
- Réduire gap de 20px à 16px sur mobile

**Vérifier :** Build `npm run build`, vérifier pas de régression layout, tester 640/768/1024/1280px

---

#### ✅ 1.4 Toolbar responsive — Troupeau filtres
**Fichier :** `src/features/herd/views/TroupeauView.vue` (ligne 450-500)

**Problème :** Filtres pill-filters cassent alignement au wrap  
**Action :**
- Passer `.toolbar` de `flex-wrap: wrap` à `flex-direction: column` sur < 768px
- Séparer filtres dropdown et pill-filters en deux lignes sur mobile
- `.pill-filters` : border-left devient border-top sur mobile, padding ajusté
- `.search-box` prend 100% width sur < 640px

**Vérifier :** Tester filtrage fonctionne après changements layout

---

#### ✅ 1.5 Charts responsive — Hauteurs mobiles
**Fichiers :**
- `src/features/dashboard/components/ProductionChart.vue`
- `src/features/production/components/ProductionChart.vue`
- `src/features/finance/components/FinanceCharts.vue`

**Problème :** Hauteurs fixes trop grandes sur mobile, légende pie déborde  
**Action :**
- Remplacer hauteurs fixes par `height: clamp(200px, 40vh, 350px)` — adaptatif
- FinanceCharts pie : `legend: { position: 'bottom' }` sur < 768px (actuellement 'right')
- Réduire `font-size` labels axes de 11px à 10px sur < 640px

**Vérifier :** Charts restent lisibles, pas de débordement, tooltip fonctionne

---

#### ✅ 1.6 Modals responsive — PnModal padding/height
**Fichier :** `src/components/ui/PnModal.vue`

**Problème :** Padding 24px trop sur petit mobile, pas de maxHeight  
**Action :**
- `.modal-wrapper` padding : 24px → 16px sur < 480px
- `.modal-panel` ajouter `max-height: calc(100vh - 32px)` et `overflow-y: auto`
- `.modal-content` ajouter scroll si long

**Vérifier :** Ouvrir modal suppression animal (Troupeau), modal AI Copilot (Dashboard), tester scroll

---

### PHASE 2 — DONNÉES / ÉTAT (Priorité 2)

#### ✅ 2.1 Gestion erreurs API — Affichage utilisateur
**Fichiers :**
- `src/features/dashboard/views/DashboardView.vue`
- `src/features/production/views/ProductionView.vue`
- `src/features/health/views/HealthView.vue`
- `src/features/herd/views/TroupeauView.vue`
- `src/features/worker/views/WorkerHomeView.vue`

**Problème :** Erreurs réseau loggées console mais pas affichées à l'utilisateur  
**Action :**
- Ajouter `ref error` dans chaque vue
- Au catch, `error.value = "Message utilisateur clair"`
- Afficher `<div v-if="error" class="error-banner">{{ error }}</div>` avant contenu
- Style `.error-banner` : fond error-light, texte error, icône PhWarningCircle, bouton "Réessayer"

**Vérifier :** Déconnecter backend (http://localhost:8080), recharger pages, vérifier message erreur + bouton retry fonctionne

---

#### ✅ 2.2 Production service — Retirer mock silencieux
**Fichier :** `src/services/production_service.js` (ligne 12-19)

**Problème :** En cas d'erreur, service retourne mock `{ kpis: { totalProduction: 0 }, chartData: { labels: [] } }` sans notifier  
**Action :**
- Supprimer try/catch mock dans `getProductionSummary()`
- Laisser erreur remonter au composant (géré par 2.1)
- **Alternative :** Garder mock mais ajouter champ `isMock: true` dans retour, afficher warning dans ProductionView

**Vérifier :** Backend down → ProductionView affiche erreur (pas fausses données vides)

---

#### ✅ 2.3 Dashboard — Données par défaut masquent absence
**Fichier :** `src/features/dashboard/views/DashboardView.vue` (ligne 15-25)

**Problème :**
```javascript
const productionLabels = ref(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']);
const productionData = ref([0, 0, 0, 0, 0, 0, 0]);
```
Si API ne retourne rien, chart affiche 7 jours à 0L — **l'utilisateur pense "pas de production" alors que c'est "pas de données"**

**Action :**
- Remplacer par `productionLabels = ref([])` et `productionData = ref([])`
- Si `prodData.chartData.labels.length === 0`, afficher message "Aucune donnée de production" dans ProductionChart
- Créer état `isEmpty` dans ProductionChart : `computed(() => props.dataPoints.length === 0)`

**Vérifier :** Backend retourne `[]` → message affiché, pas chart vide

---

#### ✅ 2.4 Finance — Hardcoded "508k FCFA" dans donut
**Fichier :** `src/features/finance/components/FinanceCharts.vue` (ligne 150)

**Problème :**
```html
<span class="total-value">508k FCFA</span>
```
**Action :**
- Calculer total : `const totalCharges = computed(() => props.repartitionData.data.reduce((sum, val) => sum + val, 0))`
- Formater : `new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', notation: 'compact' }).format(totalCharges.value)`
- Remplacer hardcoded par `{{ formattedTotal }}`

**Vérifier :** Changer données repartitionData dans FinanceView, vérifier total se met à jour

---

### PHASE 3 — CHART.JS FIXES (Priorité 3)

#### ✅ 3.1 États vides charts — Messages placeholder
**Fichiers :**
- `src/features/dashboard/components/ProductionChart.vue`
- `src/features/production/components/ProductionChart.vue`
- `src/features/finance/components/FinanceCharts.vue`

**Problème :** Charts affichent axe vide si données `[]` — pas de message  
**Action :**
- Ajouter `computed isEmpty` dans chaque chart component
- Template :
  ```html
  <div v-if="isEmpty" class="chart-empty-state">
    <PhChartLine :size="48" color="#D1D5DB" />
    <p>Aucune donnée disponible</p>
  </div>
  <Line v-else :data="..." :options="..." />
  ```
- Style `.chart-empty-state` : centré, icône grisée, texte muted

**Vérifier :** Forcer props vides, vérifier message affiché

---

#### ✅ 3.2 Dashboard ProductionChart — Vérifier alignment labels/data
**Fichier :** `src/features/dashboard/components/ProductionChart.vue`

**Problème :** Labels (`props.labels`) et data (`props.dataPoints`) viennent de deux sources API — risque désynchronisation  
**Action :**
- Ajouter validation dans mounted :
  ```javascript
  if (props.labels.length !== props.dataPoints.length) {
    console.warn('Chart labels/data mismatch', props.labels, props.dataPoints);
  }
  ```
- Si mismatch, tronquer au plus court ou afficher warning

**Vérifier :** Modifier manuellement props dans DashboardView, vérifier warning

---

#### ✅ 3.3 Production ProductionChart — Vérifier ordre temporel
**Fichier :** `src/features/production/components/ProductionChart.vue`

**Problème :** `chartData.labels` censé être chronologique (ex: ["Lun 1 Jan", "Mar 2 Jan"...]) — pas de validation  
**Action :**
- Documenter dans JSDoc props que labels doivent être ordre chronologique
- Ajouter prop `timeRange` (ex: "30 jours") pour afficher dans titre chart
- **Pas de fix code** si API retourne bon ordre — juste doc

**Vérifier :** Revoir API `/production/dashboard`, confirmer labels chronologiques

---

### PHASE 4 — SKELETON UI SYSTÈME (Priorité 4)

#### ✅ 4.1 Créer composants skeleton réutilisables
**Fichiers à créer :**
- `src/components/skeleton/SkeletonCard.vue`
- `src/components/skeleton/SkeletonTable.vue`
- `src/components/skeleton/SkeletonChart.vue`
- `src/components/skeleton/SkeletonText.vue`
- `src/components/skeleton/SkeletonCircle.vue`

**Spécifications :**

**SkeletonCard.vue**
```vue
<template>
  <div class="skeleton-card" :style="{ height: height }">
    <div class="skeleton-header">
      <SkeletonCircle :size="48" />
      <div class="skeleton-title-group">
        <SkeletonText width="60%" />
        <SkeletonText width="40%" />
      </div>
    </div>
    <div class="skeleton-body">
      <SkeletonText v-for="i in lines" :key="i" :width="i === lines ? '70%' : '100%'" />
    </div>
  </div>
</template>
<script setup>
defineProps({ height: { type: String, default: 'auto' }, lines: { type: Number, default: 3 } });
</script>
```

**SkeletonTable.vue**
```vue
<template>
  <div class="skeleton-table">
    <div class="skeleton-table-header">
      <SkeletonText v-for="i in cols" :key="i" width="80px" />
    </div>
    <div class="skeleton-table-row" v-for="i in rows" :key="i">
      <SkeletonText v-for="j in cols" :key="j" width="60px" />
    </div>
  </div>
</template>
<script setup>
defineProps({ rows: { type: Number, default: 5 }, cols: { type: Number, default: 4 } });
</script>
```

**SkeletonChart.vue**
```vue
<template>
  <div class="skeleton-chart" :style="{ height: height }">
    <div class="skeleton-chart-bars">
      <div v-for="i in 7" :key="i" class="skeleton-bar" :style="{ height: Math.random() * 60 + 40 + '%' }" />
    </div>
  </div>
</template>
<script setup>
defineProps({ height: { type: String, default: '240px' } });
</script>
```

**SkeletonText.vue**
```vue
<template>
  <div class="skeleton-text" :style="{ width: width, height: height }" />
</template>
<script setup>
defineProps({ width: { type: String, default: '100%' }, height: { type: String, default: '12px' } });
</script>
```

**SkeletonCircle.vue**
```vue
<template>
  <div class="skeleton-circle" :style="{ width: size + 'px', height: size + 'px' }" />
</template>
<script setup>
defineProps({ size: { type: Number, default: 40 } });
</script>
```

**Styles partagés** (ajouter à `src/style.css`) :
```css
/* Skeleton base */
.skeleton-card, .skeleton-text, .skeleton-circle, .skeleton-table, .skeleton-chart {
  background: linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-pulse {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
}

.skeleton-text { margin-bottom: 8px; }
.skeleton-circle { border-radius: 50%; }
```

**Vérifier :** Importer dans une vue test, vérifier animation pulse fluide

---

#### ✅ 4.2 Intégrer skeleton dans Dashboard (priorité haute)
**Fichier :** `src/features/dashboard/views/DashboardView.vue`

**Action :**
- Remplacer `<div v-if="isLoading">...</div>` par structure skeleton mimant layout final :
  ```html
  <template v-if="isLoading">
    <!-- Header skeleton -->
    <div class="dash-header">
      <div>
        <SkeletonText width="200px" height="32px" />
        <SkeletonText width="400px" height="14px" />
      </div>
      <SkeletonCard height="60px" style="width: 200px;" />
    </div>

    <!-- Alerts skeleton -->
    <section class="dash-section">
      <SkeletonText width="150px" />
      <SkeletonCard height="80px" v-for="i in 3" :key="i" />
    </section>

    <!-- Production skeleton -->
    <section class="dash-section">
      <div class="production-grid">
        <SkeletonChart height="240px" />
        <SkeletonCard height="240px" />
      </div>
    </section>

    <!-- KPIs skeleton -->
    <div class="kpi-grid">
      <SkeletonCard height="120px" v-for="i in 5" :key="i" />
    </div>
  </template>
  ```

**Vérifier :** Throttle network dans DevTools (Slow 3G), recharger dashboard, vérifier skeleton conserve layout → minimal shift quand données arrivent

---

#### ✅ 4.3 Intégrer skeleton dans Production, Finance, Santé
**Fichiers :**
- `src/features/production/views/ProductionView.vue`
- `src/features/finance/views/FinanceView.vue`
- `src/features/health/views/HealthView.vue`

**Action :** Même approche que 4.2
- Production : SkeletonCard (KPIs) + SkeletonChart + SkeletonTable
- Finance : SkeletonCard (KPIs) + 2 SkeletonChart + SkeletonTable
- Santé : SkeletonCard (KPIs) + SkeletonTable (alertes) + SkeletonTable (historique)

**Vérifier :** Tester chaque page avec network throttle

---

#### ✅ 4.4 Intégrer skeleton dans Worker
**Fichier :** `src/features/worker/views/WorkerHomeView.vue`

**Action :**
- Style brutalist distinct → créer `WorkerSkeletonCard.vue` avec border 2px, shadow 4px, no radius
- Remplacer `<div v-else>Chargement...</div>` par skeleton action cards + progress + list

**Vérifier :** Worker interface charge proprement

---

### PHASE 5 — HARMONISATION BOUTONS (Priorité 5)

#### ✅ 5.1 Documenter usage PnButton vs CSS global
**Fichiers :**
- `src/components/ui/PnButton.vue`
- `src/style.css` (ligne 180-230)

**Problème :** Duplication classes `.btn` et `<PnButton>`  
**Décision :** **Privilégier `<PnButton>` partout** — supprimer classes CSS globales `.btn-*` après migration

**Action :**
- Ajouter commentaire dans `style.css` :
  ```css
  /* DEPRECATED: Use <PnButton> component instead of .btn classes */
  ```
- Créer doc `src/components/ui/README.md` avec guide usage PnButton

**Pas de code change** — préparation phase suivante

---

#### ✅ 5.2 Migrer boutons inline vers PnButton
**Fichiers :**
- `src/features/dashboard/views/DashboardView.vue` (ligne 350, `.alert-btn`)
- `src/features/herd/views/TroupeauView.vue` (ligne 120, `.btn-primary`)
- `src/features/production/views/ProductionView.vue` (ligne 45, `.btn-export`)
- `src/features/finance/views/FinanceView.vue` (ligne 60-70)

**Action :**

**Avant (DashboardView ligne 350) :**
```html
<button class="alert-btn alert-btn--outline">Détails</button>
```
**Après :**
```html
<PnButton variant="secondary" size="sm">Détails</PnButton>
```

**Avant (ProductionView ligne 45) :**
```html
<button class="btn-export" @click="exportReport">
  <PhDownloadSimple :size="16" weight="bold" />
  Exporter CSV
</button>
```
**Après :**
```html
<PnButton variant="secondary" size="sm" @click="exportReport">
  <PhDownloadSimple :size="16" weight="bold" />
  Exporter CSV
</PnButton>
```

**Action systématique :**
1. Remplacer `<button class="btn-primary">` → `<PnButton variant="primary">`
2. Remplacer `<button class="btn-secondary">` → `<PnButton variant="secondary">`
3. Ajuster size (sm/md/lg) selon contexte
4. Supprimer styles CSS custom (`.alert-btn`, `.btn-export`) après migration

**Vérifier :** Build, tester toutes actions (export, delete, open modal) fonctionnent

---

#### ✅ 5.3 Standardiser tailles icônes boutons
**Problème :** Icônes 14px, 16px, 20px, 24px selon composants  
**Décision :**
- Bouton `size="sm"` → icône 14px
- Bouton `size="md"` → icône 16px
- Bouton `size="lg"` → icône 20px

**Action :**
- Audit toutes utilisations `<Ph*Icon :size="...">` dans boutons
- Corriger incohérences (ex: `size="md"` avec icône 24px → réduire à 16px)

**Fichiers concernés :** Tous *View.vue, chercher `<Ph.*:size="`

**Vérifier :** Visuellement, icônes proportionnées au texte

---

#### ✅ 5.4 Ajouter état loading boutons actions
**Fichiers :**
- `src/features/herd/views/TroupeauView.vue` (delete modal ligne 250)
- `src/features/production/views/ProductionView.vue` (export button)
- `src/features/finance/views/FinanceView.vue` (nouvelle charge button)
- `src/features/health/views/HealthView.vue` (resolve alert button)

**Problème :** Pas de feedback pendant appel API (export, delete, create)  
**Action :**

**Exemple delete animal (TroupeauView) :**
```javascript
const isDeleting = ref(false); // déjà existant ligne 30

async function handleDelete() {
  isDeleting.value = true; // déjà existant
  try {
    await deleteAnimal(...);
  } finally {
    isDeleting.value = false; // déjà existant
  }
}
```
```html
<PnButton variant="primary" @click="handleDelete" :loading="isDeleting">
  Oui, supprimer
</PnButton>
```
✅ TroupeauView déjà implémenté

**À faire :**
- ProductionView : ajouter `isExporting` ref, passer à `:loading="isExporting"`
- FinanceView : ajouter `isCreating` ref pour nouvelle charge
- HealthView : ajouter `isResolving` ref pour resolve alert

**Vérifier :** Cliquer bouton, vérifier spinner + texte "Chargement..." pendant appel

---

### PHASE 6 — POLISH VISUEL (Priorité 6)

#### ✅ 6.1 Unifier titres pages — Créer classes utilitaires
**Fichier :** `src/style.css`

**Problème :** Chaque vue redéfinit `.page-title` avec tailles différentes (28px, 32px, 36px)  
**Action :**
- Ajouter classes utilitaires :
  ```css
  /* Page Title Utilities */
  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 4px;
  }

  .page-subtitle {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  .section-title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 12px;
  }
  ```

- Supprimer définitions custom dans chaque vue
- Remplacer par classes globales

**Fichiers à modifier :**
- `src/features/dashboard/views/DashboardView.vue` (`.dash-greeting` → `.page-title`)
- `src/features/herd/views/TroupeauView.vue` (`.page-title` custom → global)
- `src/features/production/views/ProductionView.vue` (idem)
- `src/features/finance/views/FinanceView.vue` (idem)
- `src/features/health/views/HealthView.vue` (idem)

**Vérifier :** Tous titres 32px, cohérents visuellement

---

#### ✅ 6.2 Unifier gaps sections
**Problème :** Dashboard 28px, Production 32px, Troupeau 24px  
**Décision :** **Gap standard = 24px** (var(--space-6))

**Action :**
- Chercher `.dashboard-content`, `.production-view`, `.finance-view`, etc. → `gap: 24px`
- Vérifier rhythm vertical cohérent

**Vérifier :** Scroll pages, spacing uniforme

---

#### ✅ 6.3 Contraste Worker UI — Corriger jaune/noir
**Fichier :** `src/features/worker/views/WorkerHomeView.vue`

**Problème :** Texte #1A1A1A sur fond #EBC137 — contraste 3:1 (insuffisant)  
**Action :**
- Assombrir texte sur fond jaune : utiliser `color: #000000` (pur noir) → contraste 4.5:1 ✅
- Alternative : assombrir fond `--w-yellow: #D4A42A` → meilleur contraste

**Vérifier :** Tester avec outil contraste (ex: WebAIM), ratio > 4.5:1

---

#### ✅ 6.4 Labels charts mobiles — Augmenter taille
**Fichiers :**
- `src/features/dashboard/components/ProductionChart.vue`
- `src/features/production/components/ProductionChart.vue`
- `src/features/finance/components/FinanceCharts.vue`

**Problème :** Labels 10-11px trop petits sur mobile  
**Action :**
- Garder 11px desktop
- Ajouter breakpoint CSS dans chart options :
  ```javascript
  const isMobile = window.innerWidth < 640;
  const fontSize = isMobile ? 12 : 11;
  // ...
  ticks: { font: { size: fontSize } }
  ```
- Alternative : utiliser Chart.js responsive fontSize plugin

**Vérifier :** Labels lisibles sur iPhone SE (375px)

---

#### ✅ 6.5 Pill filters radius — Cohérence
**Fichier :** `src/features/herd/views/TroupeauView.vue` (ligne 480)

**Problème :** `.filter-pill` utilise `--radius-full` (9999px) vs autres boutons `--radius-md` (8px)  
**Décision :** Garder `--radius-full` — design intention (pills = rounded) ✅  
**Pas d'action** — intentionnel

---

### PHASE 7 — CONSOLIDATION COMPOSANTS (Priorité 7)

#### ✅ 7.1 Extraire composants répétés — KPI Card
**Fichiers avec KPIs similaires :**
- `src/features/dashboard/views/DashboardView.vue` (ligne 250-300, `.kpi-card`)
- `src/features/production/components/ProductionKPIs.vue` (non audité mais similaire)
- `src/features/finance/components/FinanceKPIs.vue` (non audité)
- `src/features/health/components/HealthKPIs.vue` (non audité)

**Action :**
- Créer `src/components/shared/KpiCard.vue` :
  ```vue
  <template>
    <div class="kpi-card card">
      <span class="kpi-label">{{ label }}</span>
      <div class="kpi-value-row">
        <span class="kpi-value">{{ value }}</span>
        <span class="kpi-unit">{{ unit }}</span>
      </div>
      <div class="kpi-footer">
        <span class="kpi-change" :class="changeClass">
          <component :is="changeIcon" :size="12" weight="bold" v-if="changeIcon" />
          {{ change }}
        </span>
        <span class="kpi-note">{{ note }}</span>
      </div>
    </div>
  </template>
  <script setup>
  import { computed } from 'vue';
  import { PhTrendUp, PhTrendDown } from '@phosphor-icons/vue';

  const props = defineProps({
    label: String,
    value: [String, Number],
    unit: String,
    change: String,
    changeDir: { type: String, default: 'stable' }, // 'up' | 'down' | 'stable'
    note: String
  });

  const changeClass = computed(() => ({
    'positive': props.changeDir === 'up',
    'negative': props.changeDir === 'down',
    'neutral': props.changeDir === 'stable'
  }));

  const changeIcon = computed(() => {
    if (props.changeDir === 'up') return PhTrendUp;
    if (props.changeDir === 'down') return PhTrendDown;
    return null;
  });
  </script>
  ```

- Remplacer dans DashboardView :
  ```html
  <div class="kpi-grid">
    <KpiCard v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
  </div>
  ```

**Vérifier :** Dashboard KPIs affichent identiquement, props passées correctement

---

#### ✅ 7.2 Extraire Error Banner réutilisable
**Fichier à créer :** `src/components/shared/ErrorBanner.vue`

**Spécification :**
```vue
<template>
  <div class="error-banner" v-if="modelValue">
    <div class="error-content">
      <PhWarningCircle :size="20" weight="fill" color="var(--error)" />
      <span class="error-message">{{ message }}</span>
    </div>
    <div class="error-actions">
      <PnButton variant="secondary" size="sm" @click="$emit('retry')" v-if="retryable">
        Réessayer
      </PnButton>
      <button class="error-close" @click="$emit('update:modelValue', false)" aria-label="Fermer">
        <PhX :size="16" weight="bold" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { PhWarningCircle, PhX } from '@phosphor-icons/vue';
import PnButton from '../ui/PnButton.vue';

defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, required: true },
  retryable: { type: Boolean, default: true }
});

defineEmits(['update:modelValue', 'retry']);
</script>

<style scoped>
.error-banner {
  background: var(--error-light);
  border: 1px solid var(--border-error);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.error-message {
  font-size: var(--font-size-sm);
  color: var(--text-dark);
  font-weight: 500;
}

.error-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.error-close:hover {
  background: rgba(0,0,0,0.05);
  color: var(--text-dark);
}
</style>
```

**Utilisation :**
```html
<ErrorBanner 
  v-model="showError"
  :message="errorMessage"
  @retry="loadData"
/>
```

**Vérifier :** Importer dans DashboardView, tester affichage + retry + fermer

---

#### ✅ 7.3 Supprimer duplication CSS `.btn-*` (après 5.2)
**Fichier :** `src/style.css` (ligne 180-230)

**Action :**
- Supprimer :
  ```css
  .btn { ... }
  .btn-primary { ... }
  .btn-secondary { ... }
  .btn-ghost { ... }
  .btn-full { ... }
  .btn-lg { ... }
  ```
- Vérifier aucun usage résiduel : `grep -r "class=\"btn-" src/` → doit retourner 0

**Vérifier :** Build ne casse pas, toutes pages fonctionnent

---

## TESTS / VALIDATION

### Build & lint
```bash
npm run build
# Vérifier output dist/ sans erreurs
```

### Tests unitaires (si existants)
```bash
npm run test
# Tous tests passent
```

### Tests manuels critiques

#### Parcours Dashboard
1. Naviguer `/dashboard`
2. Vérifier skeleton apparaît < 1s
3. Vérifier données chargent (alertes, production, KPIs, troupeau)
4. Cliquer "Détails" sur alerte → AI Copilot panel s'ouvre
5. Redimensionner fenêtre 360px → 1920px → vérifier responsive

#### Parcours Troupeau
1. Naviguer `/dashboard/troupeau`
2. Vérifier grille animaux
3. Filtrer par race, statut, pill-filters
4. Cliquer "Ajouter un animal" → drawer s'ouvre
5. Remplir formulaire, soumettre → animal apparaît
6. Cliquer "Supprimer" → modal, confirmer → animal disparaît
7. Tester sur mobile (360px)

#### Parcours Production
1. Naviguer `/dashboard/production`
2. Vérifier chart évolution + tableau animaux
3. Cliquer "Exporter CSV" → fichier téléchargé, vérifier contenu
4. Tester responsive chart mobile

#### Parcours Finance
1. Naviguer `/dashboard/finances`
2. Si erreur 422 → modal prix lait apparaît
3. Configurer prix → dashboard charge
4. Vérifier charts bar/pie, total donut correct
5. Cliquer "Nouvelle charge" → modal, créer charge
6. Tester responsive

#### Parcours Santé
1. Naviguer `/dashboard/sante`
2. Vérifier alertes actives
3. Cliquer "Résoudre" alerte → modal résolution
4. Soumettre résolution → alerte passe en historique
5. Vérifier calendrier vaccinations

#### Parcours Worker
1. Déconnecter, naviguer `/worker/login`
2. Se connecter comme employé
3. Vérifier layout brutalist (jaune, border 2px)
4. Cliquer "Traite individuelle" → modal
5. Enregistrer traite → progress bar se met à jour
6. Naviguer bottom nav (Accueil, Animaux, Historique)
7. Tester contraste texte/jaune acceptable

#### Tests responsive breakpoints
- **360px (mobile)** : Navigation mobile, tables scroll horizontal, charts lisibles
- **640px (large mobile)** : KPIs 1 col, grids adaptées
- **768px (tablette)** : Menu desktop apparaît, filtres sur 2 lignes
- **1024px (desktop)** : Layout complet, grids multi-cols
- **1440px (large desktop)** : Max-width 1360px respectée

#### Tests erreurs réseau
1. Arrêter backend (`http://localhost:8080`)
2. Recharger Dashboard → ErrorBanner apparaît
3. Cliquer "Réessayer" → toujours erreur (backend down)
4. Relancer backend
5. Cliquer "Réessayer" → données chargent

#### Tests données vides
1. Créer exploitation neuve (aucun animal, aucune traite)
2. Naviguer Dashboard → charts affichent "Aucune donnée disponible"
3. Naviguer Troupeau → grille vide, message "Aucun animal"
4. Naviguer Production → message "Aucune donnée"

---

## RISQUES RÉSIDUELS

### Risques techniques
1. **Reproduction, Nutrition views non auditées** — peuvent contenir issues similaires (responsive, loading)
2. **Worker views secondaires** (WorkerAnimalsView, WorkerHistoryView, SaisieTraiteLotView) — non testées en détail
3. **AnimalDetailView** — page détail animal non auditée (peut avoir charts, tables)
4. **Onboarding flow** — 6 steps non testés responsive
5. **AI Copilot Panel** — fonctionnel selon spec mais pas audité en profondeur

### Risques fonctionnels
1. **Pas de state management global** — rechargement complet données à chaque navigation (performance)
2. **Pas de cache API** — appels réseau multiples si navigation rapide
3. **Pas de retry automatique** — utilisateur doit cliquer "Réessayer" manuellement
4. **Pas de mode offline** — application inutilisable sans connexion
5. **Pas de gestion permissions** — routes protégées mais actions CRUD non validées côté UI

### Risques UX
1. **Feedback asynchrone limité** — certaines actions (export CSV) bloquent UI sans feedback
2. **Notifications temporaires absentes** — aucun toast/snackbar après actions (créer animal, résoudre alerte)
3. **Historique navigation** — pas de breadcrumb, retour arrière peut être confus
4. **Recherche globale absente** — utilisateur doit naviguer modules pour trouver info

### Risques accessibilité
1. **Focus management** — modals, drawers ne trapent pas focus (keyboard nav difficile)
2. **ARIA labels incomplets** — certains boutons icon-only sans aria-label
3. **Contraste Worker UI** — même après fix, limite AA (pas AAA)
4. **Lecteurs d'écran** — charts non testés avec NVDA/JAWS
5. **Zoom texte** — layout non testé à 200% zoom

---

## DÉFINITION OF DONE

### ✅ Responsive
- [ ] Navigation DashboardLayout fonctionne 360px → 1920px
- [ ] Tables scrollent horizontalement sur mobile sans casser layout
- [ ] Charts redimensionnent, légendes adaptent position
- [ ] Modals restent accessibles sur petits écrans
- [ ] Worker layout reste utilisable sur desktop (ou affiche warning "Utiliser sur mobile")

### ✅ Données
- [ ] Erreurs API affichées avec ErrorBanner + bouton Réessayer
- [ ] Aucune donnée mock silencieuse (Production service corrigé)
- [ ] Charts affichent "Aucune donnée" si array vide
- [ ] Finance donut total calculé dynamiquement

### ✅ Chart.js
- [ ] Tous charts ont état vide avec message + icône
- [ ] Labels/data alignés (validation ou doc)
- [ ] Responsive : hauteurs adaptatives, labels lisibles mobile

### ✅ Loading
- [ ] Dashboard affiche skeleton pendant chargement (< 1s visible)
- [ ] Production, Finance, Santé affichent skeleton
- [ ] Worker affiche skeleton cards
- [ ] Minimal layout shift (skeleton ≈ géométrie finale)

### ✅ Boutons
- [ ] 90%+ boutons utilisent `<PnButton>` (ou WorkerButton pour UI brutalist)
- [ ] Tailles icônes cohérentes (sm:14px, md:16px, lg:20px)
- [ ] Actions async (delete, export, create) ont état loading
- [ ] États hover/focus accessibles clavier

### ✅ Visuel
- [ ] Titres pages utilisent `.page-title` global (32px)
- [ ] Gaps sections uniformes (24px)
- [ ] Contraste Worker UI > 4.5:1
- [ ] Labels charts lisibles (12px mobile)
- [ ] Cohérence border-radius, shadows (tokens design system)

### ✅ Tests
- [ ] Build production sans erreurs (`npm run build`)
- [ ] Tests unitaires passent (`npm run test`)
- [ ] Parcours critiques testés (Dashboard, Troupeau, Production, Finance, Santé, Worker)
- [ ] Responsive testé aux 5 breakpoints (360/640/768/1024/1440)
- [ ] Erreurs réseau testées (backend down → ErrorBanner → retry)
- [ ] Données vides testées (exploitation neuve → messages corrects)

### ✅ Copilot IA
- [ ] AI Copilot Panel reste fonctionnel (pas de régression)
- [ ] Bouton "Copilot IA" dans alertes Dashboard fonctionne
- [ ] Panel s'ouvre/ferme sans erreur

---

## COMPOSANTS MUTUALISÉS (après implémentation)

### Créés
- `src/components/skeleton/SkeletonCard.vue`
- `src/components/skeleton/SkeletonTable.vue`
- `src/components/skeleton/SkeletonChart.vue`
- `src/components/skeleton/SkeletonText.vue`
- `src/components/skeleton/SkeletonCircle.vue`
- `src/components/shared/KpiCard.vue`
- `src/components/shared/ErrorBanner.vue`

### Existants (à privilégier)
- `src/components/ui/PnButton.vue`
- `src/components/ui/PnInput.vue`
- `src/components/ui/PnModal.vue`
- `src/components/ui/PnCheckbox.vue`
- `src/components/ui/PnDrawer.vue`

### Tokens design (style.css)
- Couleurs : `--primary`, `--text-*`, `--bg-*`, `--border-*`, `--error`, `--success`, `--warning`
- Spacing : `--space-1` à `--space-16`
- Radius : `--radius-sm/md/lg/xl/full`
- Shadows : `--shadow-sm/md/lg`
- Typography : `--font-size-xs` à `--font-size-4xl`
- Transitions : `--transition-fast/base/slow`

---

## COMMANDES

**Développement :**
```bash
npm run dev
# Ouvre http://localhost:5173
```

**Build production :**
```bash
npm run build
# Output: dist/
```

**Preview build :**
```bash
npm run preview
```

**Tests :**
```bash
npm run test
```

**Vérifier usage classe dépréciée :**
```bash
grep -r "class=\"btn-" src/ --include="*.vue"
```

---

## PRIORITÉS SI TEMPS LIMITÉ

**Phase 1 (Critique) :** 1.1, 1.2, 1.3, 4.1, 4.2  
**Phase 2 (Haute) :** 2.1, 3.1, 5.2  
**Phase 3 (Moyenne) :** 2.3, 5.4, 6.1  
**Phase 4 (Basse) :** 6.3, 7.1, 7.2  

---

**Plan rédigé le :** 2026-01-10  
**Prochaine étape :** Implémentation par phases, revue après chaque phase, tests manuels continus.
