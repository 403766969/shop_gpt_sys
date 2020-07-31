<template>
  <div id="roles">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="isShowAddDialog = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <my-table
        :list="roleList"
        :columns="columns"
        :is-show-expand="true"
        @editClick="showEditDialog"
        @deleteClick="showDeleteMsg"
        @settingClick="showSettingDialog"
      >
        <template #expand="scope">
          <el-row
            class="level-1 flex-center"
            v-for="level_1 in scope.row.children"
            :key="level_1.id"
          >
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag
                closable
                @close="showDeleteRoleRightMsg(scope.row, level_1.id)"
              >{{level_1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row
                class="level-2 flex-center"
                v-for="level_2 in level_1.children"
                :key="level_2.id"
              >
                <!-- 二级权限 -->
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="showDeleteRoleRightMsg(scope.row, level_2.id)"
                  >{{level_2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    class="level-3"
                    v-for="level_3 in level_2.children"
                    :key="level_3.id"
                    type="warning"
                    closable
                    @close="showDeleteRoleRightMsg(scope.row, level_3.id)"
                  >{{level_3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </my-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isShowAddDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="isShowEditDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="isShowSettingDialog"
      :close-on-click-modal="false"
      width="50%"
      @close="settingDialogClosed"
    >
      <el-tree
        ref="rightsTreeRef"
        :data="rightList"
        :props="treeProps"
        :default-checked-keys="defaultKeys"
        node-key="id"
        show-checkbox
        default-expand-all
      ></el-tree>
      <template #footer>
        <el-button @click="isShowSettingDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'
import MyPagination from 'components/common/mypagination/MyPagination'
import MyTable from 'components/common/mytable/MyTable'

import { getRoleListApi, getRoleApi, addRoleApi, editRoleApi, deleteRoleApi, deleteRoleRightApi, getRightListApi, setRoleRightApi } from 'network/api'

export default {
  name: 'Roles',
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
        { name: '角色列表' }
      ],
      // 角色列表
      roleList: [],
      // 表格显示的列
      columns: [
        { name: 'roleName', label: '角色名称' },
        { name: 'roleDesc', label: '角色描述' }
      ],
      // 是否显示添加角色对话框
      isShowAddDialog: false,
      // 是否显示编辑角色对话框
      isShowEditDialog: false,
      // 是否显示分配权限对话框
      isShowSettingDialog: false,
      // 添加角色表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色表单
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单验证规则
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      },
      // 权限列表
      rightList: [],
      // 权限树配置
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 权限树默认勾选
      defaultKeys: [],
      // 分配权限的角色id
      setRight_roleId: ''
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await getRoleListApi()
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.roleList = res.data
    },
    // 关闭添加角色对话框时
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await addRoleApi(this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowAddDialog = false
          this.getRoleList()
        }
      })
    },
    // 显示编辑角色对话框
    async showEditDialog(row) {
      this.isShowEditDialog = true
      const { data: res } = await getRoleApi({ id: row.id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.editForm = res.data
      this.editForm.id = this.editForm.roleId
    },
    // 关闭编辑角色对话框时
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑角色
    editRole() {
      this.$refs.editFormRef.validate(async isValid => {
        if (isValid) {
          const { data: res } = await editRoleApi(this.editForm)
          if (res.meta.status !== 200) {
            return this.$message.show(res.meta.msg, 'error')
          }
          this.$message.show(res.meta.msg, 'success')
          this.isShowEditDialog = false
          this.getRoleList()
        }
      })
    },
    // 显示删除角色提示框
    async showDeleteMsg(row) {
      try {
        const res = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteRole(row.id)
      } catch (error) {
        this.$message.show('已取消删除', 'info')
      }
    },
    // 删除角色
    async deleteRole(id) {
      const { data: res } = await deleteRoleApi({ id })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      this.getRoleList()
    },
    // 显示分配权限对话框
    async showSettingDialog(row) {
      this.isShowSettingDialog = true
      const { data: res } = await getRightListApi({ type: 'tree' })
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.rightList = res.data
      this.getLeafKeys(row, this.defaultKeys)
      this.setRight_roleId = row.id
    },
    // 分配权限对话框关闭时
    settingDialogClosed() {
      this.rightList = []
      this.defaultKeys = []
    },
    // 分配权限
    async setRight() {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      const payload = {
        roleId: this.setRight_roleId,
        idsStr: keys.join(',')
      }
      const { data: res } = await setRoleRightApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      this.isShowSettingDialog = false
      this.getRoleList()
    },
    // 显示删除角色权限提示框
    async showDeleteRoleRightMsg(row, rightId) {
      try {
        const res = await this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteRoleRight(row, rightId)
      } catch (error) {
        this.$message.show('已取消删除', 'info')
      }
    },
    // 删除角色指定权限
    async deleteRoleRight(row, rightId) {
      const payload = {
        roleId: row.id,
        rightId: rightId
      }
      const { data: res } = await deleteRoleRightApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.$message.show(res.meta.msg, 'success')
      row.children = res.data
    },
    // 递归获取三级权限的id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      for (let item of node.children) {
        this.getLeafKeys(item, arr)
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.level-1 {
  border-bottom: 1px solid #eee;
}

.level-1:last-of-type {
  border-bottom: none;
}

.level-2 {
  border-bottom: 1px solid #eee;
}

.level-2:last-of-type {
  border-bottom: none;
}

.level-3 {
  margin: 10px 5px;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>