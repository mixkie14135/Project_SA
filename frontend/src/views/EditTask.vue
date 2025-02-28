<template>
    <div class="edit-task-container">
      <div class="edit-task-box">
        <h2>Edit Task</h2>
        <div v-if="task">
          <form @submit.prevent="submitForm">
            <!-- Title -->
            <div>
              <label for="title">Title:</label>
              <input v-model="task.title" type="text" id="title" placeholder="Enter task title" required />
            </div>
  
            <!-- Description -->
            <div>
              <label for="description">Description:</label>
              <textarea v-model="task.description" id="description" placeholder="Enter task description" required></textarea>
            </div>
  
            <!-- Due Date -->
            <div>
              <label for="due_date">Due Date:</label>
              <input v-model="task.due_date" type="date" id="due_date" required />
            </div>
  
            <!-- Priority -->
            <div>
              <label for="priority">Priority:</label>
              <select v-model="task.priority_id" id="priority" required>
                <option v-for="priority in priorities" :key="priority.priority_id" :value="priority.priority_id">
                  {{ priority.priority }}
                </option>
              </select>
            </div>
  
            <!-- Category -->
            <div>
              <label for="category">Category:</label>
              <select v-model="task.category_id" id="category" required>
                <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                  {{ category.category_name }}
                </option>
              </select>
            </div>
  
            <!-- Status -->
            <div>
              <label for="status">Status:</label>
              <select v-model="task.status_id" id="status" required>
                <option v-for="status in statuses" :key="status.status_id" :value="status.status_id">
                  {{ status.status }}
                </option>
              </select>
            </div>
  
            <!-- Submit Button -->
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
        task: null, // เก็บข้อมูลของงานที่ต้องการแก้ไข
        categories: [], // เก็บข้อมูลหมวดหมู่
        statuses: [], // เก็บข้อมูลสถานะ
        priorities: [], // เก็บข้อมูลระดับความสำคัญ
      };
    },
    methods: {
      // ฟังก์ชันดึงข้อมูลของ task ที่จะทำการแก้ไข
      async fetchTaskDetails() {
        const taskId = this.$route.params.id;
        try {
          const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`);
          const data = await response.json();
          this.task = data; // เก็บข้อมูลที่ได้จาก API
          console.log("Task data:", this.task);  // ดูข้อมูล task ที่ได้
        } catch (error) {
          console.error("Error fetching task details:", error);
        }
      },
  
      // ฟังก์ชันดึงข้อมูลของ categories
      async fetchCategories() {
        try {
          const response = await fetch("http://localhost:8800/api/categories");
          const data = await response.json();
          this.categories = data; // เก็บข้อมูลจาก categories
          console.log("Categories:", this.categories);  // ตรวจสอบค่าที่ดึงมา
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },
  
      // ฟังก์ชันดึงข้อมูลของ statuses
      async fetchStatuses() {
        try {
          const response = await fetch("http://localhost:8800/api/status");
          const data = await response.json();
          this.statuses = data; // เก็บข้อมูลจาก status
          console.log("Statuses:", this.statuses);  // ตรวจสอบค่าที่ดึงมา
        } catch (error) {
          console.error("Error fetching statuses:", error);
        }
      },
  
      // ฟังก์ชันดึงข้อมูลของ priorities
      async fetchPriorities() {
        try {
          const response = await fetch("http://localhost:8800/api/priority");
          const data = await response.json();
          this.priorities = data; // เก็บข้อมูลจาก priority
          console.log("Priorities:", this.priorities);  // ตรวจสอบค่าที่ดึงมา
        } catch (error) {
          console.error("Error fetching priorities:", error);
        }
      },
  
      async submitForm() {
  const taskId = this.$route.params.id;

  // แปลงวันที่ให้เป็นรูปแบบ ISO 8601 (รวมเวลา)
  const formattedDate = new Date(this.task.due_date).toISOString();
  this.task.due_date = formattedDate; // อัปเดต task.due_date ด้วยวันที่ที่แปลงแล้ว

  try {
    const response = await fetch(`http://localhost:8800/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.task),  // ส่งข้อมูลที่มีการแก้ไขไป
    });

    const data = await response.json();
    if (response.ok) {
      alert("Task updated successfully!");
      this.$router.push(`/tasks/${taskId}`); // กลับไปที่หน้า task details
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
  /* เพิ่มสไตล์สำหรับ Edit Task */
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
    width: 100%;  /* เพิ่มความกว้างเต็มที่ */
  }
  
  select {
    font-size: 16px; /* เพิ่มขนาดฟอนต์ใน select */
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
  