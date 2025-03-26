<template>
  <div class="home-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">My Task List</div>
      <ul class="menu">
        <li @click="goToHome">Dashboard</li>
        <li @click="goToCreateTask">Tasks</li>
        <li @click="goToNotifications">Notifications</li>
        <li @click="goToProfile">Profile</li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper">
      <div class="header">
        <h2>{{ currentDate }}</h2>
        <h3>Hello, {{ username }}</h3> <!-- เพิ่มการแสดงชื่อผู้ใช้ -->
      </div>

      <!-- Task Section -->
      <div class="task-section">
        <div class="task-header">
          <h3>Task List</h3>
          <button @click="goToCreateTask" class="add-task-btn">+ Add Task</button>
        </div>
        <div class="task-grid">
          <div v-for="task in paginatedTasks" :key="task.task_id" class="task-card" @click="goToTaskDetail(task.task_id)">
            <h4>{{ task.title }}</h4>
            <img src="https://cdn-icons-png.flaticon.com/128/7626/7626168.png" alt="Task Icon">
            <div class="task-status" :class="task.status">{{ task.status }}</div>
          </div>
        </div>
        <!-- Pagination -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",  // เพิ่ม data เพื่อเก็บ username
      tasks: [],    
      tasksPerPage: 6,
      currentPage: 1,
      currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    };
  },
  computed: {
    paginatedTasks() {
      const start = (this.currentPage - 1) * this.tasksPerPage;
      return this.tasks.slice(start, start + this.tasksPerPage);
    },
    totalPages() {
      return Math.ceil(this.tasks.length / this.tasksPerPage);
    },
  },
  methods: {
    async fetchUserInfo() {
      const token = localStorage.getItem('authToken'); // ดึง token จาก localStorage
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await fetch('http://localhost:8800/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        this.username = data.username;  // ดึงข้อมูลชื่อผู้ใช้
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    async fetchTasks() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await fetch('http://localhost:8800/api/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        this.tasks = data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToCreateTask() {
      this.$router.push('/tasks/create');
    },
    goToTaskDetail(taskId) {
      this.$router.push(`/tasks/${taskId}`);
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    goToHome() {
      this.$router.push('/home');
    },
    goToNotifications() {
      this.$router.push('/notifications');
    },
  },
  mounted() {
    this.fetchTasks();
    this.fetchUserInfo(); // เรียกฟังก์ชันเพื่อดึงข้อมูลผู้ใช้
  }
};
</script>

<style scoped>
/* Layout Styles */
.home-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar .logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu li:hover {
  background-color: #34495e;
}

.content-wrapper {
  flex-grow: 1;
  padding: 20px;
  background-color: #ecf0f1;
  margin-left: 20px; /* To ensure the content doesn't get overlapped by the sidebar */
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.task-section {
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-task-btn {
  background-color: #ff7f50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.add-task-btn:hover {
  background-color: #e7663a;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.task-card {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);  /* สีพื้นหลังที่เป็นการไล่สีชมพู-ส้ม */
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease;
}

.task-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);  /* เพิ่มเงาเมื่อ hover */
}

.task-card img {
  width: 50px;
  margin-top: 10px;
}

.task-status {
  font-size: 12px;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 5px;
}

.task-status.Active {
  background-color: #2ecc71;
  color: white;
}

.task-status.Inactive {
  background-color: #e74c3c;
  color: white;
}

.task-status.OnSale {
  background-color: #f39c12;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 15px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
