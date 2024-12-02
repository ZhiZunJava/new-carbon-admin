<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="退货单号" prop="returnNo">
        <el-input v-model="queryParams.returnNo" placeholder="请输入退货单号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="发货单号" prop="deliveryNo">
        <el-input v-model="queryParams.deliveryNo" placeholder="请输入发货单号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="合同编号" prop="contractNo">
        <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerId">
        <el-select v-model="queryParams.customerId" placeholder="请选择客户id" clearable filterable size="small">
          <el-option v-for="dict in customerIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="退货日期">
        <el-date-picker v-model="daterangeReturnDate" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="退款金额" prop="returnAmount">
        <el-input v-model="queryParams.returnAmount" placeholder="请输入退款金额" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="入库状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择入库状态" clearable filterable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
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
          v-hasPermi="['sale:return:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['sale:return:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['sale:return:remove']">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['sale:return:export']">导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="returnList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="退货单号" align="center" prop="returnNo" />
      <el-table-column label="发货单号" align="center" prop="deliveryNo" />
      <el-table-column label="合同编号" align="center" prop="contractNo" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="退货日期" align="center" prop="returnDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.returnDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center" prop="returnAmount" />
      <el-table-column label="入库状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['sale:return:edit']" v-show="scope.row.status == '0'">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['sale:return:remove']" v-show="scope.row.status == '0'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改销售退货对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-form-item label="退货单号" prop="returnNo">
          <el-input v-model="form.returnNo" placeholder="退货单号系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="发货单号" prop="deliveryNo">
          <el-input v-model="form.deliveryNo" placeholder="请选择发货单号" disabled>
            <el-button slot="append" @click="openDeliverySelect()">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo" placeholder="合同编号系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerId">
          <el-input v-model="form.customerName" placeholder="客户名称系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="退货日期" prop="returnDate">
          <el-date-picker clearable size="small" v-model="form.returnDate" type="date" value-format="yyyy-MM-dd"
            placeholder="选择退货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退款金额" prop="returnAmount">
          <el-input v-model="form.returnAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="退款原因" prop="returnReason">
          <el-input v-model="form.returnReason" placeholder="请输入退款原因" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-divider content-position="center">退货明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini"
              @click="handleAddScmSaleReturnDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="handleDeleteScmSaleReturnDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="scmSaleReturnDetailList" :row-class-name="rowScmSaleReturnDetailIndex"
          @selection-change="handleScmSaleReturnDetailSelectionChange" ref="scmSaleReturnDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="物料" prop="materialName" width="200">
          </el-table-column>
          <el-table-column label="型号" prop="materialModel"></el-table-column>
          <el-table-column label="规格" prop="materialSpecification"></el-table-column>
          <el-table-column label="单位" prop="materialUnit"></el-table-column>
          <el-table-column label="价格" prop="price" width="150">
          </el-table-column>
          <el-table-column label="订货数量" prop="bookQuantity" width="150">
          </el-table-column>
          <el-table-column label="发货数量" prop="deliveryQuantity" width="150">
          </el-table-column>
          <el-table-column label="退货数量" prop="returnQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleReturnDetailList.' + scope.$index + '.returnQuantity'"
                :rules="rules.returnQuantity">
                <el-input v-model.number="scope.row.returnQuantity" placeholder="请输入退货数量" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="detailRemark" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'scmSaleReturnDetailList.' + scope.$index + '.detailRemark'"
                :rules="rules.detailRemark">
                <el-input v-model="scope.row.detailRemark" placeholder="请输入备注" />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <DeliverySelect status="2" :open="deliverySelectOpen" @onDeliveryCancel="cancelDeliverySelect"
      @onDeliverySelected="handleDeliverySelected"></DeliverySelect>
  </div>
</template>

<script>
import { listReturn, getReturn, delReturn, addReturn, updateReturn, exportReturn } from "@/api/sale/return";
import DeliverySelect from "@/components/Sale/DeliverySelect";
import { listReturnDetail } from "../../../api/sale/return";

