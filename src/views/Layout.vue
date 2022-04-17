<!--  -->
<template>
  <!-- 顶部通栏 -->
  <NavBar />

  <!-- 头部组件 -->
  <AppHeader />
  <!-- 吸顶头部组件 -->
  <AppHeaderSticky />
  <!-- 内容 -->
  <div class="app-body">
    <router-view />
  </div>

  <!-- 底部组件 -->
  <AppFooter />
</template>

<script>
import NavBar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    NavBar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup() {
    const store = useStore()
    store.dispatch('category/getList')

  }

}

</script>
<style lang='less' scoped>
.app-body {
  min-height: 600px;
}
</style>