<template>
  <div id="rights">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 权限列表区 -->
      <my-table :list="rightList" :columns="columns" :is-show-operation="false">
        <template #level="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
        </template>
      </my-table>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'
import MyPagination from 'components/common/mypagination/MyPagination'
import MyTable from 'components/common/mytable/MyTable'

import { getRightListApi } from 'network/api'

export default {
  name: 'Rights',
  components: {
    MyBreadcrumb,
    MyPagination,
    MyTable
  },
  data() {
    return {
      // 面包屑导航
      navs: [
        { name: '首页', path: '/home' },
        { name: '权限管理' },
        { name: '权限列表' }
      ],
      // 权限列表
      rightList: [],
      // 表格显示的列
      columns: [
        { name: 'authName', label: '权限名称' },
        { name: 'path', label: '路径' },
        { name: 'level', label: '权限等级' },
      ],
    }
  },
  methods: {
    // 获取权限列表
    async getRightList() {
      const { data: res } = await getRightListApi({ type: 'list' })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.rightList = res.data
    },
  },
  created() {
    this.getRightList()
  }
}
</script>

<style lang="less" scoped>
</style>