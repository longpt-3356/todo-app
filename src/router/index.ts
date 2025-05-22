import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import GoogleLogin from '@/components/login/GoogleLogin.vue';
import TodoList from '@/components/todoList/TodoApp.vue';
import NotFound from '@/components/NotFound.vue';
import { nextTick } from 'vue';

const routes = [
  { path: '/', redirect: '/todo' },
  { path: '/login', name: 'Login', component: GoogleLogin },
  { path: '/todo', component: TodoList, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  await nextTick();
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
