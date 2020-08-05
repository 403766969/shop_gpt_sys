<template>
  <div id="goods">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入商品名称"
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
        <el-col :span="4">
          <el-button type="primary" @click="routerAddGood">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区 -->
      <my-table
        :list="goodList"
        :columns="columns"
        :isShowSetting="false"
        @editClick="showEditDialog"
        @deleteClick="showDeleteMsg"
      >
        <template #add_time="scope">{{getDate(scope.row.add_time)}}</template>
      </my-table>
      <!-- 分页区 -->
      <my-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :total="total"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </el-card>
    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="isShowEditDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'
import MyPagination from 'components/common/mypagination/MyPagination'
import MyTable from 'components/common/mytable/MyTable'

import { getGoodListApi, getGoodApi, editGoodApi, deleteGoodApi } from 'network/api'

import { dateFormat } from 'commonjs/util'

export default {
  name: 'Goods',
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
        { name: '商品管理' },
        { name: '商品列表' }
      ],
      // 商品列表
      goodList: [],
      // 表格显示的列
      columns: [
        { name: 'goods_name', label: '商品名称', minWidth: '600px' },
        { name: 'goods_price', label: '商品价格' },
        { name: 'goods_weight', label: '商品重量' },
        { name: 'add_time', label: '创建时间', minWidth: '160px' }
      ],
      // 查询商品参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总商品数
      total: 0,
      // 是否显示编辑商品对话框
      isShowEditDialog: false,
      // 添加商品表单
      addForm: {},
      // 编辑商品表单
      editForm: {},
      // 表单验证规则
      formRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', message: '商品价格必须为数字', trigger: 'blur' },
          { type: 'number', min: 0, message: '商品价格必须大于等于0', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { type: 'number', message: '商品重量必须为数字', trigger: 'blur' },
          { type: 'number', min: 0, message: '商品重量必须大于等于0', trigger: 'blur' }
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
      this.getGoodList()
    },
    // 设置每页显示数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    // 获取商品列表
    async getGoodList() {
      const { data: res } = await getGoodListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.goodList = res.data.goods
      this.total = res.data.total
    },
    // 搜索商品
    queryClick() {
      this.queryInfo.pagenum = 1
      this.getGoodList()
    },
    // 路由到添加商品页面
    routerAddGood() {
      this.$router.push('goods/add')
    },
    // 显示编辑商品对话框
    async showEditDialog(row) {
      this.isShowEditDialog = true
      const { data: res } = await getGoodApi({ goods_id: row.goods_id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.editForm = res.data
    },
    // 关闭编辑商品对话框时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑商品
    editGood() {
      this.$refs.editFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await editGoodApi(this.editForm)
          if (res.meta.status !== 200) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowEditDialog = false
          this.getGoodList()
        }
      })
    },
    // 显示删除商品提示框
    async showDeleteMsg(row) {
      try {
        const res = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteGood(row)
      } catch (error) {
        this.$message.show('已取消删除', 'info')
      }
    },
    // 删除商品
    async deleteGood(row) {
      const { data: res } = await deleteGoodApi({ goods_id: row.goods_id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      this.getGoodList()
    },
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style lang="less" scope>
</style>