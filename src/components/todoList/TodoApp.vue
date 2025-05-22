<template>
  <div>
    <h2>📝 Todo App</h2>
    <h1>Todo App</h1>

    <div v-if="user">
      <p>{{ user.name }}</p>
      <img :src="user.picture" width="50" />
      <p>{{ user.email }}</p>
      <button @click="logout">Logout</button>
      <form @submit.prevent="addTodo" action="">
      <input type="text" v-model="newTodo" required placeholder="new todo" />
      <button>Add Todo</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.text }}
        <button @click="deleteTodo(todo)">X</button>
      </li>
    </ul>
    </div>

    <div v-else>
      <p>Vui lòng đăng nhập trước</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import {useAuthStore} from '@/stores/auth'
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter()
const user = userStore.user;
const logout = () => {
  authStore.logout()
  userStore.logout()
  router.push('/login')
};

let id = 0;
type Todo = {
  id: number;
  text: string;
};
type Todos = Ref<Todo[]>;

const newTodo = ref('');

const todos: Todos = ref([
  { id: id++, text: 'Learn HTML' },
  { id: id++, text: 'Learn JavaScript' },
  { id: id++, text: 'Learn Vue' },
]);

const addTodo = () => {
  todos.value.push({
    id: id++,
    text: newTodo.value,
  });
  newTodo.value = '';
};

const deleteTodo = (todo: Todo) => {
  todos.value = todos.value.filter((t) => t !== todo);
};
</script>
<style></style>
