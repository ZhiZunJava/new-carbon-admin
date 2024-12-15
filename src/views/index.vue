<template>
  <div class="app-container home">
    <el-row type="flex" justify="center" :gutter="10">
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>能耗总览</span>
          </div>
          <div>
            <el-row type="flex" justify="center" :gutter="10">
              <el-col>
                <el-card class="today">
                  <div class="font-title">今日总能耗</div>
                  <div class="font-content">
                    {{ nhzl.today.toFixed(2) }} KG
                  </div>
                </el-card>
              </el-col>
              <el-col><el-card class="month">
                  <div class="font-title">本月总能耗</div>
                  <div class="font-content">
                    {{ nhzl.month.toFixed(2) }} KG
                  </div>
                </el-card></el-col>
              <el-col> <el-card class="year">
                  <div class="font-title">本年总能耗</div>
                  <div class="font-content">
                    {{ nhzl.year.toFixed(2) }} KG
                  </div>
                </el-card></el-col>
              <el-col> <el-card class="year-save">
                  <div class="font-title">本年总减排</div>
                  <div class="font-content">
                    {{ nhzl.yearSave.toFixed(2) }} KG
                  </div>
                </el-card> </el-col>

            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" :gutter="10" style="margin-top: 10px;">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>设备能耗排行</span>
          </div>
          <div>
            <el-table :data="sblhlist">
              <el-table-column label="排名" type="index" align="center" width="50" />
              <el-table-column label="产品" align="center" prop="equipmentName" />
              <el-table-column label="已产数量" align="center" prop="productQuantity" />
              <el-table-column label="单位耗电量" align="center" prop="powerConsume" />
              <el-table-column label="总耗电量" align="center" prop="totalPowerConsume" />
              <el-table-column label="单位碳排放" align="center" prop="carbonEmission" />
              <el-table-column label="总碳排放" align="center" prop="totalCarbonEmission" />
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>产品能耗排行</span>
          </div>
          <div>
            <el-table :data="cplhlist">
              <el-table-column label="排名" type="index" align="center" width="50" />
              <el-table-column label="产品" align="center" prop="materialName" />
              <el-table-column label="已产数量" align="center" prop="productQuantity" />
              <el-table-column label="单位耗电量" align="center" prop="powerConsume" />
              <el-table-column label="总耗电量" align="center" prop="totalPowerConsume" />
              <el-table-column label="单位碳排放" align="center" prop="carbonEmission" />
              <el-table-column label="总碳排放" align="center" prop="totalCarbonEmission" />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="10" style="margin-top: 10px;">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>综合能耗</span>
          </div>
          <div>
            <div id="viewNhzh" style="height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>耗能占比</span>
          </div>
          <div>
            <div id="viewNhzb" style="height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" :gutter="10" style="margin-top: 10px;">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>能耗地图</span>
          </div>
          <div>
            <div id="viewNhdt" style="height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>能耗趋势</span>
          </div>
          <div>
            <div id="viewNhqs" style="height: 300px;"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getEmissionChartOverall,
  getEmissionChartPercent,
  getEquipmentList,
  getProductListDay, // 产品能耗
  getProductListMonth,
  getProductListYear,
  getProductList
} from '@/api/carbonReport/api'

