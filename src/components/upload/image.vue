<template>
  <div>
    <el-upload
      class="image-uploader"
      :action="`${path}/fileUploadAndDownload/upload`"
      :headers="{ 'x-token': token }"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :before-upload="beforeImageUpload"
      :multiple="false"
    >
      <img v-if="imageUrl" :src="path + imageUrl" class="image" />
      <i v-else class="el-icon-plus image-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import ImageCompress from '@/utils/image'
import { computed, getCurrentInstance, ref } from 'vue'
export default {
  name: 'upload-image',
  props: {
    imageUrl: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number,
      default: 2048 // 2M 超出后执行压缩
    },
    maxWH: {
      type: Number,
      default: 1920 // 图片长宽上限
    }
  },
  setup (props) {
    const { ctx } = getCurrentInstance()
    const store = useStore()
    const path = ref(process.env.VUE_APP_BASE_API)
    const token = computed(store.getters['user/token'])
    const beforeImageUpload = (file) => {
      const isRightSize = file.size / 1024 < props.fileSize
      if (!isRightSize) {
        // 压缩
        const compress = new ImageCompress(file, props.fileSize, props.fileSize)
        return compress.compress()
      }
      return isRightSize
    }
    const handleImageSuccess = (res) => {
      // this.imageUrl = URL.createObjectURL(file.raw);
      const { data } = res
      if (data.file) {
        ctx.$emit('change', data.file.url)
      }
    }

    return {
      path,
      token,
      beforeImageUpload,
      handleImageSuccess
    }
  }
}
</script>

<style lang="scss" scoped>
.image-uploader {
  border: 1px dashed #d9d9d9;
  width: 180px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-uploader {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.image {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
