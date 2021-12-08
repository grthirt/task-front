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
      <!-- 数据展示区域 -->
      <el-table border stripe :data="myTaskList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务标题" prop="taskName"></el-table-column>
        <el-table-column label="发起时间" prop="startTime"></el-table-column>
        <el-table-column label="发起人" prop="publisherName"></el-table-column>
        <el-table-column label="牵头部门" prop="leaderDepartmentName"></el-table-column>
        <el-table-column label="牵头人" prop="leaderUserName"></el-table-column>
        <el-table-column label="截至时间" prop="endTime"></el-table-column>
        <el-table-column label="我的工时" prop="workingHours"></el-table-column>
        <el-table-column label="任务进度">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.taskProgress" :color="colors"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" prop="taskStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.taskProgress === '100%'" style="color: #409EFF"> 已完成 </span>
            <span v-if="scope.row.taskProgress !== '100%'" style="color: #67C23A"> 进行中 </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button icon="el-icon-edit" type="primary" size="small"
                         @click="editMyTaskVisibleChange(scope.row.id)">
                任务汇报
              </el-button>
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
      <!-- 编辑区域 任务汇报-->
      <el-dialog
        :visible.sync="editMyTaskVisible"
        width="80%" @close="editDialogClosed">
        <el-form :model="editFormData" ref="editTaskReportFormDataRef" label-width="90px"
                 size="medium"
                 :rules="saveNewTaskRules">
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
                  <el-input disabled v-model="editFormData.taskName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工时" prop="workingHours">
                  <el-input-number disabled v-model="editFormData.workingHours" :precision="1"
                                   :step="0.1" :min="0.2"
                                   :max="10"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="牵头部门" prop="leaderDepartmentName">
                  <input type="hidden" v-model="editFormData.leaderDepartmentName">
                  <el-select disabled v-model="editFormData.leaderDepartmentId" filterable
                             placeholder="请选择">
                    <el-option
                      v-for="(items,index) in departmentOptions"
                      :key="index"
                      :label="items.departmentName"
                      :value="items.departmentCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="牵头人" prop="leaderUserName">
                  <input type="hidden" v-model="editFormData.leaderUserName">
                  <el-select disabled v-model="editFormData.leaderUserId" filterable
                             placeholder="请选择">
                    <el-option
                      v-for="(item,index) in userOptions"
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
                  <el-select disabled v-model="editFormData.taskGrade" placeholder="请选择任务等级">
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
                  <el-select disabled v-model="editFormData.taskType" placeholder="请选择任务等级">
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
                    disabled
                    v-model="editFormData.startTime"
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
                    disabled
                    v-model="editFormData.endTime"
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
                <el-form-item label="任务详情" prop="taskDetail">
                  <el-input type="textarea" disabled v-model="editFormData.taskDetail"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务附件" prop="taskDetail">
                  <el-link v-for="(item,index) in editFormData.taskAttachmentList" :key="index"
                           @click="downFile(item.newFileName)">{{ item.fileName }}
                  </el-link>
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
              border
              :data="taskReportList"
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
                label="任务进度">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.taskProgress"
                               :color="colors"></el-progress>
                </template>
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
                label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button icon="el-icon-edit" type="primary" size="small"
                               @click="deleteTaskReport(scope.row.id,scope.row.taskId)">
                      删除汇报记录
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <!-- 卡片标题 进行汇报 -->
          <div class="title-box">
            <div class="title">
              任务汇报
            </div>
          </div>
          <el-card class="box-card">
            <el-row>
              <el-col :span="4">
                <el-form-item label="汇报人">
                  <el-input type="text" v-model="taskReportRequestData.reporterName"/>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="任务描述">
                  <el-input v-model="taskReportRequestData.taskDescription"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="任务进度">
                  <el-slider v-model="taskReportRequestData.taskProgress"
                             :format-tooltip="formatTooltip"
                             :marks="marks"></el-slider>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <!-- 卡片标题 -->
          <div class="title-box">
            <div class="title">
              任务附件
            </div>
          </div>
          <!-- 任务附件卡片区域 -->
          <el-card class="box-card">
            <el-upload
              name="file"
              action="http://localhost:8898/file/uploadFile"
              :on-success="uploadSuccess"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="10"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">上传文件大小不超过3M</div>
            </el-upload>
          </el-card>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editMyTaskVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveTaskReport">确认汇报</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import eventBus from '../components/eventBus'

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
      saveNewTaskRules: {},
      marks: {
        25: {
          style: {
            color: '#1989FA'
          },
          label: this.$createElement('strong', '25%')
        },
        50: {
          style: {
            color: '#1989FA'
          },
          label: this.$createElement('strong', '50%')
        },
        75: {
          style: {
            color: '#1989FA'
          },
          label: this.$createElement('strong', '75%')
        }
      },
      editMyTaskVisible: false,
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
      total: 0,
      // 上传的文件列表
      fileList: [],
      // 我汇报记录列表
      taskReportList: [],
      // 任务汇报的请求列表
      taskReportRequestData: {
        taskId: '',
        reporterId: window.sessionStorage.getItem('userCode'),
        reporterName: window.sessionStorage.getItem('userName'),
        taskProgress: 0,
        taskDescription: '',
        taskReportAttachmentList: []
      },
      editFormData: {},
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
    uploadSuccess (response) {
      // 上传成功之后需要把上传成功的id，集合到一个数组中
      this.taskReportRequestData.taskReportAttachmentList.push({
        uploadFileId: response.data.uploadFileId
      })
    },
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
    async handleRemove (file) {
      // 调用删除接口，删除数据库数据
      const { data: res } = await this.$http.delete('/file/removeUploadFile', {
        params: {
          id: file.response.data.uploadFileId
        }
      })
      if (res.code !== 200) {
        return this.$message.error('附件删除失败')
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file) {
      return this.$messageBox.confirm(`确定移除 ${file.name}？`)
    },
    dialogVisibleChange () {
      eventBus.$emit('sendDialogVisibleStatus', this.dialogVisibleStatus)
      eventBus.$emit('userOptions', this.userOptions)
      eventBus.$emit('departmentOptions', this.departmentOptions)
    },
    editMyTaskVisibleChange (id) {
      this.$http.get('/task/getTask/' + id).then((res) => {
        this.editFormData = res.data.data
      })
      this.taskReportRequestData.taskId = id
      this.editMyTaskVisible = true
      this.listTaskReport(id)
    },

    // 任务汇报保存
    saveTaskReport () {
      this.$refs.editTaskReportFormDataRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/task/saveTaskReport', this.taskReportRequestData)
        if (res.code !== 200) {
          this.$message.error('汇报失败')
        }
        this.$message.success('汇报成功')
        await this.listTaskReport(this.taskReportRequestData.taskId)
        this.$refs.editTaskReportFormDataRef.resetFields()
        this.editMyTaskVisible = true
        // this.taskReportRequestData.taskId = ''
        // this.taskReportRequestData.reporterId = ''
        // this.taskReportRequestData.reporterName = ''
        // this.taskReportRequestData.taskProgress = ''
        // this.taskReportRequestData.taskDescription = ''
        // this.taskReportRequestData.taskReportAttachmentList = {}
      })
    },
    async listTaskReport (taskId) {
      const { data: res } = await this.$http.get('/task/getTaskReport', {
        params: {
          taskId: taskId,
          reporterId: window.sessionStorage.getItem('userCode')
        }
      })
      if (res.code !== 200) {
        return this.$message.error('失败')
      }
      this.taskReportList = res.data
    },
    formatTooltip (val) {
      return val + '%'
    },
    editDialogClosed () {
      this.$refs.editTaskReportFormDataRef.resetFields()
    },
    async deleteTaskReport (id, taskId) {
      const confirmResult = await this.$confirm('将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      console.log(confirmResult)
      if (confirmResult === 'cancel') {
        this.$message.info('已经取消了删除')
      }
      const { data: res } = await this.$http.delete('/task/deleteTaskReport/' + id)
      if (res.code !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // 更新记录
      await this.listTaskReport(taskId)
      // 更新外层列表
      await this.listMyTasks()
    },
    downFile (fileName) {
      this.$http({
        method: 'get',
        url: '/file/downloadFile/',
        params: {
          fileName: fileName
        },
        responseType: 'arraybuffer'
      })
        .then(res => {
          console.log(res)
          this.download(res.data, fileName)
        })
        .catch(req => {
          console.log('下载失败', req)
        })
    },
    // 下载文件
    download (data, fileName) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    }
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

.table {
  table-layout: fixed;
  border-collapse: collapse;
  border: none;
  width: 100%;

  td {
    height: 40px;
    border: 1px solid #c7c3c3;
    text-align: center;
  }
}

.table :nth-last-child(3) {
  width: 400px;
}

.table :nth-last-child(4) {
  width: 100px;
}

.table :nth-last-child(5) {
  width: 250px;
}

.table :nth-last-child(6) {
  width: 100px;
}

.table :nth-last-child(7) {
  width: 100px;
}

</style>
