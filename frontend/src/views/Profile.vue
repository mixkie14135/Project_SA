<template>
  <div class="profile-container">
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
        <h2>{{ currentDate }}</h2>
        <h3>Hello, {{ username }}</h3>
      </div>

      <!-- Profile Section -->
      <div class="profile-box">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {{ username }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
        <div>
          <label for="username">Edit Username:</label>
          <input v-model="newUsername" type="text" placeholder="Enter new username" />
        </div>
        <div class="btn-container">
          <button @click="updateUsername" class="btn_update">Update Username</button>
          <button @click="logout" class="btn_logout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",  
      email: "",      
      newUsername: "", 
      currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    };
  },
  methods: {
    async fetchUserInfo() {
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
        this.username = data.username;
        this.email = data.email;
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    async updateUsername() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await fetch('http://localhost:8800/api/auth/update-username', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: this.newUsername }),
        });
        const data = await response.json();
        if (response.ok) {
          this.username = data.username;
          alert("Username updated successfully!");
        } else {
          alert(data.error || "Failed to update username");
        }
      } catch (error) {
        console.error("Error updating username:", error);
      }
    },
    logout() {
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        localStorage.removeItem('authToken');
        this.$router.push('/');
      }
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    goToCreateTask() {
      this.$router.push('/tasks/create');
    },
    goToHome() {
      this.$router.push('/home');
    },
    goToNotifications() {
      this.$router.push('/notifications');
    },
    goToProfile() {
      this.$router.push('/profile');
    }
  },
  mounted() {
    this.fetchUserInfo();
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: 100vh;
  font-family: Arial, sans-serif;
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
  margin-left: 20px;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.profile-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  width: 500px;
  margin: 0 auto;
}

.update-bar {
  margin-top: 10px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: 50px;
}

.btn-container {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn_logout {
  background: #e74c3c;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn_update {
  background: #2ecc71;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn_logout:hover {
  background: #c0392b;
}

.btn_update:hover {
  background: #27ae60;
}
</style>
