<template>
    <div class="create-task-container">
      <div class="create-task-box">
        <h2>Create Task</h2>
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
  </template>
  
  <script>
  export default {
    data() {
      return {
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
      // ฟังก์ชันเพื่อส่งข้อมูลไปยัง API
      async submitForm() {
        const token = localStorage.getItem("authToken");
  
        if (!token) {
          alert("No token found");
          return;
        }
  
        // แปลงวันที่ให้เป็นรูปแบบ ISO 8601
        const formattedDate = new Date(this.task.due_date).toISOString();
        this.task.due_date = formattedDate;
  
        // สร้างข้อมูล task ที่จะส่งไป
        const taskData = {
          title: this.task.title,
          description: this.task.description,
          user_id: this.$route.params.userId, // คุณสามารถดึง userId จาก token หรือ route params
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
  
      // ฟังก์ชันดึงข้อมูล categories
      async fetchCategories() {
        try {
          const response = await fetch("http://localhost:8800/api/categories");
          const data = await response.json();
          this.categories = data;
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
  
      // ฟังก์ชันดึงข้อมูล statuses
      async fetchStatuses() {
        try {
          const response = await fetch("http://localhost:8800/api/status");
          const data = await response.json();
          this.statuses = data;
        } catch (error) {
          console.error("Error fetching statuses:", error);
        }
      },
  
      // ฟังก์ชันดึงข้อมูล priorities
      async fetchPriorities() {
        try {
          const response = await fetch("http://localhost:8800/api/priority");
          const data = await response.json();
          this.priorities = data;
        } catch (error) {
          console.error("Error fetching priorities:", error);
        }
      }
    },
    mounted() {
      this.fetchCategories();
      this.fetchStatuses();
      this.fetchPriorities();
    }
  };
  </script>
  
  <style scoped>
  /* เพิ่มสไตล์สำหรับ Create Task */
  .create-task-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: #f9f6c3;
  }
  
  .create-task-box {
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
  