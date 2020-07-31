<template>
  <div class="my-breadcrumb">
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
    // 显示的导航
    navs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    // 返回动态绑定的属性
    getAttr(path) {
      if (path) {
        return {
          to: path
        }
      }
      return {}
    }
  }
}
</script>

<style lang="less" scope>
.my-breadcrumb {
  margin-bottom: 15px;
  font-size: 15px;
}
</style>