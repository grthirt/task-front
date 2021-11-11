<template>
  <el-header>
    <div>
      <img src="../../assets/logo1.png" alt="">
      <span>任务分发反馈系统</span>
    </div>
    <div>
      <span>你好！刘强</span>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #0e76de;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
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
  }
}
</style>
