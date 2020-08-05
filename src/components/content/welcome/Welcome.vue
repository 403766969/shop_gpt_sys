<template>
  <div id="welcome">
    <h1>Welcome!</h1>
    <h2>欢迎使用电商后台管理系统！</h2>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="less" scoped>
#welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  h1{
    transform: translateY(-80px);
    font-size: 36px;
  }
  h2{
    transform: translateY(-80px);
    font-size: 28px;
  }
}
</style>