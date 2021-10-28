<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/my-task">分配给我的任务</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索任务上报按钮区域区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入任务名称" class="input-with-select" v-model="queryInfo.taskName" clearable
                    @clear="listMyTasks">
            <el-button slot="append" icon="el-icon-search" @click="listMyTasks"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <SaveTaskReport></SaveTaskReport>
      <!-- 数据展示区域 -->
      <el-table border stripe :data="myTaskList">
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
        <el-table-column label="操作">
          <template slot-scope="">
            <div>
              <el-link icon="el-icon-edit" type="primary">任务上报</el-link>
            </div>
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
import eventBus from '../components/eventBus'
import SaveTaskReport from '../components/container/SaveTaskReport'

export default {
  name: 'MyTask',
  data () {
    return {
      dialogVisibleStatus: true,
      // 我的任务列表查询条件
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        taskName: '',
        taskGrade: '',
        reporterId: '',
        taskPersonUserId: window.sessionStorage.getItem('userCode')
      },
      // 人员列表查询条件
      queryInfoUserName: {
        userName: ''
      },
      // 我的任务数据列表
      myTaskList: [],
      // 人员列表 option 数组
      userOptions: [],
      // 部门列表 option 数组
      departmentOptions: [],
      // 数据总数
      total: 0
    }
  },
  created () {
    this.getAllUserInfo()
    this.listDepartments()
    this.listMyTasks()
    // 接收子组件传递过来的的查询列表的值
    eventBus.$on('sendTaskManagementList', (val) => {
      this.myTaskList = val
    })
    eventBus.$on('userOptions', (val) => {
      this.userOptions = val
    })
    eventBus.$on('departmentOptions', (val) => {
      this.departmentOptions = val
    })
  },
  methods: {
    async listDepartments () {
      const { data: res } = await this.$http.get('/department/listDepartments')
      if (res.code !== 200) {
        return this.$message.error('获取部门列表列表失败')
      }
      this.departmentOptions = res.data
    },
    async getAllUserInfo () {
      const { data: res } = await this.$http.get('/user/getAllUserInfo', {
        params: this.queryInfoUserName
      })
      if (res.code !== 200) {
        return this.$message.error('获取人员列表失败')
      }
      this.userOptions = res.data
    },
    // 我的任务列表
    async listMyTasks () {
      const { data: res } = await this.$http.get('/task/listMyTasks', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取我的任务管理列表失败')
      }
      this.myTaskList = res.data.listMyTasksVOList
      this.total = res.data.total
    },
    handleSizeChange (newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.listMyTasks()
    },
    handleCurrentChange (newPageSize) {
      this.queryInfo.pageNum = newPageSize
      this.listMyTasks()
    },
    dialogVisibleChange () {
      eventBus.$emit('sendDialogVisibleStatus', this.dialogVisibleStatus)
      eventBus.$emit('userOptions', this.userOptions)
      eventBus.$emit('departmentOptions', this.departmentOptions)
    }
  },
  components: {
    SaveTaskReport
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  font-size: 12px;
}
</style>
