<template>
  <div class="container my-5">
    <h2 class="mb-4">Web Speech와 OpenAI로 음성 기반 이미지 생성</h2>

    <!-- 메시지 입력과 버튼을 한 줄로 배치 -->
    <div class="input-group mb-3">
      <input
          v-model="message"
          type="text"
          class="form-control"
          placeholder="음성 메시지가 표시됩니다.(최소 10자 이상이 되어야 합니다.)"
      />
      <button class="btn btn-default" @click="startSpeechRecognition">
        <i class="fas fa-microphone" style="color: grey;"></i>
        <img src="/mic_icon.ico" alt="Microphone" style="width: 24px; height: 24px;">
      </button>
    </div>

    <!-- 음성 인식 상태 -->
    <p class="text-muted">{{ status }}</p>

    <!-- 모델 선택과 이미지 개수 선택을 한 줄로 배치 -->
    <div class="row mb-3">
      <div class="col-md-6">
        <label for="model" class="form-label">모델 선택</label>
        <select v-model="model" class="form-select">
          <option value="dall-e-2">DALL-E 2</option>
          <option value="dall-e-3">DALL-E 3</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="n" class="form-label">이미지 개수 (1-3)</label>
        <input v-model="n" type="number" class="form-control" min="1" max="3" />
      </div>
    </div>

    <!-- 로딩 메시지 -->
    <div v-if="loading" class="alert alert-info mt-3" role="alert">
      이미지 생성 중입니다...
    </div>

    <!-- 이미지 출력 컨테이너 -->
    <div class="d-flex flex-wrap mt-4">
      <img
          v-for="(url, index) in images"
          :key="index"
          :src="url"
          class="img-thumbnail m-2"
          style="width: 300px;"
          @click="downloadImage(url)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const message = ref("");
const model = ref("dall-e-2");
const n = ref(1);
const images = ref([]);
const loading = ref(false);
const status = ref("");
const isRecognizing = ref(false); // 음성 인식 상태 변수

let recognition;

// 이미지 생성 API 요청
const fetchImage = async () => {
  if (message.value.length < 10) {
    status.value = "텍스트 길이가 너무 짧습니다.";
    isRecognizing.value = false;
    return;
  }

  loading.value = true;
  try {
    const { data } = await useFetch("/image", {
      method: "POST",
      body: JSON.stringify({
        message: message.value,
        model: model.value,
        n: parseInt(n.value)
      }),
      headers: { "Content-Type": "application/json" },
    });

    images.value = data.value || [];
  } catch (error) {
    console.error("이미지 생성 중 오류 발생:", error);
    alert("이미지 생성에 실패했습니다. 다시 시도해 주세요.");
  } finally {
    loading.value = false;
  }
};

// 음성 인식 시작
const startSpeechRecognition = () => {
  if (isRecognizing.value) {
    // 이미 음성 인식 중이면 중지
    recognition.stop();
    return;
  }

  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "ko-KR";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isRecognizing.value = true; // 음성 인식 시작
    status.value = "음성 인식 중...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    message.value = transcript;
    status.value = "음성 인식 완료";

    if (transcript.length >= 10) {
      fetchImage();
    } else {
      status.value = "음성 인식 완료 - 텍스트 길이가 너무 짧습니다.";
    }
  };

  recognition.onerror = (event) => {
    console.error("오류 발생:", event.error);
    status.value = "오류 발생: " + event.error;
  };

  recognition.onend = () => {
    isRecognizing.value = false; // 음성 인식 종료
    status.value = "음성 인식이 종료되었습니다.";
  };

  recognition.start();
};

// 이미지 다운로드 함수
const downloadImage = (imageUrl) => {
  const downloadUrl = `/download-file?url=${encodeURIComponent(imageUrl)}`;
  window.location.href = downloadUrl;
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
