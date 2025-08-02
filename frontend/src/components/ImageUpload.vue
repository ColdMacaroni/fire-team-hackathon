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
  <div class="image-upload-container">
    <div class="image-preview" v-if="image">
      <img :src="image" alt="Recipe preview" />
    </div>
    <div class="upload-area" v-else>
      <input 
        type="file" 
        id="image-upload" 
        accept="image/*" 
        @change="handleImageUpload"
        class="file-input"
      />
      <label for="image-upload" class="upload-label">
        <div class="upload-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <p>Click to upload image</p>
          <p class="upload-hint">Image will be converted to 1320x1000 aspect ratio</p>
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.upload-label:hover {
  border-color: #007bff;
  background: #f8f9ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  padding: 1rem;
  box-sizing: border-box;
}

.upload-hint {
  font-size: 0.875rem;
  margin-top: 8px;
  color: #adb5bd;
  text-align: center;
}
</style> 