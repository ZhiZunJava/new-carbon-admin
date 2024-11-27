<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          placeholder="请输入单据号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-select v-model="queryParams.applyUser" placeholder="请选择申请人" clearable filterable size="small">
          <el-option
            v-for="dict in applyUserOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" prop="applyTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.applyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择申请日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable filterable size="small">
          <el-option
            v-for="dict in applyStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditUser">
        <el-select v-model="queryParams.auditUser" placeholder="请选择审核人" clearable filterable size="small">
          <el-option
            v-for="dict in auditUserOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核日期" prop="auditTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.auditTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择审核日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable filterable size="small">
          <el-option
            v-for="dict in auditStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="replenishApplyList">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="单据号" align="center" prop="serialNo" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="申请人" align="center" prop="applyUser" :formatter="applyUserFormat" />
      <el-table-column label="申请日期" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applyStatus" :formatter="applyStatusFormat" />
      <el-table-column label="审核人" align="center" prop="auditUser" :formatter="auditUserFormat" />
      <el-table-column label="审核日期" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus" :formatter="auditStatusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wmsApply:replenishApply:edit']"
          >详细</el-button>
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

    <!-- 添加或修改补货申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-form-item label="单据号" prop="serialNo">
          <el-input v-model="form.serialNo" placeholder="请输入单据号" disabled />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" disabled clearable filterable>
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <el-select v-model="form.applyUser" placeholder="请选择申请人" disabled clearable filterable>
            <el-option
              v-for="dict in applyUserOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyTime">
          <el-date-picker clearable size="small"
            v-model="form.applyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择申请日期" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" placeholder="请选择申请状态" disabled clearable filterable>
            <el-option
              v-for="dict in applyStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditUser">
          <el-select v-model="form.auditUser" placeholder="请选择审核人" disabled clearable filterable>
            <el-option
              v-for="dict in auditUserOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="auditTime">
          <el-date-picker clearable size="small"
            v-model="form.auditTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择审核日期" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态" disabled clearable filterable>
            <el-option
              v-for="dict in auditStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditComment">
          <el-input v-model="form.auditComment" placeholder="请输入审核意见" type="textarea" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" disabled />
        </el-form-item>
        <el-divider content-position="center">补货申请明细信息</el-divider>
        <el-table :data="wmsReplenishApplyDetailList" :row-class-name="rowWmsReplenishApplyDetailIndex" ref="wmsReplenishApplyDetail">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="物料" prop="materialName" width="300">
          </el-table-column>
          <el-table-column label="型号" prop="materialModel"></el-table-column>
          <el-table-column label="规格" prop="materialSpecification"></el-table-column>
          <el-table-column label="单位" prop="materialUnit"></el-table-column>
          <el-table-column label="订货数量" prop="quantity" width="150">
          </el-table-column>
          <el-table-column label="备注" prop="detailRemark" width="150">
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.applyStatus != '2'" type="primary" @click="submitForm('1')">通
          过</el-button>
        <el-button v-if="form.applyStatus != '2'" type="warning" @click="submitForm('0')">驳
          回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReplenishApplyAudit, getReplenishApply, auditReplenishApply } from "@/api/wmsApply/replenishApply";

export default {
  name: "ReplenishApply",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsReplenishApplyDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 补货申请表格数据
      replenishApplyList: [],
      // 补货申请明细表格数据
      wmsReplenishApplyDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      // 申请人字典
      applyUserOptions: [],
      // 申请状态字典
      applyStatusOptions: [],
      // 审核人字典
      auditUserOptions: [],
      // 审核状态字典
      auditStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNo: null,
        applyUser: null,
        applyTime: null,
        applyStatus: null,
        auditUser: null,
        auditTime: null,
        auditStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("wms_replenish_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getQueryData("query_user").then(res => {
      this.applyUserOptions = res.data;
    });
    this.getDicts("apply_status").then(response => {
      this.applyStatusOptions = response.data;
    });
    this.getQueryData("query_user").then(res => {
      this.auditUserOptions = res.data;
    });
    this.getDicts("audit_status").then(response => {
      this.auditStatusOptions = response.data;
    });
  },
  watch: {
    'wmsReplenishApplyDetailList': {
      handler(newVal, oldVal) {
        this.form.wmsReplenishApplyDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询补货申请列表 */
    getList() {
      this.loading = true;
      listReplenishApplyAudit(this.queryParams).then(response => {
        this.replenishApplyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 申请人字典翻译
    applyUserFormat(row, column) {
      return this.selectDictLabel(this.applyUserOptions, row.applyUser);
    },
    // 申请状态字典翻译
    applyStatusFormat(row, column) {
      return this.selectDictLabel(this.applyStatusOptions, row.applyStatus);
    },
    // 审核人字典翻译
    auditUserFormat(row, column) {
      return this.selectDictLabel(this.auditUserOptions, row.auditUser);
    },
    // 审核状态字典翻译
    auditStatusFormat(row, column) {
      return this.selectDictLabel(this.auditStatusOptions, row.auditStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        serialNo: null,
        status: null,
        applyUser: null,
        applyTime: null,
        applyStatus: null,
        auditUser: null,
        auditTime: null,
        auditStatus: null,
        auditComment: null,
        remark: null,
        purchaseApplyFlag: null,
        wmsReplenishApplyDetailList: [],
      };
      this.wmsReplenishApplyDetailList = [];
      this.resetForm("form");
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
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReplenishApply(id).then(response => {
        this.form = response.data;
        this.wmsReplenishApplyDetailList = response.data.wmsReplenishApplyDetailList;
        this.open = true;
        this.title = "审核补货申请";
      });
    },
    /** 提交按钮 */
    submitForm(val) {
      this.form.auditStatus = val;
      this.$refs["form"].validate(valid => {
        if (valid) {
          auditReplenishApply(this.form).then(response => {
            this.msgSuccess("审核成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 补货申请明细序号 */
    rowWmsReplenishApplyDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
  }
};
</script>

<style lang="scss">
.xzwl {
  margin-bottom: 0px !important;

  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>