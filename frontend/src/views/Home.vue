<template>
  <div class="home-container">
    <!-- ✅ Navbar -->
    <nav class="navbar">
      <div class="logo">My Task List</div>
      <div class="nav-links">
        <button @click="goToDashboard">Dashboard</button>
        <button class="create-btn" @click="goToCreateTask">Create</button>
        <input type="text" placeholder="Search" class="search-bar">
        <button class="icon-btn">🏠</button>
        <button class="icon-btn">🔔</button>
        <button class="icon-btn">👤</button>
      </div>
    </nav>

    <!-- ✅ Content Wrapper -->
    <div class="content-wrapper">
      <!-- ✅ Header -->
      <div class="header">
        <h2>{{ currentDate }}</h2>
        <h3>Hello, {{ username }}</h3> <!-- แสดงชื่อผู้ใช้จาก API -->
      </div>

      <!-- ✅ Task List -->
      <div class="task-section">
        <h3>Task List</h3>
        <div class="task-grid">
          <div v-for="task in paginatedTasks" :key="task.task_id" class="task-card" @click="goToTaskDetail(task.task_id)">
            <h4>{{ task.title }}</h4>
            <img src="https://cdn-icons-png.flaticon.com/128/7626/7626168.png" alt="Task Icon">
          </div>
          <!-- ✅ เติม Block เปล่าให้ Grid สมดุล -->
          <div v-for="n in emptySlots" :key="'empty-' + n" class="task-card empty-card"></div>
        </div>

        <!-- ✅ Pagination -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
        </div>
      </div>
    </div>

    <!-- ✅ Footer -->
    <footer class="footer">© 2025 My Task List | วางแผนทุกวัน จัดการทุกเป้าหมาย</footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",  // เก็บชื่อผู้ใช้ที่ดึงจาก API
      tasks: [],      // เก็บข้อมูล task ที่ดึงมา
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
    emptySlots() {
      return this.tasksPerPage - this.paginatedTasks.length;
    }
  },
  methods: {
    // ✅ Fetch tasks for the logged-in user
    async fetchTasks() {
  const token = localStorage.getItem("authToken"); // ดึง token จาก localStorage
  if (!token) {
    console.error("No token found");
    return;
  }

  try {
    const response = await fetch('http://localhost:8800/api/tasks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // ส่ง token ไปใน header
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


    // ✅ Fetch user info (username)
    async fetchUserName() {
      const token = localStorage.getItem('authToken');  // ดึง token จาก localStorage

      if (!token) {
        return;
      }

      try {
        const response = await fetch('http://localhost:8800/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // ส่ง JWT token ไปใน header
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        this.username = data.username;  // แสดงชื่อผู้ใช้จาก API
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    },

    goToTaskDetail(taskId) {
      this.$router.push(`/tasks/${taskId}`);  // ไปที่หน้ารายละเอียดงาน
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
    }
  },
  mounted() {
    this.fetchTasks();  // เรียกฟังก์ชันนี้เพื่อดึงข้อมูลงาน
    this.fetchUserName();  // เรียกฟังก์ชันนี้เพื่อดึงข้อมูลผู้ใช้จาก API
  }
};

</script>

<style scoped>
/* ✅ ตั้งค่า Layout หลัก */

.home-container {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #f9f6c3;
  width: 100%;
  position: relative;
  padding-top: 80px;
  padding-bottom: 120px; /* ✅ ป้องกันไม่ให้ Footer ทับ Pagination */
}

/* ✅ จัดเนื้อหาให้อยู่กึ่งกลาง */
.content-wrapper {
  width: 80%;
  max-width: 900px; /* ✅ ลดขนาดให้พอดี */
  margin: 0 auto;
  text-align: center;
  padding-top: 80px; /* ✅ ป้องกัน Header ถูก Navbar บัง */
}

.header {
  margin-top: 80px; /* เพิ่ม margin-top เพื่อให้ header เลื่อนลง */
}

/* ✅ Navbar */
.navbar {
  width: 100%;
  background: #f9e267;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  z-index: 1000;
}

/* ✅ ปุ่ม Create */
.create-btn {
  background: red;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.create-btn:hover {
  background: darkred;
}

/* ✅ Task List */
.task-section {
  width: 100%;
  max-width: 800px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  position: relative;  /* ทำให้ pagination อยู่ในกรอบนี้ */
}

/* ✅ Task Grid */
.task-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  gap: 20px;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 400px; /* ✅ ลดความสูงของ Task Section */
}

/* ✅ ปรับขนาด Task Card */
.task-card {
  background: #f9e267;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.2s ease-in-out;
}

.task-card:hover {
  transform: scale(1.05);
}

.task-card img {
  width: 50px;
  margin-top: 10px;
}

/* ✅ กรอบเปล่าในหน้าที่มีงานไม่ครบ */
.empty-card {
  background: transparent;
  border: none;
  visibility: hidden;
}

/* ✅ Pagination */
.pagination {
  position: absolute;
  top: 20px;  /* ปรับให้ปุ่มอยู่ด้านบน */
  right: 20px;   /* ปรับให้ปุ่มอยู่ด้านขวา */
  display: flex;
  gap: 10px;
  align-items: center;
}

/* ✅ Footer */
.footer {
  width: 100%;
  background: #f9e267;
  padding: 15px 0;
  text-align: center;
  font-size: 0.9rem;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* ✅ ปรับ Navbar */
.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* ตั้งค่า font-family สำหรับทั้งเว็บไซต์ */
body {
  font-family: 'Kanit', sans-serif;
}

/* ✅ Responsive Design */
@media (max-width: 1024px) {
  .task-grid {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media (max-width: 600px) {
  .task-grid {
    grid-template-columns: repeat(1, minmax(200px, 1fr));
  }
}
</style>
