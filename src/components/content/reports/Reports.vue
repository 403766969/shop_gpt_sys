<template>
  <div id="reports">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 数据报表 -->
      <div ref="reportsEcharts" class="reports-echarts"></div>
    </el-card>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'

import { getReportsDataApi } from 'network/api'

import echarts from 'echarts'

export default {
  name: 'Reports',
  components: {
    MyBreadcrumb
  },
  data() {
    return {
      // 面包屑导航
      navs: [
        { name: '首页', path: '/home' },
        { name: '数据统计' },
        { name: '数据报表' }
      ]
    }
  },
  async mounted() {
    const { data: res } = await getReportsDataApi()
    if (res.meta.status !== 200) {
      return this.$message.show(res.meta.msg, 'error')
    }
    let option = res.data
    option.title = {
      text: '用户来源'
    }
    option.tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3'
        }
      }
    }
    option.grid = {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
    option.xAxis = {
      data: option.xAxis[0].data,
      boundaryGap: false
    }
    option.yAxis = {
      type: option.yAxis[0].type
    }
    let myChart = echarts.init(this.$refs.reportsEcharts)
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scope>
.reports-echarts {
  width: 720px;
  height: 480px;
}
</style>