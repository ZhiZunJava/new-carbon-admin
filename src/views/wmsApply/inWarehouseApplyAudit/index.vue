<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="申请单号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" placeholder="请输入申请单号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="关联单据号" prop="bizBillId">
        <el-input v-model="queryParams.bizBillId" placeholder="请输入关联单据号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务类型" prop="bizType">
        <el-select v-model="queryParams.bizType" placeholder="请选择业务类型" clearable filterable size="small">
          <el-option v-for="dict in bizTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable filterable size="small">
          <el-option v-for="dict in supplierIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同号" prop="contractId">
        <el-input v-model="queryParams.contractId" placeholder="请输入合同号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同类型" prop="contractType">
        <el-select v-model="queryParams.contractType" placeholder="请选择合同类型" clearable filterable size="small">
          <el-option v-for="dict in contractTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-select v-model="queryParams.applyUser" placeholder="请选择申请人" clearable filterable size="small">
          <el-option v-for="dict in applyUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" prop="applyTime">
        <el-date-picker clearable size="small" v-model="queryParams.applyTime" type="date" value-format="yyyy-MM-dd"
          placeholder="选择申请日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" placeholder="请选择申请状态" clearable filterable size="small">
          <el-option v-for="dict in applyStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditUser">
        <el-select v-model="queryParams.auditUser" placeholder="请选择审核人" clearable filterable size="small">
          <el-option v-for="dict in auditUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="审核日期" prop="auditTime">
        <el-date-picker clearable size="small" v-model="queryParams.auditTime" type="date" value-format="yyyy-MM-dd"
          placeholder="选择审核日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable filterable size="small">
          <el-option v-for="dict in auditStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
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

    <el-table v-loading="loading" :data="inWarahouseApplyList">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="申请单号" align="center" prop="serialNo" width="100" />
      <el-table-column label="关联单据号" align="center" prop="bizBillId" width="100" />
      <el-table-column label="业务类型" align="center" prop="bizType" :formatter="bizTypeFormat" />
      <el-table-column label="供应商" align="center" prop="supplierId" :formatter="supplierIdFormat" />
      <el-table-column label="合同号" align="center" prop="contractId" />
      <el-table-column label="合同类型" align="center" prop="contractType" :formatter="contractTypeFormat" />
      <el-table-column label="申请类型" align="center" prop="applyType" :formatter="applyTypeFormat" />
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['wmsApply:inWarahouseApply:edit']">详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改入库申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px" label-position="left" :inline="true">
        <el-form-item label="申请单号" prop="serialNo">
          <el-input v-model="form.serialNo" disabled />
        </el-form-item>
        <el-form-item label="关联单据号" prop="bizBillId">
          <el-input v-model="form.bizBillId" disabled />
        </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
          <el-select v-model="form.bizType" disabled clearable filterable>
            <el-option v-for="dict in bizTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select v-model="form.supplierId" disabled clearable filterable>
            <el-option v-for="dict in supplierIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同号" prop="contractId">
          <el-input v-model="form.contractId" placeholder="请输入合同号" disabled />
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          <el-select v-model="form.contractType" disabled clearable filterable>
            <el-option v-for="dict in contractTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请类型" prop="applyType">
          <el-select v-model="form.applyType" disabled clearable filterable>
            <el-option v-for="dict in applyTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <el-select v-model="form.applyUser" disabled clearable filterable>
            <el-option v-for="dict in applyUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyTime">
          <el-date-picker clearable size="small" v-model="form.applyTime" type="date" value-format="yyyy-MM-dd"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select v-model="form.applyStatus" placeholder="请选择申请状态" disabled>
            <el-option v-for="dict in applyStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditUser">
          <el-select v-model="form.auditUser" placeholder="请选择审核人" disabled clearable filterable>
            <el-option v-for="dict in auditUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="auditTime">
          <el-date-picker clearable size="small" v-model="form.auditTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择审核日期" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态" disabled>
            <el-option v-for="dict in auditStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditComment">
          <el-input type="textarea" v-model="form.auditComment" placeholder="请输入审核意见" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" disabled />
        </el-form-item>
        <el-divider content-position="center">入库申请明细信息</el-divider>
        <el-table :data="wmsInWarehouseApplyDetailList" :row-class-name="rowWmsInWarehouseApplyDetailIndex" ref="wmsInWarehouseApplyDetail">
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="物料" prop="materialName" width="300" align="center">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.materialName'" :rules="rules.materialName">
                <el-input v-model="scope.row.materialName" placeholder="请选择物料" disabled>
                  <el-button slot="append">选择</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="仓库编" prop="warehouseId" width="150">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.warehouseId'" :rules="rules.warehouseId">
                <el-select v-model="scope.row.warehouseId" placeholder="请选择仓库"disabled>
                  <el-option v-for="dict in warehouseIdOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="whLocationId" width="150">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.whLocationId'" :rules="rules.whLocationId">
                <el-select v-model="scope.row.whLocationId" placeholder="请选择库位" disabled>
                  <el-option v-for="dict in scope.row.whLocationOptions" :key="dict.id" :label="dict.name" :value="dict.id" />
                </el-select>
              </el-form-item>
            </template>   
          </el-table-column>
          <el-table-column label="库区" prop="whRegionId" width="150">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.whRegionId'" :rules="rules.whRegionId">
                <el-select v-model="scope.row.whRegionId" placeholder="请选择库区" disabled>
                  <el-option v-for="dict in scope.row.whRegionOptions" :key="dict.id" :label="dict.name" :value="dict.id" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="到货数量" prop="totalQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.totalQuantity'" :rules="rules.totalQuantity">
                <el-input v-model="scope.row.totalQuantity" placeholder="请输入到货数量" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="入库数量" prop="inQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.inQuantity'" :rules="rules.inQuantity">
                <el-input v-model="scope.row.inQuantity" placeholder="请输入入库数量" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel">
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecification">
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit">
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNo" width="150">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.batchNo'" :rules="rules.batchNo">
                <el-input v-model="scope.row.batchNo" placeholder="请输入生产批号" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" prop="productDate" width="240">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.productDate'" :rules="rules.productDate">
                <el-date-picker disabled clearable v-model="scope.row.productDate" type="date" value-format="yyyy-MM-dd"
                  placeholder="请选择生产日期" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="生产单位" prop="manufacturer" width="150">
            <template slot-scope="scope">
              <el-form-item class="xzwl" size="small"
                :prop="'wmsInWarehouseApplyDetailList.' + scope.$index + '.manufacturer'" :rules="rules.manufacturer">
                <el-input v-model="scope.row.manufacturer" placeholder="请输入生产单位" disabled />
              </el-form-item>
            </template>
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
import { listInWarahouseApplyAudit, auditInWarahouseApply, getInWarahouseApply, listWarehouseRegion, listWarehouseLocation  } from "@/api/wmsApply/inWarahouseApply";

