<template>
  <div class="container my-5">
    <NuxtLink to="/" class="home-button">🏠 메인으로 이동</NuxtLink>

    <h2 class="mb-4">이미지 생성</h2>

    <!-- 메시지 입력과 버튼을 한 줄로 배치 -->
    <div class="input-group mb-3">
      <input v-model="message" type="text" class="form-control" placeholder="상세 메시지를 입력하세요" />
      <button class="btn btn-primary" @click="generateImage">이미지 생성</button>
    </div>

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
        <input v-model.number="n" type="number" class="form-control" min="1" max="3" />
      </div>
    </div>

    <!-- 로딩 메시지 (Bootstrap alert) -->
    <div v-if="loading" class="alert alert-info mt-3" role="alert">
      이미지 생성 중입니다...
    </div>

    <!-- 이미지 출력 컨테이너 -->
    <div class="d-flex flex-wrap mt-4">
      <img
          v-for="(url, index) in imageUrls"
          :key="index"
          :src="url"
          class="img-thumbnail m-2"
          style="width: 300px; cursor: pointer;"
          @click="downloadImage(url)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
const apiBase = useApi() // ✅ 전역 API URL 사용

export default {
  setup() {
    const message = ref("");
    const model = ref("dall-e-2");
    const n = ref(1);
    const loading = ref(false);
    const imageUrls = ref([]);

    const generateImage = async () => {
      loading.value = true;
      try {
        const response = await fetch(`${apiBase}`+"/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            message: message.value,
            model: model.value,
            n: n.value,
          }),
        });

        imageUrls.value = await response.json();
        console.log("generateImage response : ",response)

      } catch (error) {
        console.error("이미지 생성 중 오류가 발생했습니다:", error);
        alert("이미지 생성에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        loading.value = false;
      }
    };

    const downloadImage = (imageUrl) => {
      const downloadUrl = `${apiBase}/download-file?url=${encodeURIComponent(imageUrl)}`;
      console.log("downloadUrl : ",downloadUrl)
      window.location.href = downloadUrl;
    };

    return {
      message,
      model,
      n,
      loading,
      imageUrls,
      generateImage,
      downloadImage,
    };
  },
};
</script>

<style scoped>
img {
  transition: transform 0.2s;
}
img:hover {
  transform: scale(1.05);
}
</style>
