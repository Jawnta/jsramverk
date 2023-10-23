<template>
    <div class="login-container">
        <div class="login-form">
            <h2>Login</h2>
            <input type="text" v-model="email" placeholder="Email" />
            <input type="password" v-model="password" placeholder="Password" />
            <button @click="handleLogin">Login</button>
            <p>Inget konto? <router-link to="/register">Registrera dig här</router-link></p>
        </div>
        <div>

        </div>

    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
const router = useRouter()
const backend = import.meta.env.VITE_BACKEND_URL
const email = ref("")
const password = ref("")
const handleLogin = async () => {
    await login();
};

const login = async () => {
    try {
        const response = await axios.post(`${backend}/auth/login`, {
            email: email.value,
            password: password.value,
        }, {
            withCredentials: true,
        });

        if (response.status === 201) {
            router.push({
                name: 'home'
            })
        }

    } catch (error) {
        console.error('Login error:', error);
    }
};
</script>
  
<style scoped>
.login-container {

    background-size: cover;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form {
    background-color: rgba(255, 255, 255, 0.8);
    /* Slightly transparent white */
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>
