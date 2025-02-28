<template>
    <div class="register-container">
      <div class="register-box">
        <h2>Register</h2>
        <form @submit.prevent="register">
          <label>Username</label>
          <input type="text" v-model="username" placeholder="Enter your username" required />
          
          <label>Email</label>
          <input type="email" v-model="email" placeholder="Enter your email" required />
          
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Enter your password" required />
          
          <label>Confirm Password</label>
          <input type="password" v-model="confirmPassword" placeholder="Enter your password again" required />
  
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <router-link to="/">Login</router-link></p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        try {
          const response = await fetch('http://localhost:8800/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: this.username,
              email: this.email,
              password: this.password
            })
          });
          const data = await response.json();
          if (response.ok) {
            alert('Registration successful!');
            this.$router.push('/');
          } else {
            alert(data.error || 'Registration failed');
          }
        } catch (error) {
          alert('Error registering');
          console.error(error);
        }
      }
    }
  };
  </script>
  
  <style>
  /* ✅ ใส่ CSS ตกแต่ง */
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f9f6c3;
  }
  
  .register-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  