<template>
  <span class="headerAvatar">
    <template v-if="picType === 'avatar'">
      <el-avatar :size="30" :src="avatar" v-if="userInfo.headerImg"></el-avatar>
      <el-avatar :size="30" :src="require('@/assets/noBody.png')" v-else></el-avatar>
    </template>
    <template v-if="picType === 'img'">
      <img :src="avatar" class="avatar" v-if="userInfo.headerImg" />
      <img :src="require('@/assets/noBody.png')" class="avatar" v-else />
    </template>
    <template v-if="picType === 'file'">
      <img :src="file" class="file" />
    </template>
  </span>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'customPic',
  props: {
    picType: {
      type: String,
      required: false,
      default: 'avatar'
    },
    picSrc: {
      type: String,
      required: false,
      default: ''
    }
  },
  setup (props) {
    const store = useStore()
    const path = ref(process.env.VUE_APP_BASE_API)
    const userInfo = computed(() => store.getters['user/userInfo'])
    const avatar = computed(() => {
      if (props.picSrc === '') {
        if (
          userInfo.value.headerImg !== '' &&
          userInfo.value.headerImg.slice(0, 4) === 'http'
        ) {
          return userInfo.value.headerImg
        }
        return path.value + userInfo.value.headerImg
      } else {
        if (props.picSrc !== '' && props.picSrc.slice(0, 4) === 'http') {
          return props.picSrc
        }
        return path.value + props.picSrc
      }
    })
    const file = computed(() => {
      if (props.picSrc && props.picSrc.slice(0, 4) !== 'http') {
        return path.value + props.picSrc
      }
      return props.picSrc
    })
    return {
      avatar,
      userInfo,
      file
    }
  }
}
</script>

<style scoped>
.headerAvatar {
  display: flex;
  justify-content: center;
  align-items: center;
}
.file {
  width: 80px;
  height: 80px;
  position: relative;
}
</style>
