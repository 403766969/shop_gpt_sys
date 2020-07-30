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
    list: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    isShowIndex: {
      type: Boolean,
      default: true
    },
    isShowOperation: {
      type: Boolean,
      default: true
    },
    isShowEdit: {
      type: Boolean,
      default: true
    },
    isShowDelete: {
      type: Boolean,
      default: true
    },
    isShowSetting: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    editClick(row) {
      this.$emit('editClick', row)
    },
    deleteClick(row) {
      this.$emit('deleteClick', row)
    },
    settingClick(row) {
      this.$emit('settingClick', row)
    }
  }
}
</script>

<style lang="less" scope>
</style>