<template>
  <div id="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList" clearable>
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isShowAddDialog = true">添加</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="editState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteMsg(scope.row.id)"
            ></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 30, 50]"
        :page-size="queryInfo.pagesize"
        :total="total"
      ></el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="isShowAddDialog" width="50%" @close="closeAddDialog">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="isShowAddDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </template>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户" :visible.sync="isShowEditDialog" width="50%" @close="closeEditDialog">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="isShowEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserListApi, editUserStateApi, addUserApi, getUserApi, editUserApi, deleteUserApi } from 'network/api'

export default {
  name: 'Users',
  data() {
    const checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      const regMobild = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobild.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机'))
    }
    return {
      // 用户列表
      userList: [],
      // 总用户数
      total: 0,
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 添加用户
      addForm: {
        usernmae: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入合法的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 是否显示添加对话框
      isShowAddDialog: false,
      // 修改用户
      editForm: {},
      // 验证规则
      editFormRules: {
        email: [
          { type: 'email', message: '请输入合法的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 是否显示修改对话框
      isShowEditDialog: false
    }
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await getUserListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error({
          duration: 3000,
          showClose: true,
          center: true,
          message: res.meta.msg
        })
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 设置用户状态
    async editState(userInfo) {
      const data = {
        id: userInfo.id,
        state: userInfo.mg_state
      }
      const { data: res } = await editUserStateApi(data)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error({
          duration: 3000,
          showClose: true,
          center: true,
          message: res.meta.msg
        })
      }
      this.$message.success({
        duration: 3000,
        showClose: true,
        center: true,
        message: res.meta.msg
      })
    },
    // 设置每页显示数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList(this.queryInfo)
    },
    // 设置当前页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList(this.queryInfo)
    },
    // 关闭添加用户对话框
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await addUserApi(this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error({
              duration: 3000,
              showClose: true,
              center: true,
              message: res.meta.msg
            })
          }
          this.$message.success({
            duration: 3000,
            showClose: true,
            center: true,
            message: res.meta.msg
          })
          this.isShowAddDialog = false
          this.getUserList()
        }
      })
    },
    // 显示修改用户对话框
    async showEditDialog(id) {
      this.isShowEditDialog = true
      const { data: res } = await getUserApi({ id })
      if (res.meta.status !== 200) {
        return this.$message.error({
          duration: 3000,
          showClose: true,
          center: true,
          message: res.meta.msg
        })
      }
      this.editForm = res.data
    },
    // 关闭修改用户对话框
    closeEditDialog() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户
    editUser() {
      this.$refs.editFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await editUserApi(this.editForm)
          if (res.meta.status !== 200) {
            return this.$message.error({
              duration: 3000,
              showClose: true,
              center: true,
              message: res.meta.msg
            })
          }
          this.$message.success({
            duration: 3000,
            showClose: true,
            center: true,
            message: res.meta.msg
          })
          this.isShowEditDialog = false
          this.getUserList()
        }
      })
    },
    // 显示删除用户提示框
    async showDeleteMsg(id) {
      try {
        const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteUser(id)
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 删除用户
    async deleteUser(id) {
      const { data: res } = await deleteUserApi({ id })
      if (res.meta.status !== 200) {
        return this.$message.error({
          duration: 3000,
          showClose: true,
          center: true,
          message: res.meta.msg
        })
      }
      this.$message.success({
        duration: 3000,
        showClose: true,
        center: true,
        message: res.meta.msg
      })
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>