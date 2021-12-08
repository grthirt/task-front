<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/my-report-task">我上报的任务</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索任务上报按钮区域区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入任务名称" class="input-with-select" v-model="queryInfo.taskName" clearable
                    @clear="listTaskManagement">
            <el-button slot="append" icon="el-icon-search" @click="listTaskManagement"></el-button>
          </el-input>
        </el-col>
        <el-col :span.camel="4">
          <el-button type="primary" @click="dialogVisibleChange">任务上报</el-button>
        </el-col>
      </el-row>
      <SaveTaskReport></SaveTaskReport>
      <!-- 数据展示区域 -->
      <el-table border stripe :data="taskManagementList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务标题" prop="taskName"></el-table-column>
        <el-table-column label="发起时间" prop="startTime"></el-table-column>
        <el-table-column label="发起人" prop="publisherName"></el-table-column>
        <el-table-column label="牵头部门" prop="leaderDepartmentName"></el-table-column>
        <el-table-column label="牵头人" prop="leaderUserName"></el-table-column>
        <el-table-column label="截至时间" prop="endTime"></el-table-column>
        <el-table-column label="任务进度">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.taskProgress" :color="colors"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" prop="taskStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.leaderUserId === ''" style="color: #e76128"> 未审核 </span>
            <span v-if="scope.row.leaderUserId !== ''" style="color: #67C23A"> 已审核并下发 </span>
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
      colors: [
        {
          color: '#f56c6c',
          percentage: 20
        },
        {
          color: '#e6a23c',
          percentage: 40
        },
        {
          color: '#5cb87a',
          percentage: 60
        },
        {
          color: '#1989fa',
          percentage: 80
        },
        {
          color: '#6f7ad3',
          percentage: 100
        }
      ],
      dialogVisibleStatus: true,
      // 我的任务列表查询条件
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        taskName: '',
        publisherId: '',
        reporterId: window.sessionStorage.getItem('userCode'),
        isReport: ''
      },
      // 人员列表查询条件
      queryInfoUserName: {
        userName: ''
      },
      // 我的任务数据列表
      taskManagementList: [],
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
    this.listTaskManagement()
    // 接收子组件传递过来的的查询列表的值
    eventBus.$on('sendTaskManagementList', (val) => {
      this.taskManagementList = val
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
