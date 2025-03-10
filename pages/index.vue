<template>
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-4">Welcome to Nuxt</h1>
    <nav class="bg-gray-100 p-4 rounded-lg shadow-md">
      <ul class="flex space-x-4">
        <li v-for="page in pages" :key="page.path">
          <NuxtLink :to="page.path" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            {{ page.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from '#app' // ✅ Nuxt 3에서 올바른 import

const router = useRouter()
const pages = router.getRoutes().filter(route => route.path !== '/') // '/' (index) 제외
</script>
