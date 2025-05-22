<!-- components/GoogleLogin.vue -->
<template>
  <div v-if="!user" id="g_id_signin"></div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const authStore = useAuthStore();
const user = userStore.user;
const router = useRouter();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const decodeJwt = (credential: string) => {
  try {
    const payload = JSON.parse(atob(credential.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const initializeGoogleSignIn = async () => {
  await nextTick();
  if (!window.google?.accounts?.id) return;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error('Missing GOOGLE_CLIENT_ID');
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: any) => {
      const payload = decodeJwt(response.credential);
      if (payload) {
        userStore.setUser({
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });

        authStore.login(response.credential);

        router.push('/todo');
      }
    },
    auto_select: false,
  });

  const buttonElement = document.getElementById('g_id_signin');
  if (buttonElement) {
    window.google.accounts.id.renderButton(buttonElement, {
      theme: 'outline',
      size: 'large',
    });
  }

  window.google.accounts.id.prompt();
};

onMounted(() => {
  if (window.google?.accounts?.id) {
    initializeGoogleSignIn();
  } else {
    const checkLoaded = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkLoaded);
        initializeGoogleSignIn();
      }
    }, 100);
    setTimeout(() => clearInterval(checkLoaded), 10000);
  }
});
</script>
