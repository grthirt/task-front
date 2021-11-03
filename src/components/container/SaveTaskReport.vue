<template>
  <div>
    <!-- 添加用户的对话框-->
    <el-dialog @close="saveNewTaskClose"
               :visible.sync="dialogVisible"
               width="80%">
      <el-form :model="saveNewTaskData" ref="saveNewTaskRef" label-width="90px" size="medium" :rules="saveNewTaskRules">
        <!-- 基础信息卡片标题 -->
        <div class="title-box">
          <div class="title">
            基础信息
          </div>
        </div>
        <!-- 基础信息卡片区域 -->
        <el-card class="box-card">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务名称" prop="taskName">
                <el-input v-model="saveNewTaskData.taskName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工时" prop="workingHours">
                <el-input-number v-model="saveNewTaskData.workingHours" :precision="1" :step="0.1" :min="0.2"
                                 :max="10"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="牵头部门" prop="leaderDepartmentName">
                <input type="hidden" v-model="saveNewTaskData.leaderDepartmentName">
                <el-select v-model="saveNewTaskData.leaderDepartmentId" filterable
                           placeholder="请选择" @change="getDepartmentNameByDepartmentCode">
                  <el-option
                    v-for="(item,index) in departmentOptions"
                    :key="index"
                    :label="item.departmentName"
                    :value="item.departmentCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上报领导">
                <input type="hidden" v-model="saveNewTaskData.publisherName">
                <el-select v-model="saveNewTaskData.publisherId" filterable
                           placeholder="请选择" @change="getUserNameByUserCode">
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
                <el-select v-model="saveNewTaskData.taskGrade" placeholder="请选择任务等级">
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
                <el-select v-model="saveNewTaskData.taskType" placeholder="请选择任务等级">
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
                  v-model="saveNewTaskData.startTime"
                  type="datetime"
                  placeholder="选择任务开始日期时间"
                  default-time="12:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptionsStart">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截至日期" prop="endTime">
                <el-date-picker
                  v-model="saveNewTaskData.endTime"
                  type="datetime"
                  placeholder="选择任务截至日期时间"
                  default-time="12:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptionsEnd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="任务详情" prop="taskDetail">
                <el-input type="textarea" v-model="saveNewTaskData.taskDetail"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <!-- 附件卡片标题 -->
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
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveNewTask">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from '../eventBus'

export default {
  name: 'SaveTaskReport',
  data () {
    return {
      // 添加窗口打开关闭状态
      dialogVisible: false,
      // 上传的文件列表
      fileList: [],
      // 任务列表请求参数
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        taskName: '',
        publisherId: '',
        reporterId: window.sessionStorage.getItem('userCode'),
        isReport: true
      },
      // 添加任务上报参数
      saveNewTaskData: {
        taskName: '',
        workingHours: 1.0,
        publisherId: '',
        publisherName: '',
        reporterId: window.sessionStorage.getItem('userCode'),
        reporterName: window.sessionStorage.getItem('userName'),
        leaderDepartmentId: '',
        leaderDepartmentName: '',
        leaderUserId: '',
        leaderUserName: '',
        taskGrade: 1,
        taskType: 1,
        startTime: '',
        endTime: '',
        taskDetail: '',
        isReport: true,
        taskPersonList: [],
        taskAttachmentList: []
      },
      // 表单验证
      saveNewTaskRules: {
        taskName: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          }
        ],
        workingHours: [
          {
            required: true,
            message: '请输入工时',
            trigger: 'blur'
          }
        ],
        // TODO 牵头部门必填验证失效
        leaderDepartmentName: [
          {
            required: true,
            message: '请输入牵头部门',
            trigger: ['blur', 'change']
          }
        ],
        // TODO 牵头人必填验证失效
        publisherUserName: [
          {
            required: true,
            message: '请选择上报的领导',
            trigger: ['blur', 'change']
          }
        ],
        taskType: [
          {
            required: true,
            message: '请选择任务类型',
            trigger: 'blur'
          }
        ],
        taskGrade: [
          {
            required: true,
            message: '请选择任务等级',
            trigger: 'blur'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请输入任务开始时间',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请输入任务截至时间',
            trigger: 'blur'
          }
        ],
        taskDetail: [
          {
            required: true,
            message: '请输入任务详情',
            trigger: 'blur'
          }
        ],
        // TODO 参与人必填验证失效
        taskPerson: [
          {
            required: true,
            message: '请选择参与人',
            trigger: 'blur'
          }
        ],
        // TODO 验证失效
        taskDescribe: [
          {
            required: true,
            message: '请输入任务描述',
            trigger: 'blur'
          }
        ]
      },
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
        email: ''
      },
      taskManagementList: [],
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
      }],
      // 人员列表 option 数组
      userOptions: [],
      // 部门列表 option 数组
      departmentOptions: [],
      value: '',
      // 时间选择控制函数
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.saveNewTaskData.endTime
          ) {
            return time.getTime() > new Date(this.saveNewTaskData.endTime
            ).getTime()
          }
        }
      },
      // 时间选择控制函数
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.saveNewTaskData.startTime) {
            return time.getTime() < new Date(this.saveNewTaskData.startTime).getTime() - 86400000
          }
        }
      }
    }
  },
  created () {
    eventBus.$on('sendDialogVisibleStatus', (val) => {
      this.dialogVisible = val
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
      this.saveNewTaskData.taskAttachmentList.push({
        uploadFileId: response.data.uploadFileId
      })
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
    getDepartmentNameByDepartmentCode (val) {
      this.departmentOptions.forEach((item) => {
        if (val === item.departmentCode) {
          this.saveNewTaskData.leaderDepartmentName = item.departmentName
        }
      })
    },
    getUserNameByUserCode (val) {
      this.userOptions.forEach((item) => {
        if (val === item.userCode) {
          this.saveNewTaskData.publisherName = item.userName
          this.saveNewTaskData.taskPersonList.forEach((items, index) => {
            this.saveNewTaskData.taskPersonList[index].userName = item.userName
          })
        }
      })
    },
    // 我的任务列表
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
    saveNewTask () {
      this.$refs.saveNewTaskRef.validate(async valid => {
        const { data: res } = await this.$http.post('/task/saveTask', this.saveNewTaskData)
        if (res.code !== 200) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.dialogVisible = false
        await this.listTaskManagement()
        eventBus.$emit('sendTaskManagementList', this.taskManagementList)
      })
    },
    // 关闭之后清空表单项
    saveNewTaskClose () {
      this.$refs.saveNewTaskRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
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

.box-card {
  margin-bottom: 20px;
}
</style>
