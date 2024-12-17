<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流水号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" placeholder="请输入流水号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="计划号" prop="planId">
        <el-input v-model="queryParams.planId" placeholder="请输入计划号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="物料" prop="materialName">
        <el-input v-model="queryParams.materialName" placeholder="请输入物料" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="BOM" prop="bomId">
        <el-select v-model="queryParams.bomId" placeholder="请选择BOM" clearable filterable size="small">
          <el-option v-for="dict in bomIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="生产线" prop="productLineId">
        <el-select v-model="queryParams.productLineId" placeholder="请选择生产线" clearable filterable size="small">
          <el-option v-for="dict in productLineIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="工艺" prop="processId">
        <el-select v-model="queryParams.processId" placeholder="请选择工艺" clearable filterable size="small">
          <el-option v-for="dict in processIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目" prop="projectId">
        <el-select v-model="queryParams.projectId" placeholder="请选择项目" clearable filterable size="small">
          <el-option v-for="dict in projectIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker v-model="daterangeProductDate" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="交货日期">
        <el-date-picker v-model="daterangeDeliveryDate" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable size="small">
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
          v-hasPermi="['mesPlan:productSchedule:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['mesPlan:productSchedule:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['mesPlan:productSchedule:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productScheduleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="流水号" align="center" prop="serialNo" />
      <el-table-column label="计划号" align="center" prop="planNo" />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="型号" align="center" prop="materialModel" />
      <el-table-column label="规格" align="center" prop="materialSpecification" />
      <el-table-column label="单位" align="center" prop="materialUnit" />

      <el-table-column label="BOM" align="center" prop="bomId" :formatter="bomIdFormat" />
      <el-table-column label="生产线" align="center" prop="productLineId" :formatter="productLineIdFormat" />
      <el-table-column label="工艺" align="center" prop="processId" :formatter="processIdFormat" />
      <el-table-column label="项目" align="center" prop="projectId" :formatter="projectIdFormat" />
      <el-table-column label="待产数量" align="center" prop="requireQuantity" />
      <el-table-column label="已产数量" align="center" prop="productQuantity" />
      <el-table-column label="生产日期" align="center" prop="productDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.productDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交货日期" align="center" prop="deliveryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="领料状态" align="center" prop="receiveStatus" :formatter="receiveStatusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status != 1" size="mini" type="text" icon="el-icon-thumb"
            @click="handlePublish(scope.row)" v-hasPermi="['mesPlan:productSchedule:remove']">发布</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['mesPlan:productSchedule:edit']">修改</el-button>
          <el-button v-if="scope.row.status != 1" size="mini" type="text" icon="el-icon-delete"
            @click="handleDelete(scope.row)" v-hasPermi="['mesPlan:productSchedule:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改计划排产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-form-item label="计划号" prop="planNo">
          <el-input v-model="form.planNo" placeholder="请选择生产计划" disabled>
            <el-button slot="append" @click="openPlanSelect()">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="请选择项目" clearable filterable disabled>
            <el-option v-for="dict in projectIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请输入产品" disabled />
        </el-form-item>
        <el-form-item label="BOM" prop="bomId">
          <el-select v-model="form.bomId" placeholder="请选择BOM" @change="selectBom" clearable filterable
          :disabled="form.status == 1 ? true : false">
            <el-option v-for="dict in bomIdOptionsB" :key="dict.dictValue" :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产线" prop="productLineId">
          <el-select v-model="form.productLineId" placeholder="请选择生产线" clearable filterable :disabled="form.status == 1 ? true : false">
            <el-option v-for="dict in productLineIdOptionsB" :key="dict.dictValue" :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺" prop="processId">
          <el-select v-model="form.processId" placeholder="请选择工艺" clearable filterable :disabled="form.status == 1 ? true : false">
            <el-option v-for="dict in processIdOptionsB" :key="dict.dictValue" :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="待产数量" prop="requireQuantity">
          <el-input v-model="form.requireQuantity" placeholder="请输入待产数量" disabled />
        </el-form-item>
        <el-form-item label="已产数量" prop="productQuantity">
          <el-input v-model="form.productQuantity" placeholder="请输入已产数量" disabled />
        </el-form-item>
        <el-form-item label="生产日期" prop="productDate">
          <el-date-picker clearable size="small" v-model="form.productDate" type="date" value-format="yyyy-MM-dd"
            placeholder="选择生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker clearable size="small" v-model="form.deliveryDate" type="date" value-format="yyyy-MM-dd"
            placeholder="选择交货日期" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择发布状态" clearable filterable disabled>
            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
       
        <el-divider content-position="center">排产物料信息信息</el-divider>
        <el-table :data="mesProductScheduleMaterialList" :row-class-name="rowMesProductScheduleMaterialIndex"
          ref="mesProductScheduleMaterial">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="物料" prop="materialName" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductScheduleMaterialList.' + scope.$index + '.materialName'"
                :rules="rules.materialId">
                <el-input v-model="scope.row.materialName" placeholder="请输入物料档案编号" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel">
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecification">
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit">
          </el-table-column>
          <el-table-column label="需求数量" prop="requireQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductScheduleMaterialList.' + scope.$index + '.requireQuantity'"
                :rules="rules.requireQuantity">
                <el-input v-model="scope.row.requireQuantity" placeholder="" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="已用数量" prop="usageQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductScheduleMaterialList.' + scope.$index + '.usageQuantity'"
                :rules="rules.usageQuantity">
                <el-input v-model="scope.row.usageQuantity" placeholder="" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="剩余数量" prop="leftQuantity" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductScheduleMaterialList.' + scope.$index + '.leftQuantity'"
                :rules="rules.leftQuantity">
                <el-input v-model="scope.row.leftQuantity" placeholder="" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductScheduleMaterialList.' + scope.$index + '.remark'" :rules="rules.remark">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" disabled />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="form.status != 1" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <product-plan-select :open="openPlan" @onClose="closePlanSelect" @onSelected="selectPlan"></product-plan-select>
  </div>
