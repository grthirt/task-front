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
                    @clear="listTaskManagement" @input="listTaskManagement">
            <el-button slot="append" icon="el-icon-search" @click="listTaskManagement"></el-button>
          </el-input>
        </el-col>
        <el-col :span.camel="4">
          <el-button type="primary" @click="dialogVisibleChange">新建任务</el-button>
          <el-button type="primary">任务委托</el-button>
        </el-col>
      </el-row>
      <SaveNewTask></SaveNewTask>
      <!-- 数据展示区域 -->
      <el-table border stripe :data="taskManagementList" @row-click="showTaskManagementDetail">
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
            <span v-if="scope.row.taskProgress !== '100%'" style="color: #409EFF"> 进行中 </span>
            <span v-if="scope.row.taskProgress === '100%'" style="color: #67C23A"> 已完成 </span>
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
      <!-- 数据详情展示区域 -->
      <el-dialog
        :visible.sync="taskManagementDetailVisible"
        width="80%">
        <el-form :model="taskManagementDetail" ref="saveTaskReportFormDataRef" label-width="90px" size="medium">
          <!-- 卡片标题 -->
          <div class="title-box">
            <div class="title">
              基础信息
            </div>
          </div>
          <!-- 卡片区域 -->
          <el-card class="box-card">
            <el-row>
              <el-col :span="12">
                <el-form-item label="任务名称" prop="taskName">
                  <el-input readonly v-model="taskManagementDetail.taskName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工时" prop="workingHours">
                  <el-input style="width: 217px" readonly v-model="taskManagementDetail.workingHours"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="牵头部门" prop="leaderDepartmentName">
                  <input type="hidden" v-model="taskManagementDetail.leaderDepartmentName">
                  <el-select disabled v-model="taskManagementDetail.leaderDepartmentId"
                             placeholder="请选择">
                    <el-option
                      v-for="(items,index) in leaderDepartmentOptions"
                      :key="index"
                      :label="items.departmentName"
                      :value="items.departmentCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="牵头人" prop="leaderUserName">
                  <input type="hidden" v-model="taskManagementDetail.leaderUserName">
                  <el-select disabled v-model="taskManagementDetail.leaderUserId" filterable
                             placeholder="请选择">
                    <el-option
                      v-for="(item,index) in leaderUserOptions"
                      :key="index"
                      :label="item.userName +'【'+ item.departmentName + '】'"
                      :value="item.userCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="任务等级" prop="taskGrade">
                  <el-select disabled v-model="taskManagementDetail.taskGrade" placeholder="请选择任务等级">
                    <el-option
                      v-for="item in taskGradeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务类型" prop="taskType">
                  <el-select disabled v-model="taskManagementDetail.taskType" placeholder="请选择任务等级">
                    <el-option
                      v-for="item in taskTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始日期" prop="startTime">
                  <el-date-picker
                    readonly
                    v-model="taskManagementDetail.startTime"
                    type="datetime"
                    placeholder="选择任务开始日期时间"
                    default-time="12:00:00"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截至日期" prop="endTime">
                  <el-date-picker
                    readonly
                    v-model="taskManagementDetail.endTime"
                    type="datetime"
                    placeholder="选择任务截至日期时间"
                    default-time="12:00:00"
                    value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="任务进度" prop="taskDetail">
                  <el-progress :text-inside="true" :stroke-width="26"
                               :percentage="taskManagementDetail.taskProgress" :color="colors"></el-progress>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="任务详情" prop="taskDetail">
                  <el-input type="textarea" readonly v-model="taskManagementDetail.taskDetail"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <!-- 卡片标题 汇报记录 -->
          <div class="title-box">
            <div class="title">
              汇报记录
            </div>
          </div>
          <el-card class="box-card">
            <el-table
              :data="taskManagementDetail.taskReportDetailList"
              border
              style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column
                prop="reporterName"
                label="汇报人"
                width="180">
              </el-table-column>
              <el-table-column
                prop="reportTime"
                label="汇报时间">
              </el-table-column>
              <el-table-column
                prop="taskDescription"
                label="汇报内容">
              </el-table-column>
              <el-table-column label="附件">
                <template slot-scope="scope">
                  <div v-for="(item,index) in scope.row.taskReportAttachmentList" :key="index">
                    {{ item.fileName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="taskProgress"
                label="个人进度">
              </el-table-column>
            </el-table>
          </el-card>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editMyTaskVisible = false">关 闭</el-button>
      </span>
      </el-dialog>
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
      taskManagementDetail: {},
      editFormData: {},
      taskManagementDetailVisible: false,
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
      leaderDepartmentOptions: [],
      taskManagementList: [],
      total: 0,
      taskGradeOptions: [{
        value: 1,
        label: '紧急'
      }, {
        value: 2,
        label: '一般'
      }, {
        value: 3,
        label: '非紧急'
      }],
      taskTypeOptions: [{
        value: 1,
        label: '会议'
      }, {
        value: 2,
        label: '系统开发'
      }, {
        value: 3,
        label: '工程项目'
      }]
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
    },
    async showTaskManagementDetail (row) {
      this.taskManagementDetailVisible = true
      this.taskId = row.id
      const { data: res } = await this.$http.get('/task/getTaskManagementDetail/' + this.taskId)
      if (res.code !== 200) {
        return this.$message.error('获取任务管理详情失败')
      }
      this.taskManagementDetail = res.data
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
  margin-bottom: 15px;
  font-size: 12px;
}

.title-box {
  display: flex;
  height: 40px;
  margin-bottom: 15px;
  border-bottom: solid 4px #00CCCC;

  .title {
    color: white;
    background-color: #00CCCC;
    width: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
