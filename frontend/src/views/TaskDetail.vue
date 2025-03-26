<template>
  <div class="task-detail-container">
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
        <h2>Task Details</h2>
        <h3>Hello, {{ username }}</h3>
      </div>

      <!-- Task Details -->
      <div v-if="task" class="task-detail-box">
        <h3>{{ task.title }}</h3>
        <p><strong>Description:</strong> {{ task.description }}</p>
        <p><strong>Due Date:</strong> {{ new Date(task.due_date).toLocaleDateString() }}</p>
        <p><strong>Priority:</strong> {{ task.priority_name }}</p> 
        <p><strong>Category:</strong> {{ task.category_name }}</p> 
        <p><strong>Status:</strong> <span :class="task.status">{{ task.status_name }}</span></p>
        <div class="action-buttons">
          <button @click="goToEditTask" class="edit-btn">Edit Task</button>
          <button @click="showDeleteConfirmation" class="delete-btn">Delete Task</button>
        </div>
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
      isDeleteModalVisible: false,  
      username: "", 
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
    goToHome() {
      this.$router.push("/home");
    },
    goToProfile() {
      this.$router.push("/profile");
    },
    goToDashboard() {
      this.$router.push("/dashboard");
    },
    goToCreateTask() {
      this.$router.push("/tasks/create");
    },
    goToNotifications() {
      this.$router.push("/notifications");
    },
    goToEditTask() {
      this.$router.push(`/tasks/edit/${this.task.task_id}`);
    },
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
    this.fetchUserName();  
  },
};
</script>

<style scoped>
.task-detail-container {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
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

.task-detail-box {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.task-detail-box h3 {
  font-size: 1.8rem;
}

.task-detail-box p {
  margin: 10px 0;
}

.task-status {
  font-weight: bold;
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

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.edit-btn, .delete-btn {
  background-color: #ff7f50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.edit-btn:hover, .delete-btn:hover {
  background-color: #e7663a;
}

.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.delete-confirm-btn {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f39c12;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: darkorange;
}
</style>
