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
        path: 'register',
        name: 'onboarding-register',
        component: () => import('../features/identity/views/RegisterView.vue'),
        meta: { step: 2 },
      },
      {
        path: 'verify-otp',
        name: 'onboarding-verify-otp',
        component: () => import('../features/identity/views/VerifyOtpView.vue'),
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
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../features/dashboard/views/DashboardView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
