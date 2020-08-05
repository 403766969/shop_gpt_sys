<template>
  <div id="orders">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入订单编号"
            v-model="queryInfo.query"
            @keyup.enter.native="queryClick"
            @clear="queryClick"
            clearable
          >
            <template #append>
              <el-button icon="el-icon-search" @click="queryClick"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区 -->
      <my-table
        :list="orderList"
        :columns="columns"
        :isShowDelete="false"
        :isShowSetting="false"
        @editClick="isShowEditDialog = true"
      >
        <template #pay_status="scope">
          <el-tag v-if="scope.row.pay_status==='1'">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
        <template #is_send="scope">
          <i v-if="scope.row.is_send==='是'" class="el-icon-circle-check"></i>
          <i v-else class="el-icon-circle-close"></i>
        </template>
        <template #create_time="scope">{{getDate(scope.row.create_time)}}</template>
        <template #operation="scope">
          <el-button
            type="success"
            icon="el-icon-location-information"
            size="mini"
            @click="showLogisticsDialog(scope.row)"
          ></el-button>
        </template>
      </my-table>
      <my-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :total="total"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </el-card>
    <!-- 编辑订单对话框 -->
    <el-dialog
      title="编辑订单"
      :visible.sync="isShowEditDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="area">
          <el-cascader
            v-model="editForm.area"
            :options="areaList"
            :props="{ expandTrigger: 'hover', emitPath: false}"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model.number="editForm.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowEditDialog = false">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="isShowLogisticsDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logisticsList"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'
import MyPagination from 'components/common/mypagination/MyPagination'
import MyTable from 'components/common/mytable/MyTable'

import { getOrderListApi, getLogisticsApi } from 'network/api'

import { dateFormat } from 'commonjs/util'

import { regionData } from 'element-china-area-data'

export default {
  name: 'Orders',
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
        { name: '订单管理' },
        { name: '订单列表' }
      ],
      // 查询订单参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总订单数
      total: 0,
      // 订单列表
      orderList: [],
      // 表格显示的列
      columns: [
        { name: 'order_number', label: '订单编号', minWidth: '300px' },
        { name: 'order_price', label: '订单价格' },
        { name: 'pay_status', label: '是否付款' },
        { name: 'is_send', label: '是否发货' },
        { name: 'create_time', label: '下单时间', minWidth: '160px' }
      ],
      // 地区列表
      areaList: regionData,
      // 物流信息
      logisticsList: [],
      // 是否显示编辑订单对话框
      isShowEditDialog: false,
      // 是否显示物流信息对话框
      isShowLogisticsDialog: false,
      // 编辑订单表单
      editForm: {
        area: '',
        address: ''
      },
      // 表单验证规则
      formRules: {
        area: [
          { required: true, message: '请选择省市区/县', trigger: 'change' },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    // 格式化日期
    getDate(originDate) {
      return dateFormat(originDate)
    },
    // 设置当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 设置每页显示数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await getOrderListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 搜索订单
    queryClick() {
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    // 关闭编辑订单对话框时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 显示物流信息对话框
    async showLogisticsDialog(row) {
      this.isShowLogisticsDialog = true
      const { data: res } = await getLogisticsApi()
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.logisticsList = res.data
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scope>
.el-icon-circle-check {
  color: rgb(32, 178, 170);
}
.el-icon-circle-close {
  color: rgb(255, 0, 0);
}
.el-cascader {
  width: 100%;
}
.el-cascader-panel {
  max-height: 200px;
}
</style>