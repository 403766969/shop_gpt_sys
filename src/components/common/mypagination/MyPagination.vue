<template>
  <div class="my-pagination">
    <el-pagination
      :layout="layout"
      :pager-count="pagerCount"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'MyPagination',
  props: {
    // 需要显示的组件
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 最多显示几页
    pagerCount: {
      type: Number,
      default: 11
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页显示的数据条数
    pageSizes: {
      type: Array,
      default() {
        return [1, 5, 10, 30, 50]
      }
    },
    // 当前每页显示的数据条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 总数据条数
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 修改当前页码
    handleCurrentChange(newPage) {
      this.$emit('handleCurrentChange', newPage)
    },
    // 修改每页显示的数据条数
    handleSizeChange(newSize) {
      this.$emit('handleSizeChange', newSize)
    }
  }
}
</script>

<style lang="less" scope>
.my-pagination {
  margin-top: 15px;
}
</style>