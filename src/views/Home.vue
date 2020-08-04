<template>
  <div id="home">
    <el-container class="home-container">
      <!-- 头部区 -->
      <el-header>
        <div>
          <img src="~assets/logo.png" alt />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logoutClick">退出</el-button>
      </el-header>
      <!-- 主体区 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isFold ? '64px' : '200px'">
          <!-- 折叠按钮 -->
          <div class="fold-button" @click="foldClick">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            router
            :collapse="isFold"
            :collapse-transition="false"
            :default-active="$route.path.replace('/home/','')"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
              <template #title>
                <i :class="menuIcons[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="`/${item.path}`" v-for="item in item.children" :key="item.id">
                <template #title>
                  <i class="el-icon-s-data"></i>
                  <span>{{item.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容区 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuListApi } from 'network/api'

export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      menuIcons: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-operation',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      isFold: false
    }
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await getMenuListApi()
      if (res.meta.status !== 200) {
        return this.$message.show(res.meta.msg, 'error')
      }
      this.menuList = res.data
    },
    // 折叠按钮
    foldClick() {
      this.isFold = !this.isFold
    },
    // 退出按钮
    logoutClick() {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
  },
  created() {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
#home {
  width: 100%;
  height: 100%;
}

.home-container {
  width: 100%;
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  font-size: 20px;
  color: #fff;
  background-color: #373d41;
  div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
    }
    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .fold-button {
    width: 100%;
    font-size: 12px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .fold-button:hover {
    background-color: #4a5064;
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>