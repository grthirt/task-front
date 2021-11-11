<template>
  <el-container>
    <el-header height="110px">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="title">
        <span>任务分发平台</span>
      </div>
      <div class="name">
        <span>你好！{{ userName }}</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          unique-opened
          class="el-menu-demo"
          background-color="#3A3F51"
          text-color="#FFFFFF"
          active-text-color="#409EFF" router>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>任务管理</span>
            </template>
            <el-menu-item index="task-management">
              <i class="el-icon-menu"></i>
              <span slot="title">我下发的任务</span>
            </el-menu-item>
            <el-menu-item index="report-task">
              <i class="el-icon-menu"></i>
              <span slot="title">给我上报的任务</span>
            </el-menu-item>
            <el-menu-item index="timeout-task">
              <i class="el-icon-menu"></i>
              <span slot="title">超时的任务</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>我的任务</span>
            </template>
            <el-menu-item index="my-task">
              <i class="el-icon-menu"></i>
              <span slot="title">分配给我的任务</span>
            </el-menu-item>
            <el-menu-item index="my-report-task">
              <i class="el-icon-menu"></i>
              <span slot="title">我上报的任务</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="statistics">
            <i class="el-icon-setting"></i>
            <span slot="title">统计</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      userName: window.sessionStorage.getItem('userName')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #313439;
  padding-left: 15px;
  color: #FFFFFF;
  font-size: 20px;

  .logo {
    width: 30%;
    height: 110px;
    display: flex;
    align-items: center;
    float: left;
  }

  .title {
    width: 40%;
    height: 110px;
    float: left;
    font-size: 40px;
    text-align: center;
    line-height: 110px;
  }

  .name {
    width: 30%;
    height: 100px;
    float: right;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }

  img {
    width: 255px;
    height: 65px;
  }
}

.el-aside {
  background-color: #3A3F51;

  .el-menu {
    border: none;
  }
}

.el-main {
  background-color: #ffffff;
}
</style>
