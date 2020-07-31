<template>
  <div class="my-table">
    <el-table :data="list" border stripe>
      <el-table-column v-if="isShowIndex" type="index"></el-table-column>
      <el-table-column
        v-for="item in columns"
        :key="item.name"
        :prop="item.name"
        :label="item.label"
      >
        <template v-slot="scope">
          <slot :name="item.name" :row="scope.row">{{scope.row[item.name]}}</slot>
        </template>
      </el-table-column>
      <el-table-column v-if="isShowOperation" label="操作" width="200px">
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
    // 是否显示操作列
    isShowOperation: {
      type: Boolean,
      default: true
    },
    // 是否显示修改按钮
    isShowEdit: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    isShowDelete: {
      type: Boolean,
      default: true
    },
    // 是否显示分配按钮
    isShowSetting: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 点击修改按钮
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
    display: table-cell;
  }
}
</style>