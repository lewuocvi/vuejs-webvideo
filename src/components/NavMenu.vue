<template>
  <div :class="['items-center justify-between w-full md:flex md:w-auto md:order-1', { hidden: !isOpen }]" id="navbar-user">
    <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li v-for="(item, index) in menuItems" :key="index">
        <a :href="item.href" :class="['block py-2 px-3 rounded-sm md:p-0', item.active ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700']" :aria-current="item.active ? 'page' : undefined">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  menuItems: Array,
});
</script>
