<template>
  <div id="users">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名"
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
          <el-button type="primary" @click="isShowAddDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <my-table
        :list="userList"
        :columns="columns"
        @editClick="showEditDialog"
        @deleteClick="showDeleteMsg"
        @settingClick="showSettingDialog"
      >
        <template #mg_state="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
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
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isShowAddDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="70px">
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
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="isShowEditDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="70px">
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
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="isShowSettingDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="settingDialogClosed"
    >
      <div class="setting-div">
        <p>当前的用户: {{setRole_userInfo.username}}</p>
        <p>当前的角色: {{setRole_userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="roleSelected" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <el-button @click="isShowSettingDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'
import MyPagination from 'components/common/mypagination/MyPagination'
import MyTable from 'components/common/mytable/MyTable'

import { getUserListApi, getUserApi, addUserApi, editUserApi, deleteUserApi, changeUserStateApi, getRoleListApi, setUserRoleApi } from 'network/api'

export default {
  name: 'Users',
  components: {
    MyBreadcrumb,
    MyPagination,
    MyTable
  },
  data() {
    // 手机格式验证
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
      // 面包屑导航
      navs: [
        { name: '首页', path: '/home' },
        { name: '用户管理' },
        { name: '用户列表' }
      ],
      // 用户列表
      userList: [],
      // 表格显示的列
      columns: [
        { name: 'username', label: '用户名' },
        { name: 'email', label: '邮箱' },
        { name: 'mobile', label: '电话' },
        { name: 'role_name', label: '角色' },
        { name: 'mg_state', label: '状态' }
      ],
      // 查询用户参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总用户数
      total: 0,
      // 是否显示添加用户对话框
      isShowAddDialog: false,
      // 是否显示编辑用户对话框
      isShowEditDialog: false,
      // 是否显示分配角色对话框
      isShowSettingDialog: false,
      // 添加用户表单
      addForm: {
        usernmae: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户表单
      editForm: {},
      // 表单验证规则
      formRules: {
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
      // 需要设置角色的用户
      setRole_userInfo: {},
      // 角色列表
      roleList: [],
      // 选择的角色
      roleSelected: ''
    }
  },
  methods: {
    // 设置当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 设置每页显示数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 获取用户列表
    async getUserList() {
      const { data: res } = await getUserListApi(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await getRoleListApi()
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.roleList = res.data
    },
    // 搜索用户
    queryClick() {
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 关闭添加用户对话框时
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await addUserApi(this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowAddDialog = false
          this.getUserList()
        }
      })
    },
    // 显示编辑用户对话框
    async showEditDialog(row) {
      this.isShowEditDialog = true
      const { data: res } = await getUserApi({ id: row.id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.editForm = res.data
    },
    // 关闭编辑用户对话框时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await editUserApi(this.editForm)
          if (res.meta.status !== 200) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowEditDialog = false
          this.getUserList()
        }
      })
    },
    // 显示删除用户提示框
    async showDeleteMsg(row) {
      try {
        const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteUser(row.id)
      } catch (error) {
        this.$message.show('已取消删除', 'info')
      }
    },
    // 删除用户
    async deleteUser(id) {
      const { data: res } = await deleteUserApi({ id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      this.getUserList()
    },
    // 显示分配角色对话框
    async showSettingDialog(row) {
      this.isShowSettingDialog = true
      this.setRole_userInfo = row
      this.getRoleList()
    },
    // 分配角色对话框关闭时
    settingDialogClosed() {
      this.setRole_userInfo = {}
      this.roleSelected = ''
    },
    // 分配角色
    async setRole() {
      if (!this.roleSelected) {
        return this.$message.show('请选择要分配的角色', 'error')
      }
      const payload = {
        userId: this.setRole_userInfo.id,
        roleId: this.roleSelected
      }
      const { data: res } = await setUserRoleApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      this.isShowSettingDialog = false
      this.getUserList()
    },
    // 设置用户状态
    async changeUserState(row) {
      const payload = {
        id: row.id,
        state: row.mg_state
      }
      const { data: res } = await changeUserStateApi(payload)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
    }
  },
  created() {
    this.getUserList()
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.setting-div {
  p {
    line-height: 30px;
  }
}
</style>