export default {
  name: "index",
  data() {
    return {
      nhzl: {
        today: 0,
        month: 0,
        year: 0,
        yearSave: 0
      },
      sblhlist: [],
      cplhlist: [],
      zhlhopt: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [
          {
            name: '生产耗电量',
            type: 'bar',
            data: []
          },
          {
            name: '生产用水量',
            type: 'bar',
            data: []
          },
          {
            name: '办公耗电量',
            type: 'bar',
            data: []
          },
          {
            name: '办公用水量',
            type: 'bar',
            data: []
          },
          {
            name: '节电量',
            type: 'bar',
            data: []
          }
        ]
      },
      hnzbopt: {

        title: {
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '能耗',
            type: 'pie',
            radius: '50%',
            data: [
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]

      },
      nhdtopt: {
        series: [
          {
            name: '总能耗',
            type: 'treemap',
            data: [],
            // data: [
            //   {
            //     name: 'nodeA',
            //     value: 10,
            //     children: [
            //       {
            //         name: 'nodeAa',
            //         value: 4
            //       },
            //       {
            //         name: 'nodeAb',
            //         value: 6
            //       }
            //     ]
            //   },
            //   {
            //     name: 'nodeB',
            //     value: 20,
            //     children: [
            //       {
            //         name: 'nodeBa',
            //         value: 20,
            //         children: [
            //           {
            //             name: 'nodeBa1',
            //             value: 20
            //           }
            //         ]
            //       }
            //     ]
            //   }
            // ]
          }
        ]
      },
      nhqsopt: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '13%'
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            magicType: { type: ['line', 'bar'] },
            restore: {},
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '碳排放量',
            type: 'line',
            data: [],
          },
          {
            name: '碳减排量',
            type: 'line',
            data: [],
          }
        ]
      }
    };
  },
  created() {
    this.getNhzlData()
    this.getSbzlData()
    this.getCpzlData()
  },
  mounted() {
    this.getEmissionChartOverall()
    this.getEmissionChartPercent()
  },
  methods: {
    getNhzlData() {
      getProductListDay().then(res => {
        let row = res.rows;
        if (row && row.length > 0) {
          this.nhzl.today = row[0].totalCarbonEmission;
        }
      })
      getProductListMonth().then(res => {
        let row = res.rows;
        if (row && row.length > 0) {
          this.nhzl.month = row[0].totalCarbonEmission;
        }
      })
      getProductListYear().then(res => {
        let row = res.rows;
        if (row && row.length > 0) {
          this.nhzl.year = row[0].totalCarbonEmission;
          this.nhzl.yearSave = row[0].totalCarbonSave;
        }
      })
    },
    getSbzlData() {
      getEquipmentList({
        pageNum: 1,
        pageSize: 10,
      }).then(res => {
        this.sblhlist = res.rows;
      })
    },
    getCpzlData() {
      getProductList({
        pageNum: 1,
        pageSize: 10,
      }).then(res => {
        this.cplhlist = res.rows;
      })
    },
    getEmissionChartOverall() {
      getEmissionChartOverall().then(res => {
        let data = res.data;

        for (let year in data) {
          let obj = data[year];
          this.zhlhopt.yAxis.data.push(year);
          this.zhlhopt.series[0].data.push(obj.totalPowerConsume)
          this.zhlhopt.series[1].data.push(obj.totalWaterConsume)
          this.zhlhopt.series[2].data.push(obj.totalOfficePowerConsume)
          this.zhlhopt.series[3].data.push(obj.totalOfficeWaterConsume)
          this.zhlhopt.series[4].data.push(obj.totalPrdPowerSave + obj.totalOfficePowerSave)

          this.nhqsopt.xAxis.data.push(year);
          this.nhqsopt.series[0].data.push(obj.totalCarbonEmission)
          this.nhqsopt.series[1].data.push(obj.totalCarbonSave)
        }

        this.drawerZhlh();
        this.drawerNhqs()
      })
    },
    getEmissionChartPercent() {
      getEmissionChartPercent().then(res => {
        let data = res.data[0];

        this.hnzbopt.series[0].data.push({
          value: data.totalPowerConsume,
          name: '生产耗电量'
        })
        this.hnzbopt.series[0].data.push({
          value: data.totalOfficePowerConsume,
          name: '办公耗电量'
        })
        this.hnzbopt.series[0].data.push({
          value: data.totalWaterConsume,
          name: '生产耗水量'
        })
        this.hnzbopt.series[0].data.push({
          value: data.totalOfficeWaterConsume,
          name: '办公耗水量'
        })
        // 办公能耗 ，生产能耗
        let officeConsume = data.totalOfficePowerConsume + data.totalOfficeWaterConsume;
        let prdConsume = data.totalPowerConsume + data.totalWaterConsume;

        this.nhdtopt.series[0].data.push({
          value: officeConsume,
          name: '办公能耗',
          children: [
            {
              value: data.totalOfficePowerConsume,
              name: '办公耗电量'
            },
            {
              value: data.totalOfficeWaterConsume,
              name: '办公耗水量'
            }
          ]
        })

        this.nhdtopt.series[0].data.push({
          value: prdConsume,
          name: '生产能耗',
          children: [
            {
              value: data.totalPowerConsume,
              name: '生产耗电量'
            },
            {
              value: data.totalWaterConsume,
              name: '生产耗水量'
            }
          ]
        })

        this.drawerNhzb()
        this.drawerNhdt()
      })
    },
    drawerZhlh() {
      let chart = this.$echarts.init(document.getElementById('viewNhzh'));
      chart.setOption(this.zhlhopt);
      window.addEventListener('resize', chart);
    },
    drawerNhzb() {
      let chart = this.$echarts.init(document.getElementById('viewNhzb'));
      chart.setOption(this.hnzbopt);
      window.addEventListener('resize', chart);
    },
    drawerNhdt() {
      let chart = this.$echarts.init(document.getElementById('viewNhdt'));
      chart.setOption(this.nhdtopt);
      window.addEventListener('resize', chart);
    },
    drawerNhqs() {
      let chart = this.$echarts.init(document.getElementById('viewNhqs'));
      chart.setOption(this.nhqsopt);
      window.addEventListener('resize', chart);
    }
  },
};
</script>

<style scoped lang="scss">
.font-content {
  font-size: 18px;
}

.font-title {
  font-size: 20px;
  padding-bottom: 20px;
}

.today {
  background-color: #60cfeb;
  color: aliceblue;
}

.month {
  background-color: #f7b018;
  color: aliceblue;
}

.year {
  background-color: #fb846c;
  color: aliceblue;
}

.year-save {
  background-color: #28b976;
  color: aliceblue;
}
</style>
