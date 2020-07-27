<template>
  <div id="home">
    <el-button type="info" icon="el-icon-delete" circle @click="logoutClick"></el-button>
  </div>
</template>

<script>
export default {
  name: 'Name',
  methods: {
    logoutClick() {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  width: 100%;
  height: 100%;
}
</style>