import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import TaskDetail from '../views/TaskDetail.vue';
import EditTask from '../views/EditTask.vue';
import CreateTask from '../views/CreateTask.vue';
import Profile from '../views/Profile.vue'; // เพิ่มหน้า Profile

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home },
  { path: '/tasks/:id', component: TaskDetail },
  { path: '/tasks/edit/:id', component: EditTask },
  { path: '/tasks/create', component: CreateTask },
  { path: '/profile', component: Profile } // เพิ่มหน้าโปรไฟล์
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ตรวจสอบการเข้าสู่ระบบก่อนการเข้าแต่ละหน้า
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');

  // ถ้าไม่มี token และพยายามเข้าหน้า Home, ให้ไปที่ Login
  if (!token && to.path === '/home') {
    next('/'); // ไปที่หน้า login
  } 
  // ถ้ามี token และพยายามเข้าหน้า Login ให้ไปที่หน้า Home
  else if (token && to.path === '/') {
    next('/home'); // ไปที่หน้า home
  } 
  // ถ้ามีการเข้าไปที่หน้าอื่นๆ ที่ไม่ใช่ login หรือ home หรือหน้าโปรไฟล์ ก็ปล่อยให้ไป
  else {
    next();
  }
});

export default router;
