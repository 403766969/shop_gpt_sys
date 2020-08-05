<template>
  <div id="add">
    <!-- 面包屑导航 -->
    <my-breadcrumb :navs="navs" />
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex-0" :space="200" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- 添加商品表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <!-- tab栏 -->
        <el-tabs v-model="activeIndex" :before-leave="beforeLeave" tab-position="left">
          <!-- 基本信息面板 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value:'cat_id',
                  children:'children'
                }"
                clearable
                @change="categoriesChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数面板 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals_selected">
                <el-checkbox v-for="(val,index) in item.attr_vals" :key="index" :label="val" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性面板 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals_selected">
                <el-checkbox v-for="(val,index) in item.attr_vals" :key="index" :label="val" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片面板 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容面板 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="isShowPreviewDialog" width="50%">
      <img :src="previewUrl" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from 'components/common/mybreadcrumb/MyBreadcrumb'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import { getCateListApi, getParamListApi, addGoodApi } from 'network/api'

import { BASE_URL } from 'commonjs/const'

export default {
  name: 'add',
  components: {
    MyBreadcrumb,
    quillEditor
  },
  data() {
    return {
      // 面包屑导航
      navs: [
        { name: '首页', path: '/home' },
        { name: '商品管理' },
        { name: '商品列表', path: '/goods' },
        { name: '添加商品' }
      ],
      // 激活的tab
      activeIndex: '0',
      // 商品分类列表
      cateList: [],
      // 动态参数列表
      manyList: [],
      // 静态属性列表
      onlyList: [],
      // 添加商品表单
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: ''
      },
      // 表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
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
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', message: '商品数量必须为数字', trigger: 'blur' },
          { type: 'number', min: 0, message: '商品数量必须大于等于0', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
      },
      // 请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片上传url
      uploadUrl: BASE_URL + 'upload',
      // 图片预览url
      previewUrl: '',
      // 是否显示图片预览对话框
      isShowPreviewDialog: false
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const payload = {
        type: 3
      }
      const { data: res } = await getCateListApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.cateList = res.data
    },
    // 获取分类参数列表
    async getParamList(sel) {
      const payload = {
        cat_id: this.addForm.goods_cat[2],
        sel: sel
      }
      const { data: res } = await getParamListApi(payload)
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      for (let item of res.data) {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.attr_vals_selected = [...item.attr_vals]
      }
      if (sel === 'many') {
        this.manyList = res.data
      } else if (sel === 'only') {
        this.onlyList = res.data
      }
    },
    // tab栏切换时
    beforeLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.show('请选择商品分类！', 'error')
        return false
      }
      return true
    },
    // 商品分类选择器改变时
    categoriesChange() {
      const length = this.addForm.goods_cat.length
      if (length === 0) {
        return
      }
      if (length !== 3) {
        this.addForm.goods_cat = []
        this.$message.show('只允许选择第三级商品分类！', 'error')
      } else {
        this.getParamList('many')
        this.getParamList('only')
      }
    },
    // 图片预览
    handlePreview(file) {
      this.previewUrl = file.response.data.url
      this.isShowPreviewDialog = true
    },
    // 图片移除
    handleRemove(file) {
      const pic = file.response.data.tmp_path
      this.addForm.pics = this.addForm.pics.filter(item => item.pic !== pic)
    },
    // 图片上传成功
    handleSuccess(res) {
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      const pic = {
        pic: res.data.tmp_path
      }
      this.addForm.pics.push(pic)
    },
    // 添加商品
    addGood() {
      this.$refs.addFormRef.validate(async (isValid, object) => {
        if (!isValid) {
          return this.$message.show('请检查填写的商品信息！', 'error')
        }
        let payload_attrs = []
        for (let item of this.manyList) {
          if (item.attr_vals_selected.length > 0) {
            let attr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals_selected.join(' ')
            }
            payload_attrs.push(attr)
          }
        }
        for (let item of this.onlyList) {
          if (item.attr_vals_selected.length > 0) {
            let attr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals_selected.join(' ')
            }
            payload_attrs.push(attr)
          }
        }
        let payload_pics = []
        for (let item of this.addForm.pics) {
          let pic = {
            pic: '/' + item.pic
          }
          payload_pics.push(pic)
        }
        const payload = {
          goods_name: this.addForm.goods_name,
          goods_price: this.addForm.goods_price,
          goods_weight: this.addForm.goods_weight,
          goods_number: this.addForm.goods_number,
          goods_introduce: this.addForm.goods_introduce,
          goods_cat: this.addForm.goods_cat.join(','),
          attrs: payload_attrs,
          pics: payload_pics
        }
        const { data: res } = await addGoodApi(payload)
        if (res.meta.status !== 201) {
          return this.$message.show(res.meta.msg, 'error')
        }
        this.$message.show(res.meta.msg, 'success')
        this.$router.replace('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scope>
.el-cascader {
  min-width: 250px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.quill-editor {
  margin-bottom: 10px;
}

.ql-editor {
  min-height: 350px;
}
</style>