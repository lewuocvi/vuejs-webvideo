<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="container mx-auto px-4 py-10 max-w-md">
      <div class="card bg-white shadow-xl card-border border-base-300 card-sm overflow-hidden">
        <div class="border-base-300 border-b">
          <div class="flex items-center gap-2 p-4">
            <div class="grow">
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 opacity-40">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                Đặng nhập bằng email
              </div>
            </div>
            <router-link to="/register" class="link link-hover">Đặng ký</router-link>
          </div>
        </div>
        <div class="card-body gap-4">
          <p class="text-sm opacity-60">Đăng ký miễn phí và chỉ mất một phút</p>
          <div class="flex flex-col gap-3">
            <label class="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"></path>
              </svg>
              <input type="email" v-model="email" class="grow" placeholder="Email" />
            </label>
            <label class="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd"></path>
              </svg>
              <input type="password" v-model="password" class="grow" placeholder="Password" />
            </label>
          </div>
          <span v-if="userStore.error" class="text-sm text-red-500 flex items-center gap-2 px-1"> <span class="inline-block w-2 h-2 bg-red-500 rounded-full"></span> {{ userStore.error }} </span>
          <label class="flex items-center gap-2 text-sm"> <input type="checkbox" v-model="acceptTerms" class="checkbox checkbox-sm" /> Đồng ý với các điều khoản dịch vụ </label>
          <div class="card-actions items-center gap-4 mt-4">
            <button @click="createUser" type="button" class="btn btn-primary w-full">Đặng nhập</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/userStore";

const router = useRouter();
const userStore = useUserStore();

const email = ref("lewuocvi@gmail.com");
const password = ref("");
const acceptTerms = ref(false);

const createUser = async () => {
  try {
    //
    if (!email.value.includes("@")) {
      throw new Error("Email thiếu ký tự @");
    }

    if (password.value.length < 8) {
      throw new Error("Mật khẩu phải phải ít nhất 8 ký tự");
    }

    if (!acceptTerms.value) {
      throw new Error("Bạn chưa đồng ý với điều khoản dịch vụ");
    }

    await userStore.signin({ email: email.value, password: password.value, acceptTerms: acceptTerms.value });

    if (userStore.isAuthenticated) {
      localStorage.setItem("token", userStore.token); // Store user token in local storage
      router.push("/"); // Redirect to home page after successful registration
    }
    //
    userStore.error = null; // Clear error message after successful registration or login
    //
  } catch (error) {
    userStore.error = error.message;
  }
};

onMounted(() => {
  userStore.error = null; // Clear error message when component is mounted
});

//
</script>
