<template>
  <el-dialog title="移库" :visible.sync="open" width="1500px" append-to-body @open="handleOpen"
    :close-on-click-modal="false" :show-close="false">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="form.materialName" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="型号" prop="materialModel">
        <el-input v-model="form.materialModel" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="规格" prop="materialSpecification">
        <el-input v-model="form.materialSpecification" placeholder="" disabled />
      </el-form-item>
      <el-form-item label="单位" prop="materialUnit">
        <el-input v-model="form.materialUnit" placeholder="" disabled />
      </el-form-item>
      <el-table :data="wmsWarehouseMaterialDetailList" :row-class-name="rowWmsWarehouseMaterialDetailIndex"
        ref="wmsWarehouseMaterialDetail">
        <el-table-column label="序号" align="center" prop="index" width="50" :fixed="true" />
        <el-table-column label="物料名" prop="materialName" :fixed="true">
        </el-table-column>
        <el-table-column label="批号" prop="batchNo" width="150">
        </el-table-column>
        <el-table-column label="源仓库" prop="warehouseName" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.warehouseName'">
              {{ scope.row.warehouseName }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="源库区" prop="whRegionName" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.whRegionName'">
              {{ scope.row.whRegionName }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="源库位" prop="whLocationName" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.whLocationName'">
              {{ scope.row.whLocationName }}
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="现有库存" prop="inventory" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.inventory'">
              <el-input v-model.number="scope.row.inventory" placeholder="" disabled />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="锁定库存" prop="lockInventory" width="150" :fixed="true">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.lockInventory'">
              <el-input v-model.number="scope.row.lockInventory" placeholder="" disabled />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="目标仓库" prop="targetWarehouseId" width="150">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.targetWarehouseId'">
              <el-select v-model="scope.row.targetWarehouseId" placeholder="请选择目标仓库" filterable
                @change="handleWarehouseChange(scope.row.targetWarehouseId, scope.$index)">
                <el-option v-for="dict in warehouseIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
                  :value="parseInt(dict.dictValue)"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="目标库区" prop="targetRegionId" width="150">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.targetRegionId'">
              <el-select v-model="scope.row.targetRegionId" placeholder="请选择目标库区" filterable
                @change="handleWhRegionChange(scope.row.targetRegionId, scope.$index)">
                <el-option v-for="dict in scope.row.targetWhRegionOptions" :key="dict.id" :label="dict.name"
                  :value="dict.id" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="目标库位" prop="targetLocationId" width="150">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.targetLocationId'">
              <el-select v-model="scope.row.targetLocationId" placeholder="请选择目标库位" filterable>
                <el-option v-for="dict in scope.row.targetWhLocationOptions" :key="dict.id" :label="dict.name"
                  :value="dict.id" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="移出数量" prop="moveQuantity" width="150">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.moveQuantity'"
              :rules="rules.moveQuantity">
              <el-input v-model.number="scope.row.moveQuantity" placeholder="请输入移出数量" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="移出原因" prop="reason" width="150">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.reason'" :rules="rules.reason">
              <el-input v-model.number="scope.row.reason" placeholder="请输入移出原因" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="150">
          <template slot-scope="scope">
            <el-form-item :prop="'wmsWarehouseMaterialDetailList.' + scope.$index + '.remark'" :rules="rules.remark">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-no-more-click type="primary" @click="submitForm">确 定</el-button>
      <el-button v-no-more-click @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getMaterialInventory } from '../../../api/material/materialInventory';
import { listWarehouseLocation } from '../../../api/warehouse/warehouseLocation';
import { moveWarehouseMove } from '../../../api/warehouse/warehouseMove';
import { listWarehouseRegion } from '../../../api/warehouse/warehouseRegion';


export default {
  name: "MaterialInventory",
  props: {
    open: {
      type: Boolean,
      default: false
    },
    billId: null
  },
  data() {
    return {
      // 仓库物料明细表格数据
      wmsWarehouseMaterialDetailList: [],
      // 仓库字典
      warehouseIdOptions: [],
      form: {},
      rules: {
        moveQuantity: [
          { required: true, message: "移出数量不能为空", trigger: "blur" },
          { type: 'number', min: 1, max: 65535, message: '移出数量必须为数字值且大小要在1到65535' },
        ]
      }
    };
  },
  created() {
    this.getQueryData("query_warehouse").then(res => {
      this.warehouseIdOptions = res.data;
    });
  },
  watch: {
    'wmsWarehouseMaterialDetailList': {
      handler(newVal, oldVal) {
        this.form.wmsWarehouseMaterialDetailList = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleOpen() {
      this.getInfo()
    },
    handleWarehouseChange(val, index) {
      this.wmsWarehouseMaterialDetailList[index].targetRegionId = null;
      if (val) {
        this.getWhRegionOpts(val, index);
      }
    },
    handleWhRegionChange(val, index) {
      if (val) {
        this.getWhLocationOpts(val, index);
      }
    },
    //获取库区选项
    getWhRegionOpts(val, index) {
      let queryParams = {
        warehouseId: val,
      }
      listWarehouseRegion(queryParams).then(res => {
        this.wmsWarehouseMaterialDetailList[index].targetWhRegionOptions = res.rows;
      });
    },
    //获取库位选项
    getWhLocationOpts(val, index) {
      let queryParams = {
        regionId: val,
      }
      listWarehouseLocation(queryParams).then(res => {
        this.wmsWarehouseMaterialDetailList[index].targetWhLocationOptions = res.rows;
      })
    },
    getInfo() {
      this.reset();
      getMaterialInventory(this.billId).then(res => {
        this.form = res.data;
        res.data.wmsWarehouseMaterialDetailList.forEach((row, index) => {
          let obj = {
            sourceWarehouseId: row.whId,
            sourceRegionId: row.whRegionId,
            sourceLocationId: row.whLocationId,
            sourceWarehouseName: row.warehouseName,
            sourceRegionName: row.whRegionName,
            sourceLocationName: row.whLocationName,
            targetWhRegionOptions: [],
            targetWhLocationOptions: [],
          };
          let nobj = Object.assign(obj, row);
          this.wmsWarehouseMaterialDetailList.push(nobj)
        })
      })
    },
    reset() {
      this.form = {
        id: null,
        warehouseId: null,
        materialId: null,
        totalInventory: null,
        freezeInventory: null,
        maxInventory: null,
        minInventory: null,
        materialName: null,
        materialModel: null,
        materialSpecification: null,
        materialUnit: null,
        wmsWarehouseMaterialDetailList: [],
      };
      this.wmsWarehouseMaterialDetailList = [];
      this.resetForm("form");
    },
    cancel() {
      this.reset();
      this.$emit('onCancel')
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          moveWarehouseMove(this.wmsWarehouseMaterialDetailList).then(res => {
            this.msgSuccess("移库成功");
            this.$emit('onCancel');
          });
        } else {
          this.msgError('请检查相关必填字段')
        }
      });
    },
    rowWmsWarehouseMaterialDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
  }
}
</script>