export default {
  name: "SaleReturn",
  components: {
    DeliverySelect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedScmSaleReturnDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 销售退货表格数据
      returnList: [],
      // 退货明细表格数据
      scmSaleReturnDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 客户id字典
      customerIdOptions: [],
      // 退货日期时间范围
      daterangeReturnDate: [],
      // 入库状态 0未入库 1已入库 2入库中字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        returnNo: null,
        deliveryNo: null,
        contractNo: null,
        customerId: null,
        returnDate: null,
        returnAmount: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        returnReason: [{
          max: 20,
          message: "长度不能超过20个字符",
          trigger: "blur"
        }],
        deliveryNo: [{
          required: true,
          message: "请选择发货单号",
          trigger: "blur"
        }],
        returnDate: [{
          required: true,
          message: "退货日期不能为空",
          trigger: "blur"
        }],
        returnQuantity: [{
          required: true,
          message: "退货数量不能为空",
          trigger: "blur"
        },
        {
          type: 'number',
          message: '退货数量必须为数字值'
        },
        {
          type: "number",
          min: 1,
          message: "退货数量必须大于0",
          trigger: "blur"
        },
        ],
      },
      deliverySelectOpen: false
    };
  },
  created() {
    this.getList();
    this.getQueryData("query_customer").then(res => {
      this.customerIdOptions = res.data;
    });
    this.getDicts("in_warehouse_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  watch: {
    'scmSaleReturnDetailList': {
      handler(newVal, oldVal) {
        this.form.scmSaleReturnDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询销售退货列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeReturnDate && '' != this.daterangeReturnDate) {
        this.queryParams.params["beginReturnDate"] = this.daterangeReturnDate[0];
        this.queryParams.params["endReturnDate"] = this.daterangeReturnDate[1];
      }
      listReturn(this.queryParams).then(response => {
        this.returnList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 客户id字典翻译
    customerIdFormat(row, column) {
      return this.selectDictLabel(this.customerIdOptions, row.customerId);
    },
    // 入库状态 0未入库 1已入库 2入库中字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        returnNo: null,
        deliveryId: null,
        deliveryNo: null,
        contractId: null,
        contractNo: null,
        customerId: null,
        returnDate: null,
        returnAmount: null,
        returnReason: null,
        status: "0",
        createBy: null,
        createTime: null,
        remark: null,
        scmSaleReturnDetailList: [],
      };
      this.scmSaleReturnDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeReturnDate = [];
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
      this.title = "添加销售退货";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReturn(id).then(response => {
        this.form = response.data;
        this.scmSaleReturnDetailList = response.data.scmSaleReturnDetailList;
        this.open = true;
        this.title = "修改销售退货";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (!this.scmSaleReturnDetailList || this.scmSaleReturnDetailList.length == 0) {
            this.msgError('请选择退货物料');
            return false;
          }
          for (let detail of this.scmSaleReturnDetailList) {
            if (detail.returnQuantity > detail.deliveryQuantity) {
              this.msgError('退货物料[' + detail.materialName + ']退货数量不能大于发货数量');
              return false;
            }
          }

          if (this.form.id != null) {
            updateReturn(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReturn(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除销售退货编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delReturn(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 退货明细序号 */
    rowScmSaleReturnDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 退货明细添加按钮操作 */
    handleAddScmSaleReturnDetail() {
      let obj = {};
      obj.materialId = "";
      obj.price = "";
      obj.bookQuantity = "";
      obj.deliveryQuantity = "";
      obj.returnQuantity = "";
      obj.detailRemark = "";
      this.scmSaleReturnDetailList.push(obj);
    },
    /** 退货明细删除按钮操作 */
    handleDeleteScmSaleReturnDetail() {
      if (this.checkedScmSaleReturnDetail.length == 0) {
        this.$alert("请先选择要删除的退货明细数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.scmSaleReturnDetailList.splice(this.checkedScmSaleReturnDetail[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleScmSaleReturnDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.scmSaleReturnDetail.clearSelection();
        this.$refs.scmSaleReturnDetail.toggleRowSelection(selection.pop());
      } else {
        this.checkedScmSaleReturnDetail = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有销售退货数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportReturn(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    openDeliverySelect() {
      this.deliverySelectOpen = true;
    },
    cancelDeliverySelect() {
      this.deliverySelectOpen = false;
    },
    handleDeliverySelected(lists) {
      if (lists && lists.length > 0) {
        const list = lists[0];
        this.form.deliveryId = list.id;
        this.form.deliveryNo = list.deliveryNo;
        this.form.contractId = list.contractId;
        this.form.contractNo = list.contractNo;
        this.form.customerId = list.customerId;
        this.form.customerName = list.customerName;
        // 根据发货单id获取detailList
        listReturnDetail(list.id).then(res => {
          this.scmSaleReturnDetailList = res.data;
        })
        this.cancelDeliverySelect()
      }
    },
  }
};
</script>