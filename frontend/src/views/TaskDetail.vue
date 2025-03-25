<template>
    <div class="task-detail-container">
      <div class="task-detail-box">
        <h2>Task Details</h2>
        <div v-if="task">
          <h3>{{ task.title }}</h3>
          <p><strong>Description:</strong> {{ task.description }}</p>
          <p><strong>Due Date:</strong> {{ task.due_date }}</p>
          <p><strong>Priority:</strong> {{ task.priority_name }}</p> 
          <p><strong>Category:</strong> {{ task.category_name }}</p> 
          <p><strong>Status:</strong> {{ task.status_name }}</p> 
          <button @click="goToEditTask">Edit Task</button>
          <button @click="showDeleteConfirmation">Delete Task</button>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>
      <div v-if="isDeleteModalVisible" class="delete-modal">
        <div class="modal-content">
          <h4>Are you sure you want to delete this task?</h4>
          <button @click="deleteTask">Yes, Delete</button>
          <button @click="cancelDelete">Cancel</button>
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
      }
    },
    mounted() {
      this.fetchTaskDetails();  
    }
  };
  </script>
  
  <style scoped>
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
  
  button {
    background: #f9e267;
    padding: 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    margin: 5px;
  }
  
  button:hover {
    background: darkorange;
  }
  
  button + button {
    margin-left: 10px;
  }
  </style>
  