// 和任务相关的API

export const listTaskManagementAPI = function (queryInfo) {
  return this.$http.get('/task/listTaskManagement', {
    params: queryInfo
  })
}
