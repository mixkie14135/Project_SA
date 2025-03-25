<template>
  <div class="register-wrapper">
    <div class="register-panel">
      <!-- Left side: Form -->
      <div class="register-form">
        <h2>Create an Account</h2>
        <p class="subtitle">Join us and start your journey!</p>
        <form @submit.prevent="register">
          <div class="form-group">
            <label>Username</label>
            <input type="text" v-model="username" placeholder="Enter your username" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" placeholder="Enter your email" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Enter your password" required />
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" v-model="confirmPassword" placeholder="Enter your password again" required />
          </div>

          <button type="submit" class="btn-register">Register</button>
        </form>
        <p class="login-link">
          Already have an account?
          <router-link to="/">Login here</router-link>
        </p>
      </div>

      <!-- Right side: Welcome CTA -->
      <div class="register-side">
        <img src="/assets/sign-up.png" alt="login-icon" class="auth-icon" />
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
        <router-link to="/" class="btn-outline">SIGN IN</router-link>
      </div>
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
.register-wrapper {
  width: 100vw;
  height: 100vh;
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-panel {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 0;
  box-shadow: none; /* หรือจะใส่ไว้ก็ได้ */
}


/* Left side */
.register-form {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.register-form h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  margin-bottom: 20px;
  font-size: 14px;
  color: #777;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 15px;
}

.form-group input:focus {
  outline: none;
  border-color: #7e57c2;
}

.btn-register {
  margin-top: 12px;
  padding: 12px;
  width: 100%;
  background-color: #ff4b2b;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #e74324;
}

.login-link {
  margin-top: 18px;
  font-size: 14px;
  color: #555;
  text-align: center;
}

.login-link a {
  color: #ff4b2b;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Right side */
.register-side {
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

.register-side h2 {
  font-size: 24px;
  margin-bottom: 14px;
}

.register-side p {
  font-size: 15px;
  max-width: 240px;
  margin-bottom: 24px;
}

.btn-outline {
  padding: 10px 24px;
  border: 1px solid white;
  color: white;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-outline:hover {
  background: white;
  color: #ff4b2b;
}
</style>
