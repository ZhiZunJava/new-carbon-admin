<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailList">
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="已产数量" align="center" prop="productQuantity" />
      <el-table-column label="单位耗电量" align="center" prop="powerConsume" />
      <el-table-column label="总耗电量" align="center" prop="totalPowerConsume" />
      <el-table-column label="单位碳排放" align="center" prop="carbonEmission" >
        <template slot-scope="scope">
          {{ scope.row.carbonEmission.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="总碳排放" align="center" prop="totalCarbonEmission" >
        <template slot-scope="scope">
          {{ scope.row.totalCarbonEmission.toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getEquipmentList } from '../../../api/carbonReport/api';


export default {
  name: "EquipmentPowerReport",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // VIEW表格数据
      detailList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equipmentName: null,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      getEquipmentList(this.queryParams).then(response => {
        this.detailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>