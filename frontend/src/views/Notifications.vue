<template>
    <div class="notifications-container">
      <!-- ✅ Navbar -->
      <nav class="navbar">
        <div class="logo">My Task List</div>
        <div class="nav-links">
          <button @click="goToDashboard">Dashboard</button>
          <button class="create-btn" @click="goToCreateTask">Create</button>
          <input type="text" placeholder="Search" class="search-bar">
          <button class="icon-btn" @click="goToHome">🏠</button> <!-- เพิ่มปุ่ม Home -->
          <button class="icon-btn" @click="goToNotifications">🔔</button>
          <button class="icon-btn" @click="goToProfile">👤</button> <!-- เปลี่ยนเส้นทางไปที่หน้า Profile -->
        </div>
      </nav>
  
      <!-- Content for notifications -->
      <div class="content-wrapper">
        <h2>Notifications</h2>
        <div v-if="notifications.length === 0">
          <p>No new notifications</p> <!-- แสดงข้อความว่าไม่มีการแจ้งเตือนหากไม่มีการแจ้งเตือน -->
        </div>
        <div v-else class="notification-cards">
          <div v-for="(notification, index) in notifications" :key="index" class="notification-card">
            <div class="notification-message">
              <p>{{ notification.message }}</p>
              <p><small>{{ new Date(notification.created_at).toLocaleString() }}</small></p>
            </div>
            <button @click="markAsRead(notification.notification_id)" class="mark-read-btn">Mark as Read</button>
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
        notifications: [],  // เก็บการแจ้งเตือนที่ดึงมาจาก API
      };
    },
    methods: {
      goToHome() {
        this.$router.push('/home');
      },
      goToProfile() {
        this.$router.push('/profile');
      },
      goToDashboard() {
        this.$router.push('/dashboard');
      },
      goToCreateTask() {
        this.$router.push('/tasks/create');
      },
      goToNotifications() {
        this.$router.push('/notifications');
      },
  
      async fetchNotifications() {
        const token = localStorage.getItem("authToken");  // ดึง token จาก localStorage
        if (!token) {
          console.error("No token found");
          return;
        }
  
        const decoded = this.decodeJwt(token);
        const userId = decoded?.userId;
  
        try {
          const response = await fetch(`http://localhost:8800/api/notifications/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }
  
          const data = await response.json();
          this.notifications = data;
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      },
  
      decodeJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));
        return decodedData;
      },
  
      async markAsRead(notificationId) {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found");
          return;
        }
  
        try {
          const response = await fetch(`http://localhost:8800/api/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
          if (response.ok) {
            alert(data.message);
            this.notifications = this.notifications.filter(notification => notification.notification_id !== notificationId);
          } else {
            alert(data.error || "Failed to mark notification as read");
          }
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      }
    },
  
    mounted() {
      this.fetchNotifications();
    }
  };
  </script>
  
  <style scoped>
  .notifications-container {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: #f9f6c3;
    width: 100%;
    position: relative;
    padding-top: 80px;
    padding-bottom: 200px; /* ✅ ป้องกันไม่ให้ Footer ทับ Pagination */
  }
  
  .content-wrapper {
    width: 80%;
    max-width: 1000px;
    text-align: center;
    padding-top: 80px;
    margin-top: 20px;
  }
  
  .notification-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .notification-card {
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }
  
  .notification-card:hover {
    transform: scale(1.05);
  }
  
  .notification-message p {
    margin: 5px 0;
  }
  
  .mark-read-btn {
    background: #f9e267;
    color: black;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .mark-read-btn:hover {
    background: darkorange;
  }
  
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
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-right: 50px;
  }
  
  body {
    font-family: 'Kanit', sans-serif;
  }
  
  @media (max-width: 1024px) {
    .navbar {
      flex-direction: column;
    }
  
    .nav-links {
      flex-direction: column;
      align-items: center;
    }
  }
  </style>
  