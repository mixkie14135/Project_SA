<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <p>Ready to Begin? Sign In Now!</p>
      <form @submit.prevent="login">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Enter your email" required />

        <label>Password</label>
        <input type="password" v-model="password" placeholder="Enter your Password" required />

        <button type="submit">Sign In</button>
      </form>
      <p>Don’t have an account? <router-link to="/register">Sign up</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:8800/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        const data = await response.json();

        if (response.ok) {
          // เมื่อ login สำเร็จ, เก็บ JWT token ใน localStorage
          localStorage.setItem('authToken', data.token);  // เก็บ token ที่ได้จาก API
          alert('Login successful!');
          console.log(data);
          this.$router.push('/home');  // ✅ เปลี่ยนเส้นทางไปที่หน้า Home
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (error) {
        alert('Error logging in');
        console.error(error);
      }
    }
  }
};
</script>

<style>
/* ✅ ใส่ CSS ตกแต่ง */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f9f6c3;
}

.login-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
</style>
