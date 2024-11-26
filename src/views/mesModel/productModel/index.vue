<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模型名称" prop="modelName">
        <el-input v-model="queryParams.modelName" placeholder="请输入模型名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['mesModel:productModel:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['mesModel:productModel:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['mesModel:productModel:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['mesModel:productModel:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productModelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="模型名称" align="center" prop="modelName" />
      <el-table-column label="产品" align="center" prop="productName" />
      <el-table-column label="型号" align="center" prop="productModel" />
      <el-table-column label="规格" align="center" prop="productSpecification" />
      <el-table-column label="单位" align="center" prop="productUnit" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['mesModel:productModel:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['mesModel:productModel:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改产品建模对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="0" class="mb8">
          <el-col :span="8">
            <el-form-item label="产品" prop="productName" disable>
              <el-input v-model="form.productName" placeholder="选择产品名称" disabled>
                <el-button slot="append" @click="OpenMaterial('product')">选择</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品型号" prop="productModel">
              <el-input v-model="form.productModel" placeholder="请输入产品型号" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品规格" prop="productSpecification">
              <el-input v-model="form.productSpecification" placeholder="请输入产品规格" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模型名称" prop="modelName">
              <el-input v-model="form.modelName" placeholder="请输入模型名称" />
            </el-form-item>

          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <Editor v-model="form.remark" :min-height="200"></Editor>
        </el-form-item>
        <el-divider content-position="center">产品模型明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini"
              @click="handleAddMesProductModelDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="handleDeleteMesProductModelDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="mesProductModelDetailList" :row-class-name="rowMesProductModelDetailIndex"
          @selection-change="handleMesProductModelDetailSelectionChange" ref="mesProductModelDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="物料" prop="materialName" align="center">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductModelDetailList.' + scope.$index + '.materialName'"
                :rules="rules.materialName">
                <el-input v-model="scope.row.materialName" placeholder="请选择物料" disabled>
                  <el-button slot="append" @click="OpenMaterial('material', scope.$index)">选择</el-button>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="150">
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecification" width="150">
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="150">
          </el-table-column>
          <el-table-column label="备注" prop="detailRemark" width="150">
            <template slot-scope="scope">
              <el-form-item :prop="'mesProductModelDetailList.' + scope.$index + '.detailRemark'"
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

    <MaterialSelect :open="materialShow" @onCancel="CloseMaterial" @onSelected="SelectMaterial" />
  </div>
</template>

<script>
import { listProductModel, getProductModel, delProductModel, addProductModel, updateProductModel, exportProductModel } from "@/api/mesModel/productModel";
import MaterialSelect from "../../../components/Material/MaterialSelect.vue";
import Editor from '@/components/MyEditor';

export default {
  name: "ProductModel",
  components: {
    MaterialSelect,
    Editor
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedMesProductModelDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 产品建模表格数据
      productModelList: [],
      // 产品模型明细表格数据
      mesProductModelDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        modelName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        modelName: [{ required: true, message: "模型名称不能为空", trigger: "blur" }]
      },
      materialShow: false,
      materialType: 'product', // product or material
      materialTableIndex: 0,
    };
  },
  created() {
    this.getList();
  },
  watch: {
    'mesProductModelDetailList': {
      handler(newVal, oldVal) {
        this.form.mesProductModelDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    /** 查询产品建模列表 */
    getList() {
      this.loading = true;
      listProductModel(this.queryParams).then(response => {
        this.productModelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        materialId: null,
        modelName: null,
        remark: null,
        mesProductModelDetailList: [],
      };
      this.mesProductModelDetailList = [];
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
      this.title = "添加产品建模";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProductModel(id).then(response => {
        this.form = response.data;
        this.mesProductModelDetailList = response.data.mesProductModelDetailList;
        this.open = true;
        this.title = "修改产品建模";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.id != null) {
            updateProductModel(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProductModel(this.form).then(response => {
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
      this.$confirm('是否确认删除产品建模编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delProductModel(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 产品模型明细序号 */
    rowMesProductModelDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 产品模型明细添加按钮操作 */
    handleAddMesProductModelDetail() {
      let obj = {};
      obj.materialName = "";
      obj.materialModel = "";
      obj.materialSpecification = "";
      obj.materialUnit = "";
      obj.detailRemark = "";
      this.mesProductModelDetailList.push(obj);
    },
    /** 产品模型明细删除按钮操作 */
    handleDeleteMesProductModelDetail() {
      if (this.checkedMesProductModelDetail.length == 0) {
        this.$alert("请先选择要删除的产品模型明细数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.mesProductModelDetailList.splice(this.checkedMesProductModelDetail[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleMesProductModelDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.mesProductModelDetail.clearSelection();
        this.$refs.mesProductModelDetail.toggleRowSelection(selection.pop());
      } else {
        this.checkedMesProductModelDetail = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有产品建模数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportProductModel(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    OpenMaterial(type, index) {
      this.materialType = type;
      if (type === 'material') this.materialTableIndex = index;
      this.materialShow = true;
    },
    CloseMaterial() {
      this.materialShow = false;
    },
    SelectMaterial(data) {
      const row = data[0];

      if (this.materialType === 'product') {
        this.form.productName = row.name;
        this.form.productModel = row.model;
        this.form.productSpecification = row.specification;
      } else if (this.materialType === 'material') {
        let obj = this.mesProductModelDetailList[this.materialTableIndex];
        obj.materialName = row.name;
        obj.materialModel = row.model;
        obj.materialSpecification = row.specification;
        obj.materialUnit = row.unit;
      }
      this.CloseMaterial()
    }
  }
};
</script>