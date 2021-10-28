<template>
  <div>
  </div>
</template>

<script>
export default {
  created () {
    this.login()
  },
  methods: {
    // 在这里写获取用户名的方法，然后共享出去，在其他地方可以获得即可
    async login () {
      const { data: res } = await this.$http.get('/login/login')
      if (res.code !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      window.sessionStorage.setItem('token', res.data)
      await this.getUserInfo()
    },
    // 通过loginID获取 userCode 和 userName
    async getUserInfo () {
      const { data: res } = await this.$http.get('/user/getUserInfo', {
        params: {
          LoginId: window.sessionStorage.getItem('token')
        }
      })
      window.sessionStorage.setItem('userCode', res.data.userCode)
      window.sessionStorage.setItem('userName', res.data.userName)
      if (res.code !== 200) {
        return this.$message.error('获取用户信息失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
