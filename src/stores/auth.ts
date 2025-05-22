import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    login(token: string) {
      this.token = token;
      localStorage.setItem('access_token', token);
    },
    logout() {
      this.token = '';
      localStorage.removeItem('access_token');
    },
  },
});
