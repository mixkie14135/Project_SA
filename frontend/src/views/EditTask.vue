<template>
  <div class="edit-task-container">
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
        <h2>Edit Task</h2>
        <h3>Hello, {{ username }}</h3> <!-- แสดงชื่อผู้ใช้ -->
      </div>

      <!-- Task Form -->
      <div v-if="task" class="edit-task-box">
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
          <button type="submit">Update Task</button>
        </form>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="isDeleteModalVisible" class="delete-modal">
        <div class="modal-content">
          <h4>Are you sure you want to delete this task?</h4>
          <div class="modal-actions">
            <button @click="deleteTask" class="delete-confirm-btn">Yes, Delete</button>
            <button @click="cancelDelete" class="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      task: null, 
      categories: [], 
      statuses: [], 
      priorities: [], 
      username: "", // Add username for greeting
    };
  },
  methods: {
    async fetchTaskDetails() {
      const taskId = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`);
        const data = await response.json();
        this.task = data; 
      } catch (error) {
        console.error("Error fetching task details:", error);
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

    // Function to navigate
    goToHome() {
      this.$router.push("/home");
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    goToCreateTask() {
      this.$router.push("/tasks/create");
    },
    goToNotifications() {
      this.$router.push("/notifications");
    },

    async submitForm() {
      const taskId = this.$route.params.id;
      const formattedDate = new Date(this.task.due_date).toISOString();
      this.task.due_date = formattedDate; 

      try {
        const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.task),  
        });
        const data = await response.json();
        if (response.ok) {
          alert("Task updated successfully!");
          this.$router.push(`/tasks/${taskId}`); 
        } else {
          alert(data.error || "Failed to update task");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        alert("Failed to update task");
      }
    },

    // Delete task function
    showDeleteConfirmation() {
      this.isDeleteModalVisible = true;
    },
    cancelDelete() {
      this.isDeleteModalVisible = false;
    },
    async deleteTask() {
      const taskId = this.$route.params.id; 
      try {
        const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          alert('Task deleted successfully!');
          this.$router.push('/home');  
        } else {
          alert(data.error || 'Failed to delete task');
        }
        this.isDeleteModalVisible = false; 
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
        this.isDeleteModalVisible = false; 
      }
    },

    async fetchUserName() {
      const token = localStorage.getItem('authToken');  
      if (!token) {
        this.$router.push('/login');
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
        this.username = data.username; // Store the username
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    },
  },
  mounted() {
    this.fetchTaskDetails();  
    this.fetchCategories();
    this.fetchStatuses();
    this.fetchPriorities();
    this.fetchUserName();
  },
};
</script>

<style scoped>
/* Layout Styles */
.edit-task-container {
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

.edit-task-box {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  background: #f9e267;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

button:hover {
  background: darkorange;
}
</style>
