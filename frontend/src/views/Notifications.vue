<template>
  <div class="notifications-container">
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

    <!-- Content -->
    <div class="content-wrapper">
      <div class="header">
        <h2>Notifications</h2>
      </div>
      <div v-if="notifications.length === 0">
        <p>No new notifications</p> 
      </div>
      <div v-else class="notification-cards">
        <div
          v-for="(notification, index) in notifications"
          :key="index"
          class="notification-card"
        >
          <p>{{ notification.message }}</p>
          <p class="timestamp">{{ new Date(notification.created_at).toLocaleString() }}</p>
          <button @click="markAsRead(notification.notification_id)" class="mark-read-btn">
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [],
    };
  },
  methods: {
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

    async fetchNotifications() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }
      const decoded = this.decodeJwt(token);
      const userId = decoded?.userId;
      try {
        const response = await fetch(
          `http://localhost:8800/api/notifications/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        this.notifications = data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },

    decodeJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
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
        const response = await fetch(
          `http://localhost:8800/api/notifications/${notificationId}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          this.notifications = this.notifications.filter(
            (n) => n.notification_id !== notificationId
          );
        } else {
          alert(data.error || "Failed to mark notification as read");
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
  },
  mounted() {
    this.fetchNotifications();
  },
};
</script>

<style scoped>
.notifications-container {
  display: flex;
  min-height: 100vh;
  background: #ecf0f1;
}

/* Sidebar */
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

/* Content */
.content-wrapper {
  flex-grow: 1;
  padding: 40px;
  background-color: #ecf0f1;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.notification-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.notification-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.notification-card:hover {
  transform: scale(1.03);
}

.timestamp {
  color: #555;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.mark-read-btn {
  background: #f9e267;
  color: black;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.mark-read-btn:hover {
  background: darkorange;
}
</style>
