<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt="">
        <span>任务分发反馈系统</span>
      </div>
      <div>
        <span>你好！刘强</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#E0E0E0"
          text-color="#8E8E8E"
          active-text-color="#3C3C3C" router>
          <el-menu-item index="task-management">
            <i class="el-icon-menu"></i>
            <span slot="title">任务管理</span>
          </el-menu-item>
          <el-menu-item index="my-task">
            <i class="el-icon-document"></i>
            <span slot="title">我的任务</span>
          </el-menu-item>
          <el-menu-item index="statistics">
            <i class="el-icon-setting"></i>
            <span slot="title">统计</span>
          </el-menu-item>
          <el-menu-item index="template">
            <i class="el-icon-setting"></i>
            <span slot="title">模板</span>
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
  name: 'Home'
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #7B7B7B;
  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  color: #FFFFFF;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 30px;
  }
}

.el-aside {
  background-color: #E0E0E0;

  .el-menu {
    border: none;
  }
}

.el-main {
  background-color: #F0F0F0;
}
</style>
