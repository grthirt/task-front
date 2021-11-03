<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/timeout-task">超时的任务</router-link>
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
        <el-table-column label="操作" prop="taskStatus">
          <template slot-scope="scope">
            <div>
              <el-button icon="el-icon-edit" type="primary" size="small"
                         @click="editTimeoutVisibleChange(scope.row.id)">
                重新启用任务
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
      <!-- 编辑区域 重新启用任务-->
      <el-dialog
        :visible.sync="editTimeoutVisible"
        width="40%" @close="editDialogClosed">
        <el-form :model="editFormData" ref="editFormDataRef" label-width="90px" size="medium">
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
                <el-form-item label="开始日期">
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
                <el-form-item label="截至日期">
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
      editFormData: {},
      editTimeoutVisible: false,
      activeName: 'second',
      dialogVisibleStatus: true,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        taskName: '',
        publisherId: window.sessionStorage.getItem('userCode')
      },
      taskManagementList: [],
      total: 0,
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
    // 获取下发的任务
    async listTaskManagement () {
      const { data: res } = await this.$http.get('/task/listTimeoutTasks', {
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
    // 关闭弹框清空表单内容
    editDialogClosed () {
      this.$refs.editFormDataRef.resetFields()
    },
    async editTimeoutVisibleChange (id) {
      const { data: res } = await this.$http.get('/task/getTask/' + id)
      this.editFormData = res.data
      this.editFormData.taskStatus = 1
      this.editTimeoutVisible = true
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
        // 刷新数据列表
        await this.listTaskManagement()
        this.$message.success('任务重新启用成功')
        this.editTimeoutVisible = false
      })
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
