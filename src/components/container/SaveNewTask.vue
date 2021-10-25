<template>
  <div>
    <!-- 添加用户的对话框-->
    <el-dialog @close="saveNewTaskClose"
               :visible.sync="dialogVisible"
               width="80%">
      <el-form :model="saveNewTaskData" ref="saveNewTaskRef" label-width="90px" size="medium" :rules="saveNewTaskRules">
        <!-- 卡片区域 -->
        <span>基础信息</span>
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
                           placeholder="请选择" @change="getDepartmentNameByDepartmentCode"
                >
                  <el-option
                    v-for="(item,index) in leaderDepartmentOptions"
                    :key="index"
                    :label="item.departmentName"
                    :value="item.departmentCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="牵头人" prop="leaderUserName">
                <input type="hidden" v-model="saveNewTaskData.leaderUserName">
                <el-select v-model="saveNewTaskData.leaderUserId" filterable
                           placeholder="请选择" @change="getUserNameByUserCode"
                >
                  <el-option
                    v-for="(item,index) in leaderUserOptions"
                    :key="index"
                    :label="item.userName"
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
                  value-format="yyyy-MM-dd HH:mm:ss">
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
                  value-format="yyyy-MM-dd HH:mm:ss">
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

  name: 'SaveNewTask',
  data () {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        taskName: '',
        publisherId: ''
      },
      dialogVisible: false,
      saveNewTaskData: {
        taskName: '',
        workingHours: 1.0,
        leaderDepartmentId: '',
        leaderDepartmentName: '',
        leaderUserId: '',
        leaderUserName: '',
        taskGrade: 1,
        taskType: 1,
        startTime: '',
        endTime: '',
        taskDetail: ''
      },
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
        leaderDepartmentName: [
          {
            required: true,
            message: '请输入牵头部门',
            trigger: 'blur'
          }
        ],
        leaderUserName: [
          {
            required: true,
            message: '请输入牵头人',
            trigger: 'blur'
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
      leaderUserOptions: {},
      leaderDepartmentOptions: {},
      value: ''
    }
  },
  created () {
    eventBus.$on('sendDialogVisibleStatus', (val) => {
      this.dialogVisible = val
    })
    eventBus.$on('leaderUserOptions', (val) => {
      this.leaderUserOptions = val
    })
    eventBus.$on('leaderDepartmentOptions', (val) => {
      this.leaderDepartmentOptions = val
    })
    console.log(this.leaderUserOptions)
    console.log(this.leaderDepartmentOptions)
  },

  methods: {
    getDepartmentNameByDepartmentCode (val) {
      this.leaderDepartmentOptions.forEach((item) => {
        if (val === item.departmentCode) {
          this.saveNewTaskData.leaderDepartmentName = item.departmentName
        }
      })
    },
    getUserNameByUserCode (val) {
      this.leaderUserOptions.forEach((item) => {
        if (val === item.userCode) {
          this.saveNewTaskData.leaderUserName = item.userName
        }
      })
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
    },
    removeDomain (item) {
      const index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