</template>

<script>
import { listProductSchedule, getProductSchedule, delProductSchedule, addProductSchedule, updateProductSchedule, exportProductSchedule } from "@/api/mesPlan/productSchedule";
import productPlanSelect from '@/components/product/ProductPlanSelect';
import { getMesBom, listMesBom } from "../../../api/mesPlan/mesBom";
import { listFactoryModel } from "../../../api/mesModel/factoryModel";
import { listProcessModel } from "../../../api/mesModel/processModel";
import { publishProductSchedule } from "../../../api/mesPlan/productSchedule";

export default {
  name: "ProductSchedule",
  components: {
    productPlanSelect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesProductScheduleMaterial: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 计划排产表格数据
      productScheduleList: [],
      // 排产物料信息表格数据
      mesProductScheduleMaterialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openPlan: false,
      // BOM单字典
      bomIdOptions: [],
      bomIdOptionsB: [],
      // 生产线字典
      productLineIdOptions: [],
      productLineIdOptionsB: [],
      // 工艺字典
      processIdOptions: [],
      processIdOptionsB: [],
      // 项目字典
      projectIdOptions: [],
      // 生产日期时间范围
      daterangeProductDate: [],
      // 交货日期时间范围
      daterangeDeliveryDate: [],
      // 发布状态字典
      statusOptions: [],
      // 领料状态字典
      receiveStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planId: null,
        materialName: null,
        bomId: null,
        productLineId: null,
        processId: null,
        projectId: null,
        productDate: null,
        deliveryDate: null,
        status: null,
        receiveStatus: null,
        serialNo: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planId: [
          { required: true, message: "计划号不能为空", trigger: "blur" }
        ],
        bomId: [
          { required: true, message: "BOM单不能为空", trigger: "change" }
        ],
        productLineId: [
          { required: true, message: "生产线不能为空", trigger: "blur" }
        ],
        processId: [
          { required: true, message: "工艺不能为空", trigger: "blur" }
        ],
        requireQuantity: [
          { required: true, message: "待产数量不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getQueryData("query_bom").then(res => {
      this.bomIdOptions = res.data;
    });
    this.getQueryData("query_product_line").then(res => {
      this.productLineIdOptions = res.data;
    });
    this.getQueryData("process_query").then(res => {
      this.processIdOptions = res.data;
    });
    this.getQueryData("query_project").then(res => {
      this.projectIdOptions = res.data;
    });
    this.getDicts("product_schedule_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("schedule_requisition_status").then(response => {
      this.receiveStatusOptions = response.data;
    });
  },
  watch: {
    'mesProductScheduleMaterialList': {
      handler(newVal, oldVal) {
        this.form.mesProductScheduleMaterialList = newVal;
      },
      immediate: true,
      deep: true,
    },
    'form.materialId': {
      handler(newVal, oldVal) {
        this.bomIdOptionsB = [];
        this.productLineIdOptionsB = [];
        this.processIdOptionsB = [];

        if (newVal) {
          listMesBom({ productId: newVal }).then(res => {
            this.bomIdOptionsB = res.rows.map(item => {
              return {
                dictLabel: item.name,
                dictValue: item.id
              };
            });
          });
          listFactoryModel({ materialId: newVal }).then(res => {
            this.productLineIdOptionsB = res.rows.map(item => {
              return {
                dictLabel: item.productLineName,
                dictValue: item.id
              };
            });
          });
          listProcessModel({ materialId: newVal }).then(res => {
            this.processIdOptionsB = res.rows.map(item => {
              return {
                dictLabel: item.processName,
                dictValue: item.id
              };
            });
          });
        }
      },
      immediate: true
    },
    'form.requireQuantity': {
      handler(newVal, oldVal) {
        this.sunUsage()
      },
      immediate: true
    }
  },
  methods: {
    handlePublish(row){
      publishProductSchedule({id: row.id}).then(res=>{
        this.msgSuccess('发布成功');
        this.getList();
      })
    },
    sunUsage() {
      this.mesProductScheduleMaterialList.forEach(item => {
        const all = item.usage * this.form.requireQuantity;
        item.requireQuantity = all;
      })
    },
    // 打开选择生产计划
    openPlanSelect() {
      this.openPlan = true;
    },
    closePlanSelect() {
      this.openPlan = false;
    },
    selectPlan(data) {
      this.form.planId = data.planId;
      this.form.planNo = data.planNo;
      this.form.materialId = data.materialId;
      this.form.materialName = data.materialName;
      this.form.materialSpecification = data.materialSpecification;
      this.form.materialModel = data.materialModel;
      this.form.materialUnit = data.materialUnit;
      this.form.projectId = data.projectId;
      this.form.requireQuantity = data.quantity;
      this.form.productDate = data.productDate;
      this.form.deliveryDate = data.deliveryDate;
      this.form.mesProductScheduleMaterialList = []
      this.form.bomId = null;
      this.form.productLineId = null;
      this.form.processId = null;
      this.closePlanSelect();
    },
    selectBom(data) {
      this.mesProductScheduleMaterialList = [];
      if (data) {
        getMesBom(data).then(response => {
          const val = response.data.mesProductBomDetailList;
          val.forEach(item => {
            let obj = {};
            obj.materialId = item.materialId;
            obj.materialCode = item.materialCode;
            obj.materialName = item.materialName;
            obj.materialSpecification = item.materialSpecification;
            obj.materialModel = item.materialModel;
            obj.materialUnit = item.materialUnit;
            obj.usage = item.usage;
            this.mesProductScheduleMaterialList.push(obj);
            this.sunUsage()
          })
        })
      }
    },
    /** 查询计划排产列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeProductDate && '' != this.daterangeProductDate) {
        this.queryParams.params["beginProductDate"] = this.daterangeProductDate[0];
        this.queryParams.params["endProductDate"] = this.daterangeProductDate[1];
      }
      if (null != this.daterangeDeliveryDate && '' != this.daterangeDeliveryDate) {
        this.queryParams.params["beginDeliveryDate"] = this.daterangeDeliveryDate[0];
        this.queryParams.params["endDeliveryDate"] = this.daterangeDeliveryDate[1];
      }
      listProductSchedule(this.queryParams).then(response => {
        this.productScheduleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // BOM单字典翻译
    bomIdFormat(row, column) {
      return this.selectDictLabel(this.bomIdOptions, row.bomId);
    },
    // 生产线字典翻译
    productLineIdFormat(row, column) {
      return this.selectDictLabel(this.productLineIdOptions, row.productLineId);
    },
    // 工艺字典翻译
    processIdFormat(row, column) {
      return this.selectDictLabel(this.processIdOptions, row.processId);
    },
    // 项目字典翻译
    projectIdFormat(row, column) {
      return this.selectDictLabel(this.projectIdOptions, row.projectId);
    },
    // 发布状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 领料状态字典翻译
    receiveStatusFormat(row, column) {
      return this.selectDictLabel(this.receiveStatusOptions, row.receiveStatus);
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
        planId: null,
        orderId: null,
        materialId: null,
        bomId: null,
        productLineId: null,
        processId: null,
        projectId: null,
        requireQuantity: null,
        productQuantity: null,
        productDate: null,
        deliveryDate: null,
        remark: null,
        status: null,
        receiveStatus: null,
        serialNo: null,
        mesProductScheduleMaterialList: [],
      };
      this.mesProductScheduleMaterialList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeProductDate = [];
      this.daterangeDeliveryDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      let filter = selection.filter(item => item.status != '1')
      this.ids = filter.map(item => item.id)
      this.single = filter.length !== 1
      this.multiple = !filter.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加计划排产";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProductSchedule(id).then(response => {
        this.form = response.data;
        this.mesProductScheduleMaterialList = response.data.mesProductScheduleMaterialList;
        getMesBom(this.form.bomId).then(res=> {
          const val = res.data.mesProductBomDetailList;
          this.mesProductScheduleMaterialList.forEach(item => {
            let id = item.materialId;
            let list = val.filter(item => item.materialId == id);
            item.usage = list[0].usage;
          })
          this.sunUsage()
        })
        this.open = true;
        this.title = "修改计划排产";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.id != null) {
            updateProductSchedule(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProductSchedule(this.form).then(response => {
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
      this.$confirm('是否确认删除计划排产编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delProductSchedule(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 排产物料信息序号 */
    rowMesProductScheduleMaterialIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 排产物料信息添加按钮操作 */
    handleAddMesProductScheduleMaterial() {
      let obj = {};
      obj.materialId = "";
      obj.requireQuantity = "";
      obj.usageQuantity = "";
      obj.leftQuantity = "";
      obj.remark = "";
      this.mesProductScheduleMaterialList.push(obj);
    },
    /** 排产物料信息删除按钮操作 */
    handleDeleteMesProductScheduleMaterial() {
      if (this.checkedMesProductScheduleMaterial.length == 0) {
        this.$alert("请先选择要删除的排产物料信息数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.mesProductScheduleMaterialList.splice(this.checkedMesProductScheduleMaterial[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleMesProductScheduleMaterialSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.mesProductScheduleMaterial.clearSelection();
        this.$refs.mesProductScheduleMaterial.toggleRowSelection(selection.pop());
      } else {
        this.checkedMesProductScheduleMaterial = selection;
      }
    },
  }
};
</script>