<template>
  <div class="my-table">
    <el-table :data="list" :row-key="rowKey" :border="border" :stripe="stripe">
      <el-table-column v-if="isShowExpand" type="expand">
        <template v-slot="scope">
          <slot name="expand" :row="scope.row"></slot>
        </template>
      </el-table-column>
      <el-table-column v-if="isShowIndex" type="index"></el-table-column>
      <el-table-column v-for="item in columns" :key="item.name" :label="item.label" :min-width="item.minWidth">
        <template v-slot="scope">
          <slot :name="item.name" :row="scope.row">{{scope.row[item.name]}}</slot>
        </template>
      </el-table-column>
      <el-table-column v-if="isShowOperation" label="操作" min-width="200px">
        <template v-slot="scope">
          <el-button
            v-if="isShowEdit"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editClick(scope.row)"
          ></el-button>
          <el-button
            v-if="isShowDelete"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteClick(scope.row)"
          ></el-button>
          <el-button
            v-if="isShowSetting"
            type="warning"
            icon="el-icon-setting"
            size="mini"
            @click="settingClick(scope.row)"
          ></el-button>
          <slot name="operation" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MyTable',
  props: {
    // 数据列表
    list: {
      type: Array,
      default() {
        return []
      }
    },
    // 需要显示的列
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否显示索引列
    isShowIndex: {
      type: Boolean,
      default: true
    },
    // 是否显示展开列
    isShowExpand: {
      type: Boolean,
      default: false
    },
    // 是否显示操作列
    isShowOperation: {
      type: Boolean,
      default: true
    },
    // 是否显示编辑按钮
    isShowEdit: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    isShowDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示设置按钮
    isShowSetting: {
      type: Boolean,
      default: true
    },
    // 当显示为树形表格时需要设置此项
    rowKey: {
      type: String,
      default: ''
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: true
    },
    // 是否显示斑马线
    stripe: {
      type: Boolean,
      default: true
    },
  },
  methods: {
    // 点击编辑按钮
    editClick(row) {
      this.$emit('editClick', row)
    },
    // 点击删除按钮
    deleteClick(row) {
      this.$emit('deleteClick', row)
    },
    // 点击设置按钮
    settingClick(row) {
      this.$emit('settingClick', row)
    }
  }
}
</script>

<style lang="less" scope>
.my-table {
  margin-top: 15px;
  .el-table th.gutter {
    display: table-cell !important;
  }
}
</style>