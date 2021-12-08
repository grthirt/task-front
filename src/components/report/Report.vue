<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/statistics">统计报表</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-form label-width="90px" size="medium" :rules="reportRules">
        <el-row>
          <el-col :span="5">
            <el-form-item label="选择部门">
              <el-select filterable placeholder="请选择部门">
                <el-option
                  v-for="(item,index) in departmentOptions"
                  :key="index"
                  :label="item.departmentName"
                  :value="item.departmentCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="开始日期">
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
          <el-col :span="5">
            <el-form-item label="截至日期">
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
          <el-col :span="4">
            <el-button type="primary" size="medium">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div id="three" style="width: 1600px;height: 400px"></div>
      <div id="main" style="width: 1600px;height: 400px"></div>
      <div id="second" style="width: 1600px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Report',
  data () {
    return {
      reportRules: {
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
        ]
      },
      saveNewTaskData: {
        startTime: '',
        endTime: ''
      },
      // 部门列表 option 数组
      departmentOptions: [],
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.saveNewTaskData.endTime
          ) {
            return time.getTime() > new Date(this.saveNewTaskData.endTime
            ).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.saveNewTaskData.startTime) {
            return time.getTime() < new Date(this.saveNewTaskData.startTime).getTime() - 86400000
          }
        }
      }
    }
  },
  mounted () {
    const main = echarts.init(document.getElementById('main'))
    const second = echarts.init(document.getElementById('second'))
    const three = echarts.init(document.getElementById('three'))
    main.setOption({
      title: {
        text: '任务数量统计'
      },
      dataset: {
        source: [
          ['score', 'amount', 'product'],
          [89.3, 58212, '张三'],
          [57.1, 78254, '张三1'],
          [74.4, 41032, '张三2'],
          [50.1, 12755, '张三3'],
          [89.7, 20145, '张三4'],
          [68.1, 79146, '张三5'],
          [19.6, 91852, '张三6'],
          [10.6, 101852, '张三7'],
          [32.7, 20112, '张三8']
        ]
      },
      xAxis: {},
      yAxis: { type: 'category' },
      series: [
        {
          type: 'bar',
          encode: {
            // 将 "amount" 列映射到 X 轴。
            x: 'amount',
            // 将 "product" 列映射到 Y 轴。
            y: 'product'
          }
        }
      ]
    })
    second.setOption({
      title: {
        text: '任务数量统计'
      },
      dataset: {
        source: [
          ['score', 'amount', 'product'],
          [89.3, 58212, '张三'],
          [57.1, 78254, '张三1'],
          [74.4, 41032, '张三2'],
          [50.1, 12755, '张三3'],
          [89.7, 20145, '张三4'],
          [68.1, 79146, '张三5'],
          [19.6, 91852, '张三6'],
          [10.6, 101852, '张三7'],
          [32.7, 20112, '张三8']
        ]
      },
      xAxis: {},
      yAxis: { type: 'category' },
      series: [
        {
          type: 'bar',
          encode: {
            // 将 "amount" 列映射到 X 轴。
            x: 'amount',
            // 将 "product" 列映射到 Y 轴。
            y: 'product'
          }
        }
      ]
    })
    three.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {},
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
          ]
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '完成任务数',
          min: 0,
          max: 250,
          position: 'right',
          axisLabel: {
            formatter: '{value} 个'
          }
        },
        {
          type: 'value',
          name: '总任务数',
          min: 0,
          max: 25,
          position: 'left',
          axisLabel: {
            formatter: '{value} 个'
          }
        }
      ],
      series: [
        {
          name: '完成任务数量',
          type: 'bar',
          yAxisIndex: 0,
          data: [6, 32, 70, 86, 68.7, 100.7, 125.6, 112.2, 78.7, 48.8, 36.0, 19.3]
        },
        {
          name: '总任务数',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: [
            6.0,
            10.2,
            10.3,
            11.5,
            10.3,
            13.2,
            14.3,
            16.4,
            18.0,
            16.5,
            12.0,
            5.2
          ]
        }
      ]
    })
  },
  created () {
    this.listDepartments()
  },
  methods: {
    // 获取部门列表
    async listDepartments () {
      const { data: res } = await this.$http.get('/department/listDepartments')
      if (res.code !== 200) {
        return this.$message.error('获取部门列表列表失败')
      }
      this.departmentOptions = res.data
    }
  }

}
</script>

<style scoped>
.box-card {
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
