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
        <h2>Create Task</h2>
        <h3>Hello, {{ username }}</h3> <!-- แสดงชื่อผู้ใช้ -->
      </div>

      <!-- Task Form -->
      <div class="create-task-box">
        <form @submit.prevent="submitForm">
          <div>
            <label for="title">Title:</label>
            <input v-model="task.title" type="text" id="title" placeholder="Enter task title" required />
          </div>
          <div>
            <label for="description">Description:</label>
            <textarea v-model="task.description" id="description" placeholder="Enter task description" required></textarea>
          </div>
          <div>
            <label for="due_date">Due Date:</label>
            <input v-model="task.due_date" type="date" id="due_date" required />
          </div>
          <div>
            <label for="priority">Priority:</label>
            <select v-model="task.priority_id" id="priority" required>
              <option v-for="priority in priorities" :key="priority.priority_id" :value="priority.priority_id">
                {{ priority.priority }}
              </option>
            </select>
          </div>
          <div>
            <label for="category">Category:</label>
            <select v-model="task.category_id" id="category" required>
              <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                {{ category.category_name }}
              </option>
            </select>
          </div>
          <div>
            <label for="status">Status:</label>
            <select v-model="task.status_id" id="status" required>
              <option v-for="status in statuses" :key="status.status_id" :value="status.status_id">
                {{ status.status }}
              </option>
            </select>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",  
      task: {
        title: '',
        description: '',
        due_date: '',
        priority_id: null,
        category_id: null,
        status_id: null
      },
      categories: [],
      statuses: [],
      priorities: []
    };
  },
  methods: {
    async fetchUserInfo() {
      const token = localStorage.getItem('authToken');
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
        this.username = data.username;
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },

    async submitForm() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No token found");
        return;
      }
      const formattedDate = new Date(this.task.due_date).toISOString();
      this.task.due_date = formattedDate;
      const taskData = {
        title: this.task.title,
        description: this.task.description,
        user_id: this.$route.params.userId, // can be fetched from token or route params
        category_id: this.task.category_id,
        status_id: this.task.status_id,
        priority_id: this.task.priority_id,
        due_date: this.task.due_date
      };
      try {
        const response = await fetch('http://localhost:8800/api/tasks', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData)
        });
        const data = await response.json();
        if (response.ok) {
          alert("Task created successfully!");
          this.$router.push("/home");
        } else {
          alert(data.error || "Failed to create task");
        }
      } catch (error) {
        console.error("Error creating task:", error);
        alert("Failed to create task");
      }
    },

    async fetchCategories() {
      try {
        const response = await fetch("http://localhost:8800/api/categories");
        const data = await response.json();
        this.categories = data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    
    async fetchStatuses() {
      try {
        const response = await fetch("http://localhost:8800/api/status");
        const data = await response.json();
        this.statuses = data;
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    },

    async fetchPriorities() {
      try {
        const response = await fetch("http://localhost:8800/api/priority");
        const data = await response.json();
        this.priorities = data;
      } catch (error) {
        console.error("Error fetching priorities:", error);
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
    this.fetchCategories();
    this.fetchStatuses();
    this.fetchPriorities();
    this.fetchUserInfo();  // ดึงข้อมูล username
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
  margin-left: 25px;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.create-task-box {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input, textarea, select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
}

button {
  background: #ff7f50;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #e7663a;
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
