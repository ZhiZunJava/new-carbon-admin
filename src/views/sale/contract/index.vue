<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编号" prop="contractNo">
        <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="业务员" prop="workStaff">
        <el-select v-model="queryParams.workStaff" placeholder="请选择业务员" clearable filterable size="small">
          <el-option v-for="dict in workStaffOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" prop="customerId">
        <el-select v-model="queryParams.customerId" placeholder="请选择客户名称" clearable filterable size="small">
          <el-option v-for="dict in customerIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="交货日期" prop="deliveryDate">
        <el-date-picker v-model="daterangeDeliveryDate" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="送货方式" prop="deliveryType">
        <el-select v-model="queryParams.deliveryType" placeholder="请选择送货方式" clearable filterable size="small">
          <el-option v-for="dict in deliveryTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="签订日期" prop="signDate">
        <el-date-picker v-model="daterangeSignDate" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-select v-model="queryParams.applyUser" placeholder="请选择申请人" clearable filterable size="small">
          <el-option v-for="dict in applyUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="applyTime">
        <el-date-picker v-model="daterangeApplyTime" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
      <el-form-item label="审核时间" prop="auditTime">
        <el-date-picker v-model="daterangeAuditTime" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['sale:contract:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['sale:contract:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['sale:contract:remove']">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['sale:contract:export']">导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="订单编号" align="center" prop="orderNo" />
      <el-table-column label="客户名称" align="center" prop="customerId" :formatter="customerIdFormat" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="联系方式" align="center" prop="contactTel" />
      <el-table-column label="合同金额" align="center" prop="contractAmount" />
      <el-table-column label="签订日期" align="center" prop="signDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applyUser" :formatter="applyUserFormat" />
      <el-table-column label="申请时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="applyStatus" :formatter="applyStatusFormat" />
      <el-table-column label="审核人" align="center" prop="auditUser" :formatter="auditUserFormat" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus" :formatter="auditStatusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['sale:contract:edit']">修改</el-button>
          <el-button v-if="scope.row.auditStatus != '1' && scope.row.applyStatus != '1'" size="mini" type="text"
            icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['sale:contract:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改销售合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="合同编号系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请选择订单" disabled>
            <el-button slot="append" @click="openOrderSelect()">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="客户名称选择后自动生成" disabled />
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable size="small" v-model="form.deliveryDate" type="date" value-format="yyyy-MM-dd"
            placeholder="交货日期选择后自动生成" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="送货方式" prop="deliveryType">
          <el-select v-model="form.deliveryType" placeholder="请选择送货方式" clearable filterable>
            <el-option v-for="dict in deliveryTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收货地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contactTel">
          <el-input v-model="form.contactTel" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="签订日期" prop="signDate">
          <el-date-picker clearable size="small" v-model="form.signDate" type="date" value-format="yyyy-MM-dd"
            placeholder="选择签订日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <el-select v-model="form.applyUser" placeholder="请选择申请人" clearable filterable disabled>
            <el-option v-for="dict in applyUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间" prop="applyTime">
          <el-date-picker clearable size="small" v-model="form.applyTime" type="date" value-format="yyyy-MM-dd"
            placeholder="选择申请时间" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" placeholder="请选择申请状态" clearable filterable disabled>
            <el-option v-for="dict in applyStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditUser">
          <el-select v-model="form.auditUser" placeholder="请选择审核人" clearable filterable disabled>
            <el-option v-for="dict in auditUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker clearable size="small" v-model="form.auditTime" type="date" value-format="yyyy-MM-dd"
            placeholder="选择审核时间" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" placeholder="请选择审核状态" clearable filterable disabled>
            <el-option v-for="dict in auditStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditComment">
          <el-input v-model="form.auditComment" placeholder="请输入审核意见" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>

        <el-divider content-position="center">合同明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini"
              @click="handleAddScmSaleContractDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="handleDeleteScmSaleContractDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="scmSaleContractDetailList" :row-class-name="rowScmSaleContractDetailIndex"
          @selection-change="handleScmSaleContractDetailSelectionChange" ref="scmSaleContractDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="产品" prop="materialName" width="300">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractDetailList.' + scope.$index + '.materialName'"
                :rules="rules.materialName">
                <el-input v-model="scope.row.materialName" placeholder="请选择物料" disabled>
                  <el-button v-no-more-click slot="append" @click="openMaterialSelect(scope.$index)">选择</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel"></el-table-column>
          <el-table-column label="规格" prop="materialSpecification"></el-table-column>
          <el-table-column label="单位" prop="materialUnit"></el-table-column>
          <el-table-column label="单价" prop="price" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractDetailList.' + scope.$index + '.price'" :rules="rules.price">
                <el-input v-model="scope.row.price" placeholder="请输入单价" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="订货数量" prop="quantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractDetailList.' + scope.$index + '.quantity'" :rules="rules.quantity">
                <el-input v-model.number="scope.row.quantity" placeholder="请输入订货数量" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="amount" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractDetailList.' + scope.$index + '.amount'" :rules="rules.amount">
                <span>{{ scope.row.quantity * scope.row.price }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="detailRemark" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleContractDetailList.' + scope.$index + '.detailRemark'"
                :rules="rules.detailRemark">
                <el-input v-model="scope.row.detailRemark" placeholder="请输入备注" />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.auditStatus != '1'" type="warning" @click="saveForm">
          保存
        </el-button>
        <el-button v-if="form.auditStatus != '1'" type="primary" @click="submitForm">
          提交
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <OrderSelect :open="orderSelectOpen" @onOrderCancel="cancelOrderSelect" @onOrderSelected="handleOrderSelected">
    </OrderSelect>
    <MaterialSelect :open="materialSelectOpen" @onCancel="cancelMaterialSelect" @onSelected="handleMaterialSelected">
    </MaterialSelect>
  </div>
</template>

<script>
import { listContract, getContract, delContract, addContract, updateContract, exportContract } from "@/api/sale/contract";
import OrderSelect from "@/components/Sale/OrderSelect.vue";
import MaterialSelect from "@/components/Material/MaterialSelect.vue";
import { submitContract } from "../../../api/sale/contract";

export default {
  name: "SaleContract",
  components: {
    OrderSelect,
    MaterialSelect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedScmSaleContractDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 销售合同表格数据
      contractList: [],
      // 合同明细表格数据
      scmSaleContractDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 业务员字典
      workStaffOptions: [],
      // 客户名称字典
      customerIdOptions: [],
      // 送货方式字典
      deliveryTypeOptions: [],
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
        contractNo: null,
        orderNo: null,
        workStaff: null,
        customerId: null,
        deliveryDate: null,
        deliveryType: null,
        signDate: null,
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
        orderNo: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        contactTel: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ],
        deliveryType: [
          { required: true, message: "送货方式不能为空", trigger: "change" }
        ],
        signDate: [
          { required: true, message: "签订日期不能为空", trigger: "blur" }
        ],
      },
      orderSelectOpen: false,
      materialSelectOpen: false,
      materialRowIndex: -1,
      daterangeDeliveryDate: [],
      daterangeSignDate: [],
      daterangeApplyTime: [],
      daterangeAuditTime: []
    };
  },
  created() {
    this.getList();
    this.getQueryData("query_user").then(res => {
      this.workStaffOptions = res.data;
    });
    this.getQueryData("query_customer").then(res => {
      this.customerIdOptions = res.data;
    });
    this.getDicts("scm_delivery_type").then(response => {
      this.deliveryTypeOptions = response.data;
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
    this.getDicts("check_status").then(response => {
      this.auditStatusOptions = response.data;
    });
  },
  watch: {
    'scmSaleContractDetailList': {
      handler(newVal, oldVal) {
        this.form.scmSaleContractDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询销售合同列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeDeliveryDate && '' != this.daterangeDeliveryDate) {
        this.queryParams.params["beginDeliveryDate"] = this.daterangeDeliveryDate[0];
        this.queryParams.params["endDeliveryDate"] = this.daterangeDeliveryDate[1];
      }
      if (null != this.daterangeSignDate && '' != this.daterangeSignDate) {
        this.queryParams.params["beginSignDate"] = this.daterangeSignDate[0];
        this.queryParams.params["endSignDate"] = this.daterangeSignDate[1];
      }
      if (null != this.daterangeApplyTime && '' != this.daterangeApplyTime) {
        this.queryParams.params["beginApplyTime"] = this.daterangeApplyTime[0];
        this.queryParams.params["endApplyTime"] = this.daterangeApplyTime[1];
      }
      if (null != this.daterangeAuditTime && '' != this.daterangeAuditTime) {
        this.queryParams.params["beginAuditTime"] = this.daterangeAuditTime[0];
        this.queryParams.params["endAuditTime"] = this.daterangeAuditTime[1];
      }

      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 业务员字典翻译
    workStaffFormat(row, column) {
      return this.selectDictLabel(this.workStaffOptions, row.workStaff);
    },
    // 客户名称字典翻译
    customerIdFormat(row, column) {
      return this.selectDictLabel(this.customerIdOptions, row.customerId);
    },
    // 送货方式字典翻译
    deliveryTypeFormat(row, column) {
      return this.selectDictLabel(this.deliveryTypeOptions, row.deliveryType);
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
        contractNo: null,
        orderId: null,
        orderNo: null,
        workStaff: null,
        customerId: null,
        deliveryDate: null,
        address: null,
        contact: null,
        contactTel: null,
        deliveryType: null,
        contractAmount: null,
        signDate: null,
        applyUser: null,
        applyTime: null,
        applyStatus: null,
        auditUser: null,
        auditTime: null,
        auditStatus: null,
        auditComment: null,
        remark: null,
        deliveryFlag: null,
        scmSaleContractDetailList: [],
      };
      this.scmSaleContractDetailList = [];
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加销售合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getContract(id).then(response => {
        this.form = response.data;
        this.scmSaleContractDetailList = response.data.scmSaleContractDetailList;
        this.open = true;
        this.title = "修改销售合同";
      });
    },
    /** 提交按钮 */
    saveForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.scmSaleContractDetailList || this.scmSaleContractDetailList.length == 0) {
            this.msgError('请选择合同物料');
            return false;
          }
          if (this.form.id != null) {
            updateContract(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContract(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          submitContract(this.form).then(response => {
            this.msgSuccess("提交成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除销售合同编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delContract(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 合同明细序号 */
    rowScmSaleContractDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 合同明细添加按钮操作 */
    handleAddScmSaleContractDetail() {
      let obj = {};
      obj.materialId = "";
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecification = "";
      obj.materialUnit = "";
      obj.price = "";
      obj.quantity = "";
      obj.amount = "";
      obj.detailRemark = "";
      this.scmSaleContractDetailList.push(obj);
    },
    /** 合同明细删除按钮操作 */
    handleDeleteScmSaleContractDetail() {
      if (this.checkedScmSaleContractDetail.length == 0) {
        this.$alert("请先选择要删除的合同明细数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.scmSaleContractDetailList.splice(this.checkedScmSaleContractDetail[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleScmSaleContractDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.scmSaleContractDetail.clearSelection();
        this.$refs.scmSaleContractDetail.toggleRowSelection(selection.pop());
      } else {
        this.checkedScmSaleContractDetail = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有销售合同数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportContract(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    openOrderSelect() {
      this.orderSelectOpen = true;
    },
    cancelOrderSelect() {
      this.orderSelectOpen = false;
    },
    handleOrderSelected(orders) {
      console.log(orders);
      if (orders && orders.length > 0) {
        const order = orders[0];
        this.form.orderId = order.id;
        this.form.orderNo = order.orderNo;
        this.form.customerId = order.customerId;
        getContract(order.id).then(response => {
          console.log(response)
          let info = response.data;
          this.form.customerName = info.customerName;
          this.form.address = info.address;
          this.form.contact = info.contact;
          this.form.contactTel = info.contactTel;
          this.form.deliveryDate = info.deliveryDate;
          this.scmSaleContractDetailList = info.scmSaleContractDetailList;
        });
      }
      this.orderSelectOpen = false;
    },
    openMaterialSelect(index) {
      this.materialSelectOpen = true;
      this.materialRowIndex = index;
    },
    cancelMaterialSelect() {
      this.materialSelectOpen = false;
    },
    handleMaterialSelected(materials) {
      if (materials && materials.length > 0) {
        const material = materials[0];
        this.scmSaleContractDetailList[this.materialRowIndex].materialId = material.id;
        this.scmSaleContractDetailList[this.materialRowIndex].materialName = material.name;
        this.scmSaleContractDetailList[this.materialRowIndex].materialModel = material.model;
        this.scmSaleContractDetailList[this.materialRowIndex].materialSpecification = material.specification;
        this.scmSaleContractDetailList[this.materialRowIndex].materialUnit = material.unit;
      }
      this.materialSelectOpen = false;
    }
  }
};
</script>