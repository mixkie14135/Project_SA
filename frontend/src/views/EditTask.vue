<template>
    <div class="edit-task-container">
      <div class="edit-task-box">
        <h2>Edit Task</h2>
        <div v-if="task">
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
        <div v-else>
          <p>Loading...</p>
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
      };
    },
    methods: {
      async fetchTaskDetails() {
        const taskId = this.$route.params.id;
        try {
          const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`);
          const data = await response.json();
          this.task = data; 
          console.log("Task data:", this.task);  
        } catch (error) {
          console.error("Error fetching task details:", error);
        }
      },
      async fetchCategories() {
        try {
          const response = await fetch("http://localhost:8800/api/categories");
          const data = await response.json();
          this.categories = data; 
          console.log("Categories:", this.categories);  
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
      async fetchStatuses() {
        try {
          const response = await fetch("http://localhost:8800/api/status");
          const data = await response.json();
          this.statuses = data; 
          console.log("Statuses:", this.statuses);  
        } catch (error) {
          console.error("Error fetching statuses:", error);
        }
      },
      async fetchPriorities() {
        try {
          const response = await fetch("http://localhost:8800/api/priority");
          const data = await response.json();
          this.priorities = data; 
          console.log("Priorities:", this.priorities);  
        } catch (error) {
          console.error("Error fetching priorities:", error);
        }
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
}
},
    mounted() {
      this.fetchTaskDetails();
      this.fetchCategories();
      this.fetchStatuses();
      this.fetchPriorities();
    },
  };
  </script>
  
  <style scoped>
  .edit-task-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: #f9f6c3;
  }
  
  .edit-task-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  input,
  textarea,
  select {
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
    width: 100%;  
  }
  
  select {
    font-size: 16px; 
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
  