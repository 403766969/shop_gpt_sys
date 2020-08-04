<template>
  <div id="params">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区 -->
      <el-row>
        <el-col>
          <span>商品分类：</span>
          <el-cascader
            v-model="selectedCates"
            placeholder="请选择商品分类"
            :options="cateList"
            :props="{ 
              expandTrigger: 'hover', 
              label: 'cat_name', 
              value: 'cat_id'
            }"
            @change="catesCascaderChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页切换区 -->
      <el-tabs v-model="activeTabName" @tab-click="handleClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="isShowAddDialog = true"
          >添加参数</el-button>
          <my-table
            :list="manyList"
            :columns="manyColumns"
            :is-show-expand="true"
            :is-show-setting="false"
            @editClick="showEditDialog"
            @deleteClick="showDeleteMsg"
          >
            <template #expand="scope">
              <el-tag
                v-for="(item,index) in scope.row.attr_vals"
                :key="index"
                closable
                @close="showDeleteValMsg(scope.row,index)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                class="button-new-tag"
                v-else
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </my-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="isShowAddDialog = true"
          >添加属性</el-button>
          <my-table
            :list="onlyList"
            :columns="onlyColumns"
            :is-show-expand="true"
            :is-show-setting="false"
            @editClick="showEditDialog"
            @deleteClick="showDeleteMsg"
          >
            <template #expand="scope">
              <el-tag
                v-for="(item,index) in scope.row.attr_vals"
                :key="index"
                closable
                @close="showDeleteValMsg(scope.row,index)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button
                class="button-new-tag"
                v-else
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </my-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加分类参数对话框 -->
    <el-dialog
      :title="activeTabName === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="isShowAddDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="activeTabName === 'many' ? '参数名称' : '属性名称'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 编辑分类参数对话框 -->
    <el-dialog
      :title="activeTabName === 'many' ? '编辑动态参数' : '编辑静态属性'"
      :visible.sync="isShowEditDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="activeTabName === 'many' ? '参数名称' : '属性名称'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'
import MyTable from 'components/common/mytable/MyTable'

import { getCateListApi, getParamListApi, addParamApi, getParamApi, editParamApi, deleteParamApi } from 'network/api'

export default {
  name: 'Params',
  components: {
    MyBreadcrumb,
    MyTable
  },
  data() {
    return {
      // 面包屑导航
      navs: [
        { name: '首页', path: '/home' },
        { name: '商品管理' },
        { name: '分类参数' }
      ],
      // 商品分类列表
      cateList: [],
      // 选中的商品分类
      selectedCates: 0,
      // 激活的标签页
      activeTabName: 'many',
      // 动态参数列表
      manyList: [],
      // 静态属性列表
      onlyList: [],
      // 动态参数表格显示的列
      manyColumns: [
        { name: 'attr_name', label: '参数名称' }
      ],
      // 静态属性表格显示的列
      onlyColumns: [
        { name: 'attr_name', label: '属性名称' }
      ],
      // 是否显示添加分类参数对话框
      isShowAddDialog: false,
      // 是否显示编辑分类参数对话框
      isShowEditDialog: false,
      // 添加分类参数表单
      addForm: {
        attr_name: ''
      },
      // 编辑分类参数表单
      editForm: {
      },
      // 表单验证规则
      formRules: {
        attr_name: [
          { required: true, message: this.activeTabName === 'many' ? '请输入参数名称' : '请输入属性名称', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    isDisabled() {
      return this.selectedCates.length !== 3
    },
    selectedCategory() {
      return this.selectedCates[2]
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await getCateListApi({ type: 3 })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.cateList = res.data
    },
    // 获取商品分类列表
    async getParamList() {
      if (this.selectedCates.length !== 3) {
        this.selectedCates = []
        this.manyList = []
        this.onlyList = []
        return this.$message.show('只允许为第三级分类设置相关参数！', 'error')
      }
      const payload = {
        cat_id: this.selectedCategory,
        sel: this.activeTabName
      }
      const { data: res } = await getParamListApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      for (let item of res.data) {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      }
      if (this.activeTabName === 'many') {
        this.manyList = res.data
      } else if (this.activeTabName === 'only') {
        this.onlyList = res.data
      }
    },
    // 商品分类选择器发生改变
    catesCascaderChange() {
      this.getParamList()
    },
    // 标签页切换
    handleClick() {
      this.getParamList()
    },
    // 添加分类参数对话框关闭时
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加分类参数
    addParam() {
      this.$refs.addFormRef.validate(async isValid => {
        if (isValid) {
          const payload = {
            cat_id: this.selectedCategory,
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeTabName
          }
          const { data: res } = await addParamApi(payload)
          if (res.meta.status !== 201) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowAddDialog = false
          this.getParamList()
        }
      })
    },
    // 显示分类参数对话框
    async showEditDialog(row) {
      this.isShowEditDialog = true
      const payload = {
        cat_id: this.selectedCategory,
        attr_id: row.attr_id,
        attr_sel: this.activeTabName
      }
      const { data: res } = await getParamApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.editForm = res.data
    },
    // 关闭分类参数对话框时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑分类参数
    editParam() {
      this.$refs.editFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await editParamApi(this.editForm)
          if (res.meta.status !== 200) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowEditDialog = false
          this.getParamList()
        }
      })
    },
    // 显示删除分类参数提示框
    async showDeleteMsg(row) {
      try {
        const res = await this.$confirm('此操作将永久删除该分类参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteParam(row)
      } catch (error) {
        this.$message.show('已取消删除', 'info')
      }
    },
    // 删除分类参数
    async deleteParam(row) {
      const paylaod = {
        cat_id: this.selectedCategory,
        attr_id: row.attr_id
      }
      const { data: res } = await deleteParamApi(paylaod)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      this.getParamList()
    },
    // 显示删除val对话框
    async showDeleteValMsg(row, index) {
      try {
        const res = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteVal(row, index)
      } catch (error) {
        this.$message.show('已取消删除', 'info')
      }
    },
    // 删除val
    async deleteVal(row, index) {
      row.attr_vals.splice(index, 1)
      const payload = {
        cat_id: row.cat_id,
        attr_id: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      const { data: res } = await editParamApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
    },
    // 显示val输入框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 提交
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      const payload = {
        cat_id: row.cat_id,
        attr_id: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      const { data: res } = await editParamApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scope>
.el-row {
  margin: 15px 0 10px 0;
}

.el-tag {
  margin-right: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>