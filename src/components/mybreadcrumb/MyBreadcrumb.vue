<template>
  <div class="my-breadcrumb">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item,index) in navs"
        :key="index"
        v-bind="getAttr(item.path)"
      >{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'MyBreadcrumb',
  props: {
    navs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    getAttr(path) {
      if (path) {
        return {
          to: {
            path
          }
        }
      }
      return {}
    }
  }
}
</script>

<style lang="less" scope>
</style>