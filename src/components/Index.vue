<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      loginId: ''
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      this.loginId = this.$route.query.name
      if (this.loginId !== undefined) {
        const Base64 = require('js-base64').Base64
        this.loginId = Base64.decode(this.loginId).split('\n')[0]
        // 拿着name去调用接口获取用户信息
        const { data: res } = await this.$http.get('/user/login', {
          params: {
            loginId: this.loginId
          }
        })
        if (res.code !== 200) {
          return this.$message.error('登录失败')
        }
        window.sessionStorage.setItem('token', 'Authorization: Bearer token')
        window.sessionStorage.setItem('userCode', res.data.id)
        window.sessionStorage.setItem('userName', res.data.name)
        await this.$router.push('/home')
      } else {
        window.location.href = `${process.env.VUE_APP_AUTH_SERVER}?target=${process.env.VUE_APP_LOCAL_SERVER}`
      }
    }
  }
}
</script>

<style>
</style>
