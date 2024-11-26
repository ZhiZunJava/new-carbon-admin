<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="生产线名称" prop="productLineName">
        <el-input v-model="queryParams.productLineName" placeholder="请输入生产线名称" clearable size="small"
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
          v-hasPermi="['scm:factorymodel:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['scm:factorymodel:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['scm:factorymodel:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['scm:factorymodel:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getFactoryModelData"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factorymodelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="生产线名称" align="center" prop="productLineName" />
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['scm:factorymodel:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['scm:factorymodel:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getFactoryModelData" />

    <!-- 添加或修改工厂建模对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
        <el-form-item label="产品" prop="materialName">
          <el-input v-model="form.materialName" placeholder="请选择产品">
            <el-button slot="append" @click="choose">选择</el-button>
          </el-input>
          
        </el-form-item>
        <el-form-item label="生产线名称" prop="productLineName">
          <el-input v-model="form.productLineName" placeholder="请输入生产线名称" />
        </el-form-item>
        <el-form-item label="产品型号" prop="productLinemodel">
          <el-input v-model="form.productLinemodel" placeholder="请输入产品型号" />
        </el-form-item>
        <el-form-item label="产品规格" prop="specification">
          <el-input v-model="form.specification" placeholder="请输入产品规格" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <editor v-model="form.remark" :min-height="192" />
        </el-form-item>
        <el-divider content-position="center">工厂建模明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini"
              @click="handleAddMesFactoryModelDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="handleDeleteMesFactoryModelDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="mesFactoryModelDetailList" :row-class-name="rowMesFactoryModelDetailIndex"
          @selection-change="handleMesFactoryModelDetailSelectionChange" ref="mesFactoryModelDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />
          <el-table-column label="设备" prop="equipmentId" width="200">
            <template slot-scope="scope">
              <el-form-item :prop="'mesFactoryModelDetailList.' + scope.$index + '.equipmentId'" :rules="rules.equipmentId">
                <el-select v-model="scope.row.equipmentId" placeholder="请选择设备" clearable
                  @change="handleEquipChange(scope.row.equipmentId, scope.$index)">
                  <el-option v-for="dict in equipmentIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
                    :value="parseInt(dict.dictValue)"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="编码" align="center" prop="code" />
          <el-table-column label="型号" align="center" prop="model" />
          <el-table-column label="生产日期" align="center" prop="productDate" />
          <el-table-column label="生产批号" align="center" prop="batchNo" />
          <el-table-column label="制造商" align="center" prop="manufacturer" />
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <MaterialSelect :open="materialopen" @onCancel="OpenMaterial" @onSelected="SelectMaterial" />
  </div>
</template>

<script>
import { addFactoryModel, putFactoryModel, exportFactoryModel, listFactoryModel, deleteFactoryModel, getFactoryModel } from '@/api/mesModel/factoryModel'
import MaterialSelect from "@/components/Material/MaterialSelect.vue";
import Editor from '@/components/MyEditor';
import { getEquipmentInfo } from "@/api/baseInfo/equipmentInfo";
export default {
  name: "Factorymodel",
  components: {
    MaterialSelect,
    Editor
  },
  data() {
    return {
      equipmentIdOptions: [],
      materialopen: false,
      loading: true,
      ids: [],
      checkedMesFactoryModelDetail: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      factorymodelList: [],
      // 工厂建模明细表格数据
      mesFactoryModelDetailList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        materialId: undefined,
        productLineName: undefined,
      },
      form: {},
      rules: {
        productLineName: [
          { required: true, message: "生产线名称不能为空", trigger: "blur" }
        ],
      },
      materiallist: null
    };
  },
  created() {
    this.getFactoryModelData();
    this.getQueryData("query_equipment").then(res => {
      this.equipmentIdOptions = res.data;
    });
  },
  watch: {
    'mesFactoryModelDetailList': {
      handler(newVal, oldVal) {
        this.form.mesFactoryModelDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    handleEquipChange(val, index) {
      if (val) {
        let row = this.mesFactoryModelDetailList[index];
        this.getEquipmentDetail(val, row);

      }
    },
    getEquipmentDetail(eqId, row) {
      if (!eqId) {
        return;
      }
      getEquipmentInfo(eqId).then(res => {
        let equip = res.data;
        row.code = equip.code;
        row.model = equip.model;
        row.productDate = equip.productDate;
        row.batchNo = equip.batchNo;
        row.manufacturer = equip.manufacturer;
        console.log(row);
      })
    },
    SelectMaterial(data) {
      this.materiallist = data[0]
      this.form.materialId = this.materiallist.id;
      this.form.materialName = this.materiallist.name
      this.form.productLinemodel = this.materiallist.model
      this.form.specification = this.materiallist.specification
      this.materialopen = false
    },
    choose() {
      this.materialopen = true
    },
    OpenMaterial() {
      this.materialopen = false
    },
    /** 查询工厂建模列表 */
    getFactoryModelData() {
      this.loading = true;
      listFactoryModel(this.queryParams).then(response => {
        this.factorymodelList = response.rows;
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
        materialName: null,
        productSpecification: null,
        productModel: null,
        productLineName: null,
        remark: null,
        mesFactoryModelDetailList: [],
      };
      this.mesFactoryModelDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getFactoryModelData();
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
      this.title = "添加工厂建模";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFactoryModel(id).then(response => {

        this.form = response.data;
        response.data.mesFactoryModelDetailList.forEach(eq => {
          let obj = {
            code: '',
            manufacturer: '',
            productDate: '',
            batchNo: '',
            model: '',
          }
          this.mesFactoryModelDetailList.push(Object.assign(obj, eq));

        });
        this.mesFactoryModelDetailList.forEach(eq => {
          this.getEquipmentDetail(eq.equipmentId, eq);
          console.log(eq);
        });
        this.open = true;
        this.title = "修改工厂建模";
      });

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.id != null) {
            putFactoryModel(this.form).then(response => {
              console.log(response.data);
              this.msgSuccess("修改成功");
              this.open = false;
              this.getFactoryModelData();
            });
          } else {
            addFactoryModel(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getFactoryModelData();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除工厂建模编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return deleteFactoryModel(ids);
      }).then(() => {
        this.getFactoryModelData();
        this.msgSuccess("删除成功");
      })
    },
    /** 工厂建模明细序号 */
    rowMesFactoryModelDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 工厂建模明细添加按钮操作 */
    handleAddMesFactoryModelDetail() {
      let obj = {};
      obj.equipmentId = "";
      obj.code = "";
      obj.model = "";
      obj.manufacturer = "";
      obj.productDate = "";
      obj.batchNo = "";
      this.mesFactoryModelDetailList.push(obj);
    },
    /** 工厂建模明细删除按钮操作 */
    handleDeleteMesFactoryModelDetail() {
      if (this.checkedMesFactoryModelDetail.length == 0) {
        this.$alert("请先选择要删除的工厂建模明细数据", "提示", { confirmButtonText: "确定", });
      } else {
        this.mesFactoryModelDetailList.splice(this.checkedMesFactoryModelDetail[0].index - 1, 1);
      }
    },
    /** 单选框选中数据 */
    handleMesFactoryModelDetailSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.mesFactoryModelDetail.clearSelection();
        this.$refs.mesFactoryModelDetail.toggleRowSelection(selection.pop());
      } else {
        this.checkedMesFactoryModelDetail = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有工厂建模数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportFactoryModel(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>