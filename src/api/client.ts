import type { App } from 'vue';
import axiosInstance from './axios';

export default {
  install(app: App) {
    app.config.globalProperties.$axios = axiosInstance;
  },
};
