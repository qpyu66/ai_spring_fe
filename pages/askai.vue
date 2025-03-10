<template>
  <div class="container mt-5">
    <NuxtLink to="/" class="home-button">🏠 메인으로 이동</NuxtLink>
    <h2 class="text-center">Ask AI</h2>
    <div class="form-group">
      <label for="question">질문을 입력하세요:</label><br>
      <input v-model="question" type="text" id="question" class="form-control" placeholder="질문 입력">
    </div>
    <button class="btn btn-primary mt-2" @click="getResponse">Ask</button>
    <button class="btn btn-secondary mt-2" @click="getResponseOptions">Ask with Options</button>

    <div class="mt-4">
      <div v-if="response" class="alert alert-info" role="alert">{{ response }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
const apiBase = useApi() // ✅ 전역 API URL 사용

export default {
  setup() {
    const question = ref('');
    const response = ref('');

    const getResponse = async () => {
      if (!question.value.trim()) {
        alert('질문을 입력하세요');
        return;
      }

      response.value = '응답이 생성중입니다...';

      try {
        const res = await fetch(`${apiBase}/ask?message=${encodeURIComponent(question.value)}`);
        console.log("API 요청 URL ask:", res) // 요청 URL 확인
        response.value = await res.text();
      } catch (error) {
        console.error('Error:', error);
        response.value = '오류가 발생했습니다.';
      }
    };

    const getResponseOptions = async () => {
      if (!question.value.trim()) {
        alert('질문을 입력하세요');
        return;
      }

      response.value = '응답이 생성중입니다...';

      try {
        const res = await fetch(`${apiBase}/ask-ai?message=${encodeURIComponent(question.value)}`);
        console.log("API 요청 URL ask-ai:", res) // 요청 URL 확인

        response.value = await res.text();
      } catch (error) {
        console.error('Error:', error);
        response.value = '오류가 발생했습니다.';
      }
    };

    return {
      question,
      response,
      getResponse,
      getResponseOptions
    };
  }
};
</script>

<style>
/* Bootstrap 사용 */
</style>
