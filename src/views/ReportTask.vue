<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/report-task">上报的任务</router-link>
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
      </el-row>
      <!-- 数据展示区域 -->
      <el-table border stripe :data="taskManagementList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务标题" prop="taskName"></el-table-column>
        <el-table-column label="上报人" prop="reporterName"></el-table-column>
        <el-table-column label="任务等级" prop="taskGrade">
          <template slot-scope="scope">
            <span v-if="scope.row.taskGrade === 1" style="color: #409EFF"> 紧急 </span>
            <span v-if="scope.row.taskGrade === 2" style="color: #67C23A"> 一般 </span>
            <span v-if="scope.row.taskGrade === 3" style="color: #F56C6C"> 非紧急 </span>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" prop="taskType">
          <template slot-scope="scope">
            <span v-if="scope.row.taskType === 1" style="color: #409EFF"> 日常 </span>
            <span v-if="scope.row.taskType === 2" style="color: #67C23A"> 会议 </span>
            <span v-if="scope.row.taskType === 3" style="color: #F56C6C"> 工程 </span>
          </template>
        </el-table-column>
        <el-table-column label="上报时间" prop="reportAt"></el-table-column>
        <el-table-column label="操作" prop="taskStatus">
          <template slot-scope="scope">
            <div>
              <el-button icon="el-icon-edit" size="small" type="primary"
                         @click="editReviewAndIssueVisibleChange(scope.row.id)">
                审核并且下发
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
      <!-- 编辑区域 审核并且下发-->
      <el-dialog
        title="提示"
        :visible.sync="editReviewAndIssueVisible"
        width="80%" @close="editDialogClosed">
        <el-form :model="editFormData" ref="editFormDataRef" label-width="90px" size="medium" :rules="saveNewTaskRules">
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
                  <el-input v-model="editFormData.taskName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工时" prop="workingHours">
                  <el-input-number v-model="editFormData.workingHours" :precision="1" :step="0.1" :min="0.2"
                                   :max="10"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="牵头部门" prop="leaderDepartmentName">
                  <input type="hidden" v-model="editFormData.leaderDepartmentName">
                  <el-select v-model="editFormData.leaderDepartmentId" filterable
                             placeholder="请选择" @change="getDepartmentNameByDepartmentCode">
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
                  <input type="hidden" v-model="editFormData.leaderUserName">
                  <el-select v-model="editFormData.leaderUserId" filterable
                             placeholder="请选择" @change="getUserNameByUserCodeOne"
                  >
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
                  <el-select v-model="editFormData.taskGrade" placeholder="请选择任务等级">
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
                  <el-select v-model="editFormData.taskType" placeholder="请选择任务等级">
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
                    v-model="editFormData.startTime"
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
                    v-model="editFormData.endTime"
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
              <el-col :span="12">
                <el-form-item label="任务详情" prop="taskDetail">
                  <el-input type="textarea" v-model="editFormData.taskDetail"></el-input>
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
          <!-- 卡片标题 -->
          <div class="title-box">
            <div class="title">
              人员任务
            </div>
          </div>
          <el-card class="box-card">
            <el-row v-for="item in editFormData.taskPersonList" :key="item.userCode">
              <el-col :span="6">
                <el-form-item
                  label="参与人">
                  <input type="hidden" v-model="item.userName">
                  <el-select v-model="item.userId" filterable
                             placeholder="请选择" @change="getUserNameByUserCodeTwo">
                    <el-option
                      v-for="(item,index) in leaderUserOptions"
                      :key="index"
                      :label="item.userName +'【'+ item.departmentName + '】'"
                      :value="item.userCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="任务描述">
                  <el-input v-model="item.taskDescribe"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="分配工时">
                  <el-input-number v-model="item.workingHours" :precision="1" :step="0.1" :min="0.2"
                                   :max="10"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="addDomain">增加参与人</el-button>
            </el-form-item>
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
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editReportTask">确 定</el-button>
      </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/components/eventBus'

export default {
  name: 'TaskManagement',
  data () {
    return {
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
        leaderUserName: [
          {
            required: true,
            message: '请选择牵头人',
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
      editReviewAndIssueVisible: false,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        taskName: '',
        reporterId: '',
        publisherId: window.sessionStorage.getItem('userCode'),
        isReport: '1'
      },
      // 上传的文件列表
      fileList: [],
      queryInfoUserName: {
        userName: ''
      },
      leaderUserOptions: [],
      leaderDepartmentOptions: [],
      taskManagementList: [],
      total: 0,
      // 编辑的单条数据
      editFormData: {
        taskPersonList: [],
        taskAttachmentList: []
      },
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
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.editFormData.endTime
          ) {
            return time.getTime() > new Date(this.editFormData.endTime
            ).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.editFormData.startTime) {
            return time.getTime() < new Date(this.editFormData.startTime).getTime() - 86400000
          }
        }
      }
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
    // 获取下发的任务列表
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
    // 获取单条数据
    editReviewAndIssueVisibleChange (id) {
      this.$http.get('/task/getTask/' + id).then((res) => {
        this.editFormData = res.data.data
        this.editFormData.isReport = false
      })
      this.editReviewAndIssueVisible = true
    },
    // 关闭弹框清空表单内容
    editDialogClosed () {
      this.$refs.editFormDataRef.resetFields()
    },

    editReportTask () {
      this.$refs.editFormDataRef.validate(async validate => {
        if (!validate) return
        // 发起修改请求
        const { data: res } = await this.$http.put('/task/updateTask/', this.editFormData
        )
        if (res.code !== 200) {
          return this.$message.error('修改失败')
        }
        // 关闭对话框
        this.editReviewAndIssueVisible = false
        // 刷新数据列表
        await this.listTaskManagement()
        this.$message.success('更新数据成功')
      })
    },
    getDepartmentNameByDepartmentCode (val) {
      this.leaderDepartmentOptions.forEach((item) => {
        if (val === item.departmentCode) {
          this.editFormData.leaderDepartmentName = item.departmentName
        }
      })
    },
    getUserNameByUserCodeOne (val) {
      this.leaderUserOptions.forEach((item) => {
        if (val === item.userCode) {
          this.editFormData.leaderUserName = item.userName
        }
      })
    },
    getUserNameByUserCodeTwo (val) {
      this.leaderUserOptions.forEach((item) => {
        if (val === item.userCode) {
          for (let i = 0; i < this.editFormData.taskPersonList.length; i++) {
            if (this.editFormData.taskPersonList[i].userName !== '') {
              continue
            }
            this.editFormData.taskPersonList[i].userName = item.userName
          }
        }
      })
    },
    addDomain () {
      this.editFormData.taskPersonList.push({
        userId: '',
        userName: '',
        taskDescribe: '',
        workingHours: ''
      })
    },
    uploadSuccess (response) {
      // 上传成功之后需要把上传成功的id，集合到一个数组中
      this.editFormData.taskAttachmentList.push({
        uploadFileId: response.data.uploadFileId
      })
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file) {
      return this.$messageBox.confirm(`确定移除 ${file.name}？`)
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
