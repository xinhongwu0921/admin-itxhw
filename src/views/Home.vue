<template>
  <div class="home">
  <el-container>
    <el-header>

      <!--头部-->
        <img src="../assets/logo.png">
        <div class="system-title">电商后台管理系统</div>
        <div>
          <span>你好，欢迎使用</span>
          <el-button type="text" @click="logout">退出</el-button>
        </div>

    </el-header>
    <el-container>
      <!--左侧导航-->
      <el-aside width="200px">

        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          </el-submenu>
        </el-menu>

        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!--中间内容部分-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
    export default {
        name: "home",
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        logout(){
          //清除token
          localStorage.removeItem("mytoken")
          //返回到登录页面
          this.$router.push({name:'/login'})
        }
      }
    }
</script>

<style lang="scss" scoped>
  .home {
    height: 100%;
    background-color: #E5E5E5;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #009688;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: white;
  }
  .toggle-btn {
    padding: 0 10px;
    margin-left: -20px;
    font-size: 36px;
    line-height: 60px;
    color: white;
    cursor: pointer;
  &:hover {
     background-color: #00635a;
   }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome{
    color: white;
  }
  }
</style>
