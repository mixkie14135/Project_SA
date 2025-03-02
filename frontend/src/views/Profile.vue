<template>
    <div class="profile-container">
      <!-- ✅ Navbar -->
      <nav class="navbar">
        <div class="logo">My Task List</div>
        <div class="nav-links">
          <button @click="goToDashboard">Dashboard</button>
          <button class="create-btn" @click="goToCreateTask">Create</button>
          <input  type="text" placeholder="Search" class="search-bar">
          <button class="icon-btn" @click="goToHome">🏠</button> <!-- ปุ่ม Home -->
          <button class="icon-btn" @click="goToNotifications">🔔</button>
          <button class="icon-btn" @click="goToProfile">👤</button> <!-- เปลี่ยนเส้นทางไปที่หน้า Profile -->
        </div>
      </nav>
  
      <!-- ✅ Profile Content -->
      <div class="profile-box">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {{ username }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
  
        <!-- แก้ไขชื่อผู้ใช้ -->
        <div>
          <label for="username">Edit Username:</label>
          <input v-model="newUsername" type="text" placeholder="Enter new username"  />
    
        </div>

        <!-- ปุ่ม Logout -->
        <div class="btn-container">
        <button @click="updateUsername" class="btn_update">Update Username</button>
        <button @click="logout" class="btn_logout">Logout</button>
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
        username: "",  // เก็บชื่อผู้ใช้จาก API
        email: "",      // เก็บอีเมลจาก API
        newUsername: "", // สำหรับการอัพเดตชื่อผู้ใช้
      };
    },
    methods: {
      // ฟังก์ชันดึงข้อมูลผู้ใช้จาก API
      async fetchUserInfo() {
        const token = localStorage.getItem('authToken'); // ดึง token จาก localStorage
        if (!token) {
          this.$router.push('/login'); // ถ้าไม่มี token ให้ไปหน้า login
          return;
        }
  
        try {
          const response = await fetch('http://localhost:8800/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,  // ส่ง JWT token ไปใน header
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
          this.username = data.username;  // แสดงชื่อผู้ใช้จาก API
          this.email = data.email;        // แสดงอีเมลจาก API
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      },
  
      // ฟังก์ชันสำหรับแก้ไขชื่อผู้ใช้
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
            this.username = data.username; // อัพเดตชื่อผู้ใช้ในหน้าโปรไฟล์
            alert("Username updated successfully!");
          } else {
            alert(data.error || "Failed to update username");
          }
        } catch (error) {
          console.error("Error updating username:", error);
        }
      },
  
      // ฟังก์ชันสำหรับ Logout
      logout() {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
          localStorage.removeItem('authToken'); // ลบ token ออกจาก localStorage
          this.$router.push('/');  // ไปที่หน้า login
        }
      },
  
      // ฟังก์ชันสำหรับเปลี่ยนเส้นทางไปยังหน้า Dashboard
      goToDashboard() {
        this.$router.push('/dashboard');
      },
  
      // ฟังก์ชันสำหรับเปลี่ยนเส้นทางไปยังหน้า CreateTask
      goToCreateTask() {
        this.$router.push('/tasks/create');
      },
  
      // ฟังก์ชันสำหรับเปลี่ยนเส้นทางไปยังหน้า Home
      goToHome() {
        this.$router.push('/home');
      },

      goToNotifications() {
        this.$router.push('/notifications');  // ✅ เปลี่ยนเส้นทางไปที่หน้า Notifications
      },
  
  
      // ฟังก์ชันสำหรับเปลี่ยนเส้นทางไปยังหน้า Profile
      goToProfile() {
        this.$router.push('/profile');
      }
    },
  
    mounted() {
      this.fetchUserInfo();  // เรียกข้อมูลผู้ใช้เมื่อหน้าโปรไฟล์โหลด
    }
  };
  </script>
  
  <style scoped>
  /* ✅ ตั้งค่า Layout หลัก */

  .profile-container {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: #f9f6c3;
    width: 100%;
    position: relative;
    padding-top: 450px;
  }
  
  .profile-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
  }
  
  .update-bar {
    margin-top: 10px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
  }
  
  
  
  /* ✅ Navbar */
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

   /* ✅ ปุ่ม Create */
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

/* สำหรับการจัดเรียงปุ่มแนวนอน */
.btn-container {
    margin-top: 20px;
    display: flex; /* ใช้ flexbox เพื่อจัดเรียงปุ่มในแนวนอน */
    gap: 10px; /* ระยะห่างระหว่างปุ่ม */
    justify-content: center; /* จัดตำแหน่งปุ่มให้อยู่กึ่งกลาง */
}

/* ปุ่ม Logout และ Update ก่อนจะ hover */
.btn_logout {
    background: red;  /* สีพื้นก่อน hover */
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
}

.btn_update {
    background: green;  /* สีพื้นก่อน hover */
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
}

/* เปลี่ยนสีเมื่อ hover */
.btn_logout:hover {
    background: darkred;  /* เปลี่ยนสีเมื่อ hover */
}

.btn_update:hover {
    background: darkgreen;  /* เปลี่ยนสีเมื่อ hover */
}


  
  
  .nav-links {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-right: 50px;
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
  </style>
  