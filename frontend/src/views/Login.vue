<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Left side: Login -->
      <div class="left-side">
        <h2>Login</h2>
        <p class="subtitle">Ready to Begin? Sign In Now!</p>
        <form @submit.prevent="login">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" v-model="password" placeholder="Enter your Password" required />

          <button type="submit" class="login-btn">Sign In</button>
        </form>
        <p class="switch">
          Don’t have an account?
          <router-link to="/register">Sign up</router-link>
        </p>
      </div>

      <!-- Right side: CTA -->
      <div class="right-side">
        <img src="/assets/user2.png" alt="login-icon" class="auth-icon" />
        <h2>Hello, Friend!</h2>
        <p>Enter your personal details and start your journey with us</p>
        <router-link to="/register" class="signup-btn">SIGN UP</router-link>
      </div>
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
          localStorage.setItem('authToken', data.token);
          alert('Login successful!');
          console.log(data);
          this.$router.push('/home');
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (error) {
        alert('Error logging in');
        console.error(error);
      }
    }
  },
  mounted() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.$router.push('/home');
    }
  }
};
</script>

<style>

.auth-icon {
  width: 202px;
  margin-bottom: 20px;
}

.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  display: flex;
  width: 100%;
  height: 100%;
  max-width: none;
  border-radius: 0;
}


/* LEFT */
.left-side {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
}

.left-side h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  margin-bottom: 20px;
  color: #666;
}

.left-side label {
  font-weight: 600;
  margin: 10px 0 5px;
  display: block;
  color: #444;
}

.left-side input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 10px;
}

.login-btn {
  width: 100%;
  background-color: #ff4b2b;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
}

.login-btn:hover {
  background-color: #e74324;
}

.switch {
  margin-top: 18px;
  font-size: 14px;
  color: #555;
}

.switch a {
  color: #ff4b2b;
  font-weight: bold;
  text-decoration: none;
}

.switch a:hover {
  text-decoration: underline;
}

/* RIGHT */
.right-side {
  flex: 1;
  background: linear-gradient(to right, #ff416c, #ff4b2b);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.right-side h2 {
  font-size: 26px;
  margin-bottom: 12px;
}

.right-side p {
  font-size: 15px;
  max-width: 240px;
  margin-bottom: 24px;
}

.signup-btn {
  padding: 10px 24px;
  border: 1px solid white;
  color: white;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease;
}

.signup-btn:hover {
  background: white;
  color: #ff4b2b;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  background: #f6f5f7;
}

</style>
