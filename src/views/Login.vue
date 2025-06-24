<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập</h2>
            <form @submit.prevent="loginEmailAndPassword" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" v-model="email" type="email" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="your@email.com" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
                    <input id="password" v-model="password" type="password" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••" />
                </div>
                <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
                <button type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Đăng nhập
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Người dùng đã đăng nhập, chuyển hướng đến trang chủ
            router.push('/');
        }
    });

    // Cleanup function
    return () => unsubscribe();
});

const loginEmailAndPassword = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        console.log('Đăng nhập thành công:', user);
        error.value = '';
        localStorage.setItem('token', user.accessToken);
        // Chuyển hướng sau khi đăng nhập thành công
        router.push('/'); // Chuyển hướng đến trang chủ
    } catch (err) {
        console.error('Lỗi đăng nhập:', err.message);
        error.value = 'Email hoặc mật khẩu không đúng';
    }
};

</script>