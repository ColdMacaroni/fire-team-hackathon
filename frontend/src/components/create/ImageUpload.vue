<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  image: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:image'])

// Handle image upload and conversion
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Set canvas size to target aspect ratio
        canvas.width = 1320
        canvas.height = 1000

        // Calculate scaling to maintain aspect ratio
        const scale = Math.min(1320 / img.width, 1000 / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale

        // Center the image
        const x = (1320 - scaledWidth) / 2
        const y = (1000 - scaledHeight) / 2

        // Draw the image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

        // Convert to blob and emit the image URL
        canvas.toBlob((blob) => {
          const imageUrl = URL.createObjectURL(blob)
          emit('update:image', imageUrl)
        }, 'image/jpeg', 0.8)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="image-upload-container" data-v-inspector="src/components/create/ImageUpload.vue:54:3">
    <div class="image-preview" v-if="image" data-v-inspector="src/components/create/ImageUpload.vue:55:5">
      <img :src="image" alt="Recipe preview" data-v-inspector="src/components/create/ImageUpload.vue:56:7" />
    </div>
    <div class="upload-area" v-else data-v-inspector="src/components/create/ImageUpload.vue:58:5">
      <input type="file" id="image-upload" accept="image/*" @change="handleImageUpload" class="file-input" data-v-inspector="src/components/create/ImageUpload.vue:59:7" />
      <label for="image-upload" class="upload-label" data-v-inspector="src/components/create/ImageUpload.vue:60:7">
        <div class="upload-content" data-v-inspector="src/components/create/ImageUpload.vue:61:9">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-inspector="src/components/create/ImageUpload.vue:62:11">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-inspector="src/components/create/ImageUpload.vue:63:13" />
            <polyline points="7,10 12,15 17,10" data-v-inspector="src/components/create/ImageUpload.vue:64:13" />
            <line x1="12" y1="15" x2="12" y2="3" data-v-inspector="src/components/create/ImageUpload.vue:65:13" />
          </svg>
          <p data-v-inspector="src/components/create/ImageUpload.vue:67:11">Click to upload image</p>
          <p class="upload-hint" data-v-inspector="src/components/create/ImageUpload.vue:68:11">Image will be converted to 1320x1000 aspect ratio</p>
        </div>
      </label>
    </div>
  </div>
</template>

<style scoped>
.image-upload-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.image-preview {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  max-width: 100%;
}

.upload-area {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.file-input {
  display: none;
}

.upload-label {
  display: block;
  width: 100%;
  height: 200px;
  border: 2px dashed #666666;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #404040;
  box-sizing: border-box;
}

.upload-label:hover {
  border-color: var(--color-accent);
  background: #505050;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #e0e0e0;
  padding: 1rem;
  box-sizing: border-box;
}

.upload-hint {
  font-size: 0.875rem;
  margin-top: 8px;
  color: #b0b0b0;
  text-align: center;
}
</style>