export default {
  name: "InWarahouseApplyAudit",
  components: {
  },
  data() {
    let checkAuditComment = (rule, value, callback) => {
      if (this.form.auditStatus == '0') {
        if (!value) {
          callback(new Error('请输入审核意见'));
        }
      }
      callback();
    }
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 入库申请表格数据
      inWarahouseApplyList: [],
      // 入库申请明细表格数据
      wmsInWarehouseApplyDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 业务类型字典
      bizTypeOptions: [],
      // 供应商字典
      supplierIdOptions: [],
      // 合同类型字典
      contractTypeOptions: [],
      // 申请类型字典
      applyTypeOptions: [],
      // 申请人字典
      applyUserOptions: [],
      // 申请状态字典
      applyStatusOptions: [],
      // 审核人字典
      auditUserOptions: [],
      // 审核状态字典
      auditStatusOptions: [],
      // 单据状态字典
      billStatusOptions: [],
      // 仓库
      warehouseIdOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNo: null,
        bizBillId: null,
        bizType: null,
        supplierId: null,
        contractId: null,
        contractType: null,
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
        auditComment: [
          {
            validator: checkAuditComment, trigger: 'blur'
          },
          { max: 100, message: "审核意见最多100个字符", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    'wmsInWarehouseApplyDetailList': {
      handler(newVal, oldVal) {
        this.form.wmsInWarehouseApplyDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getList();
    this.getDicts("in_warehouse_status").then(response => {
      this.bizTypeOptions = response.data;
    });
    this.getQueryData("query_supplier").then(res => {
      this.supplierIdOptions = res.data;
    });
    this.getDicts("contract_type").then(response => {
      this.contractTypeOptions = response.data;
    });
    this.getDicts("wms_apply_type").then(response => {
      this.applyTypeOptions = response.data;
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
    this.getDicts("in_warehouse_status").then(response => {
      this.billStatusOptions = response.data;
    });
    this.getQueryData("query_warehouse").then(res => {
      this.warehouseIdOptions = res.data.map(item => ({
        dictValue: item.dictValue * 1,
        dictLabel: item.dictLabel,
      }));
    });
  },
  methods: {
    /** 查询入库申请列表 */
    getList() {
      this.loading = true;
      listInWarahouseApplyAudit(this.queryParams).then(response => {
        this.inWarahouseApplyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 业务类型字典翻译
    bizTypeFormat(row, column) {
      return this.selectDictLabel(this.bizTypeOptions, row.bizType);
    },
    // 供应商字典翻译
    supplierIdFormat(row, column) {
      return this.selectDictLabel(this.supplierIdOptions, row.supplierId);
    },
    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      return this.selectDictLabel(this.contractTypeOptions, row.contractType);
    },
    // 申请类型字典翻译
    applyTypeFormat(row, column) {
      return this.selectDictLabel(this.applyTypeOptions, row.applyType);
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
    // 单据状态字典翻译
    billStatusFormat(row, column) {
      return this.selectDictLabel(this.billStatusOptions, row.billStatus);
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
        bizBillId: null,
        bizType: null,
        supplierId: null,
        contractId: null,
        contractType: null,
        applyType: null,
        applyUser: null,
        applyTime: null,
        applyStatus: '0',
        auditUser: null,
        auditTime: null,
        auditStatus: '0',
        auditComment: null,
        remark: null,
        billStatus: '0',
        wmsInWarehouseApplyDetailList: [],
      };
      this.wmsInWarehouseApplyDetailList = [];
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
    //获取库区选项
    getWhRegionOpts(val, index) {
      let queryParams = {
        warehouseId: val,
      }
      listWarehouseRegion(queryParams).then(res => {
        this.wmsInWarehouseApplyDetailList[index].whRegionOptions = res.rows;
      });
    },
    //获取库位选项
    getWhLocationOpts(val, index) {
      let queryParams = {
        regionId: val,
      }
      listWarehouseLocation(queryParams).then(res => {
        this.wmsInWarehouseApplyDetailList[index].whLocationOptions = res.rows;
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInWarahouseApply(id).then(response => {
        this.form = response.data;
        response.data.wmsInWarehouseApplyDetailList.forEach(item => {
          let obj = {
            whRegionOptions: [],
            whLocationOptions: [],
          };
          let detail = Object.assign(obj, item);
          this.wmsInWarehouseApplyDetailList.push(detail);
        })
        this.wmsInWarehouseApplyDetailList.forEach((item, index) => {
          this.getWhRegionOpts(item.warehouseId, index);
          this.getWhLocationOpts(item.whRegionId, index);
        })
        this.open = true;
        this.title = "审核入库申请";
      });
    },
    //审核按钮
    submitForm(status) {
      this.form.auditStatus = status;
      this.$refs["form"].validate(valid => {
        if (valid) {
          auditInWarahouseApply(this.form).then(response => {
            this.msgSuccess("审核成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 入库申请明细添加按钮操作 */
    handleAddWmsInWarehouseApplyDetail() {
      let obj = {};
      obj.materialId = "";
      obj.warehouseId = "";
      obj.whLocationId = "";
      obj.whRegionId = "";
      obj.totalQuantity = "";
      obj.inQuantity = "";
      obj.serialNo = "";
      obj.batchNo = "";
      obj.productDate = "";
      obj.manufacturer = "";
      this.wmsInWarehouseApplyDetailList.push(obj);
    },
    /** 入库申请明细序号 */
    rowWmsInWarehouseApplyDetailIndex({ row, rowIndex }) {
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