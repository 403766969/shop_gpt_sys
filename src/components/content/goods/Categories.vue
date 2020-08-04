<template>
  <div id="categories">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加商品分类按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加商品分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类列表区 -->
      <my-table
        :list="cateList"
        :columns="columns"
        :isShowSetting="false"
        :stripe="false"
        row-key="cat_id"
        @editClick="showEditDialog"
        @deleteClick="showDeleteMsg"
      >
        <template #cat_deleted="scope">
          <i v-if="scope.row.cat_deleted" class="el-icon-circle-check"></i>
          <i v-else class="el-icon-circle-close"></i>
        </template>
        <template #cat_level="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
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
    <!-- 添加商品分类对话框 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="isShowAddDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedCates"
            placeholder="请选择父级分类"
            :options="father_cateList"
            :props="{ 
              expandTrigger: 'hover', 
              label: 'cat_name', 
              value: 'cat_id', 
              checkStrictly: true
            }"
            @change="catesCascaderChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 编辑商品分类对话框 -->
    <el-dialog
      title="编辑商品分类"
      :visible.sync="isShowEditDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'
import MyPagination from 'components/common/mypagination/MyPagination'
import MyTable from 'components/common/mytable/MyTable'

import { getCateListApi, getCategory, addCategoryApi, editCategoryApi, deleteCategoryApi } from 'network/api'

export default {
  name: 'Categories',
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
        { name: '商品分类' }
      ],
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 表格显示的列
      columns: [
        { name: 'cat_name', label: '分类名称' },
        { name: 'cat_deleted', label: '是否有效' },
        { name: 'cat_level', label: '分类等级' }
      ],
      // 商品分类列表
      cateList: [],
      // 商品分类总数
      total: 0,
      // 是否显示添加商品分类对话框
      isShowAddDialog: false,
      // 是否显示编辑商品分类对话框
      isShowEditDialog: false,
      // 父级商品分类
      father_cateList: [],
      // 选中的父级商品分类
      selectedCates: [],
      // 添加商品分类表单
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      // 编辑商品分类表单
      editForm: {
        cat_name: '',
        cat_id: 0
      },
      // 表单验证规则
      formRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    // 设置当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList(this.queryInfo)
    },
    // 设置每页显示数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList(this.queryInfo)
    },
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await getCateListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 获取父级商品分类列表
    async getFatherCateList() {
      const { data: res } = await getCateListApi({ type: 2 })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.father_cateList = res.data
    },
    // 父级商品分类选择器发生改变
    catesCascaderChange() {
      if (this.selectedCates.length > 0) {
        this.addForm.cat_pid = this.selectedCates[this.selectedCates.length - 1]
      } else {
        this.addForm.cat_pid = 0
      }
      this.addForm.cat_level = this.selectedCates.length
    },
    // 显示添加商品分类对话框
    showAddDialog() {
      this.isShowAddDialog = true
      this.getFatherCateList()
    },
    // 添加商品分类对话框关闭时
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.selectedCates = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 添加商品分类
    addCategory() {
      this.$refs.addFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await addCategoryApi(this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowAddDialog = false
          this.getCateList()
        }
      })
    },
    // 显示编辑商品分类对话框
    async showEditDialog(row) {
      this.isShowEditDialog = true
      const { data: res } = await getCategory({ cat_id: row.cat_id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.editForm = res.data
    },
    // 关闭编辑商品分类对话框时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑商品分类
    editCategory() {
      this.$refs.editFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await editCategoryApi(this.editForm)
          if (res.meta.status !== 200) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowEditDialog = false
          this.getCateList()
        }
      })
    },
    // 显示删除商品分类提示框
    async showDeleteMsg(row) {
      try {
        const res = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteCategory(row)
      } catch (error) {
        this.$message.show('已取消删除', 'info')
      }
    },
    // 删除商品分类
    async deleteCategory(row) {
      const { data: res } = await deleteCategoryApi({ cat_id: row.cat_id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      this.getCateList()
    },
  },
  created() {
    this.getCateList()
    this.getFatherCateList()
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