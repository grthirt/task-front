<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/task-management">下发的任务</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索新建按钮区域区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入任务名称" class="input-with-select" v-model="queryInfo.taskName" clearable
                    @clear="listTaskManagement">
            <el-button slot="append" icon="el-icon-search" @click="listTaskManagement"></el-button>
          </el-input>
        </el-col>
        <el-col :span.camel="4">
          <el-button type="primary" @click="dialogVisibleChange">新建任务</el-button>
        </el-col>
      </el-row>
      <SaveNewTask></SaveNewTask>
      <!-- 数据展示区域 -->
      <el-table border stripe :data="taskManagementList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务标题" prop="taskName"></el-table-column>
        <el-table-column label="发起时间" prop="startTime"></el-table-column>
        <el-table-column label="发起人" prop="publisherName"></el-table-column>
        <el-table-column label="牵头部门" prop="leaderDepartmentName"></el-table-column>
        <el-table-column label="牵头人" prop="leaderUserName"></el-table-column>
        <el-table-column label="截至时间" prop="endTime"></el-table-column>
        <el-table-column label="任务进度" prop="taskProgress"></el-table-column>
        <el-table-column label="任务状态" prop="taskStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 1" style="color: #409EFF"> 进行中 </span>
            <span v-if="scope.row.taskStatus === 2" style="color: #67C23A"> 已完成 </span>
            <span v-if="scope.row.taskStatus === 3" style="color: #F56C6C"> 已超时 </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 12, 15, 20]"
        :page-size=queryInfo.pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import SaveNewTask from '@/components/container/SaveNewTask'
import eventBus from '@/components/eventBus'

export default {
  name: 'TaskManagement',
  data () {
    return {
      dialogVisibleStatus: true,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        taskName: '',
        reporterId: '',
        publisherId: window.sessionStorage.getItem('userCode'),
        isReport: '0'
      },
      queryInfoUserName: {
        userName: ''
      },
      leaderUserOptions: [],
      taskManagementList: [],
      leaderDepartmentOptions: [],
      total: 0
    }
  },
  created () {
    this.getAllUserInfo()
    this.listDepartments()
    this.listTaskManagement()
    // 接收子组件传递过来的的查询列表的值
    eventBus.$on('sendTaskManagementList', (val) => {
      this.taskManagementList = val
    })
    eventBus.$on('leaderUserOptions', (val) => {
      this.leaderUserOptions = val
    })
    eventBus.$on('leaderDepartmentOptions', (val) => {
      this.leaderDepartmentOptions = val
    })
  },
  methods: {
    // 获取部门列表
    async listDepartments () {
      const { data: res } = await this.$http.get('/department/listDepartments')
      if (res.code !== 200) {
        return this.$message.error('获取部门列表列表失败')
      }
      this.leaderDepartmentOptions = res.data
    },
    // 获取用户信息
    async getAllUserInfo () {
      const { data: res } = await this.$http.get('/user/getAllUserInfo', {
        params: this.queryInfoUserName
      })
      if (res.code !== 200) {
        return this.$message.error('获取人员列表失败')
      }
      this.leaderUserOptions = res.data
    },
    // 获取下发的任务
    async listTaskManagement () {
      const { data: res } = await this.$http.get('/task/listTaskManagement', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取任务管理列表失败')
      }
      this.taskManagementList = res.data.taskManagementList
      this.total = res.data.total
    },
    handleSizeChange (newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.listTaskManagement()
    },
    handleCurrentChange (newPageSize) {
      this.queryInfo.pageNum = newPageSize
      this.listTaskManagement()
    },
    dialogVisibleChange () {
      eventBus.$emit('sendDialogVisibleStatus', this.dialogVisibleStatus)
      eventBus.$emit('leaderUserOptions', this.leaderUserOptions)
      eventBus.$emit('leaderDepartmentOptions', this.leaderDepartmentOptions)
    }
  },
  components: {
    SaveNewTask
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  font-size: 12px;
}
</style>
