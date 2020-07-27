<template>
  <div id="login">
    <div class="login_container">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt="头像" />
      </div>
      <!-- 登录表单区 -->
      <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginClick() {
      this.$refs.loginFormRef.validate(async isValid => {
        if (isValid) {
          const res = await this.$http.post('login', this.loginForm)
          if (res.meta.status === 200) {
            this.$message.success({
              duration: 3000,
              showClose: true,
              center: true,
              message: '登录成功！'
            })
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message.error({
              duration: 3000,
              showClose: true,
              center: true,
              message: `登录失败！${res.meta.msg}`
            })
          }
        }
      })
    },
    resetClick() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}

.login_container {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  transform: translate(-50%, -50%);
}

.avatar_box {
  position: absolute;
  left: 50%;
  top: 0;
  padding: 10px;
  width: 130px;
  height: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    background-color: #eee;
    border-radius: 50%;
  }
}

.login-form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>