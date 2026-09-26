import { createRouter, createWebHistory } from 'vue-router';

const OnboardingLayout = () => import('../layouts/OnboardingLayout.vue');
const DashboardLayout = () => import('../layouts/DashboardLayout.vue');

const routes = [
  {
    path: '/',
    redirect: '/onboarding/welcome',
  },
  {
    path: '/onboarding',
    component: OnboardingLayout,
    children: [
      {
        path: '',
        redirect: '/onboarding/welcome',
      },
      {
        path: 'welcome',
        name: 'onboarding-welcome',
        component: () => import('../features/identity/views/WelcomeView.vue'),
        meta: { step: 1 },
      },
      {
        path: 'verify-otp',
        name: 'onboarding-verify-otp',
        component: () => import('../features/identity/views/VerifyOtpView.vue'),
        meta: { step: 2 },
      },
      {
        path: 'register',
        name: 'onboarding-register',
        component: () => import('../features/identity/views/RegisterView.vue'),
        meta: { step: 3 },
      },
      {
        path: 'create-exploitation',
        name: 'onboarding-create-exploitation',
        component: () => import('../features/identity/views/CreateExploitationView.vue'),
        meta: { step: 4 },
      },
      {
        path: 'first-animal',
        name: 'onboarding-first-animal',
        component: () => import('../features/animal/views/FirstAnimalView.vue'),
        meta: { step: 5 },
      },
      {
        path: 'success',
        name: 'onboarding-success',
        component: () => import('../features/identity/views/SuccessView.vue'),
        meta: { step: 6 },
      },
    ],
  },
  {
    path: '/select-exploitation',
    name: 'select-exploitation',
    component: () => import('../features/identity/views/SelectExploitationView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true, requiresExploitation: true, allowedRoles: ['PROPRIETAIRE'] },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../features/dashboard/views/DashboardView.vue'),
      },
      {
        path: 'troupeau',
        name: 'dashboard-troupeau',
        component: () => import('../features/herd/views/TroupeauView.vue'),
      },
      {
        path: 'troupeau/:id',
        name: 'dashboard-animal-detail',
        component: () => import('../features/herd/views/AnimalDetailView.vue'),
      },
      {
        path: 'production',
        name: 'dashboard-production',
        component: () => import('../features/production/views/ProductionView.vue'),
      },
      {
        path: 'sante',
        name: 'dashboard-sante',
        component: () => import('../features/health/views/HealthView.vue'),
      },
      {
        path: 'nutrition',
        name: 'dashboard-nutrition',
        component: () => import('../features/nutrition/views/NutritionView.vue'),
      },
      {
        path: 'finances',
        name: 'dashboard-finances',
        component: () => import('../features/finance/views/FinanceView.vue'),
      },
      {
        path: 'equipe',
        name: 'dashboard-equipe',
        component: () => import('../features/identity/views/TeamView.vue'),
      },
    ],
  },
  {
    path: '/worker/login',
    name: 'worker-login',
    component: () => import('../features/identity/views/WorkerLoginView.vue'),
  },
  {
    path: '/worker',
    component: () => import('../layouts/WorkerLayout.vue'),
    meta: { requiresAuth: true, requiresExploitation: true, allowedRoles: ['EMPLOYE', 'GERANT'] },
    children: [
      {
        path: 'home',
        name: 'worker-home',
        component: () => import('../features/worker/views/WorkerHomeView.vue'),
      },
      {
        path: 'animals',
        name: 'worker-animals',
        component: () => import('../features/worker/views/WorkerAnimalsView.vue'),
      },
      {
        path: 'saisie-lot',
        name: 'worker-saisie-lot',
        component: () => import('../features/worker/views/SaisieTraiteLotView.vue'),
      },
      {
        path: 'animal-detail/:id',
        name: 'worker-animal-detail',
        component: () => import('../features/worker/views/WorkerAnimalDetailView.vue'),
      },
      {
        path: 'history',
        name: 'worker-history',
        component: () => import('../features/worker/views/WorkerHistoryView.vue'),
      },
      {
        path: 'alerts',
        name: 'worker-alerts',
        component: () => import('../features/worker/views/WorkerHomeView.vue'), // To implement later
      },
      {
        path: 'profile',
        name: 'worker-profile',
        component: () => import('../features/worker/views/WorkerHomeView.vue'), // To implement later
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token');
  const exploitationId = localStorage.getItem('active_exploitation_id');
  const role = localStorage.getItem('active_role');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      return next({ name: 'onboarding-welcome' });
    }

    if (to.matched.some(record => record.meta.requiresExploitation)) {
      if (!exploitationId) {
        return next({ name: 'select-exploitation' });
      }

      // Role Check
      const targetRecord = to.matched.find(record => record.meta.allowedRoles);
      if (targetRecord && targetRecord.meta.allowedRoles) {
        if (!targetRecord.meta.allowedRoles.includes(role)) {
          // Si le rôle ne correspond pas, rediriger vers la bonne interface ou select
          if (role === 'EMPLOYE' || role === 'GERANT') {
            return next({ name: 'worker-home' });
          } else if (role === 'PROPRIETAIRE') {
            return next({ name: 'dashboard' });
          } else {
            return next({ name: 'select-exploitation' });
          }
        }
      }
    }
  } else if (to.path.startsWith('/onboarding') && token) {
    if (exploitationId) {
      if (to.name === 'onboarding-welcome' || to.name === 'onboarding-register' || to.name === 'onboarding-verify-otp') {
        if (role === 'EMPLOYE' || role === 'GERANT') return next({ name: 'worker-home' });
        return next({ name: 'dashboard' });
      }
    } else {
      if (to.name === 'onboarding-welcome') {
        return next({ name: 'select-exploitation' });
      }
    }
  }

  next();
});

export default router;
