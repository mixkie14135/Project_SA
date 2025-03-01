import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import TaskDetail from '../views/TaskDetail.vue'; // เพิ่มการ import
import EditTask from '../views/EditTask.vue'; // เพิ่มการ import
import CreateTask from '../views/CreateTask.vue'; // เพิ่มการ import

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home },
  { path: '/tasks/:id', component: TaskDetail }, // หน้า Task Detail
  { path: '/tasks/edit/:id', component: EditTask }, // เพิ่มหน้า Edit Task
  { path: '/tasks/create', component: CreateTask }, // เพิ่ม route สำหรับหน้า CreateTask
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
