<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="检测点名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入检测点名称" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="检测点地址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入检测点地址" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small" style="width: 240px">
          <el-option value="0" label="未过载"></el-option>
          <el-option value="1" label="已过载"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-no-more-click type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button v-no-more-click icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:role:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:role:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:role:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getCheckPointData" />
    </el-row>

    <el-table v-loading="loading" :data="checkPointList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" prop="id" width="120" />
      <el-table-column label="检测点名称" prop="name" :show-overflow-tooltip="true" width="200" />
      <el-table-column label="检测点地址" prop="address" :show-overflow-tooltip="true" width="200" />
      <el-table-column label="实时功率" prop="rtPower" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="实时电压" prop="rtVoltage" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="状态" align="center" width="120">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">{{ scope.row.status === '0' ? '未过载' : '已过载'
            }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上报时间" align="center" prop="createTime" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getCheckPointData" />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="检测点名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入检测点名称" />
        </el-form-item>
        <el-form-item label="检测点地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入检测点地址" />
        </el-form-item>
        <el-form-item label="实时功率" prop="rtPower">
          <el-input-number v-model="form.rtPower" :min="1" label="请输入实时功率"></el-input-number>
        </el-form-item>
        <el-form-item label="实时电压" prop="rtVoltage">
          <el-input-number v-model="form.rtVoltage" :min="1" label="请输入实时电压"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">未过载</el-radio>
            <el-radio label="1">已过载</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-no-more-click type="primary" @click="submitForm">确 定</el-button>
        <el-button v-no-more-click @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCheckPoint, addCheckPoint, putCheckPoint, deleteCheckPoint, getCheckPoint } from '@/api/cfElectric/checkPoint'

export default {
  name: "Checkpoint",

  data() {
    return {
      loading: true,
      checkPointList: [],
      total: 0,
      queryParams: {
        name: undefined,
        address: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 20
      },
      title: '',
      open: false,
      form: {},
      rules: {
        name: [{ required: true, message: "检测点名称不能为空", trigger: "blur" }],
        address: [{ required: true, message: "检测点地址不能为空", trigger: "blur" }],
        rtPower: [{ required: true, message: "实时功率不能为空", trigger: "blur" }],
        rtVoltage: [{ required: true, message: "实时电压不能为空", trigger: "blur" }],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }]
      },
      showSearch: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
    };
  },
  created() {
    this.getCheckPointData();
  },
  methods: {
    // 获取列表
    getCheckPointData() {
      this.loading = true;
      listCheckPoint(this.queryParams).then(response => {
        this.checkPointList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 统一查询处理
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getCheckPointData();
    },
    // 重置查询表单
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.handleQuery();
    },
    // 重置表单数据
    resetFormData() {
      this.form = {
        name: undefined,
        address: undefined,
        rtPower: 1,
        rtVoltage: 1,
        status: '0',
        remark: undefined
      };
      this.resetForm("form");
    },
    handleAdd() {
      this.resetFormData();
      this.open = true;
      this.title = '添加能效检测点';
    },
    handleUpdate(row) {
      this.resetFormData();
      const roleId = row.id || this.ids
      getCheckPoint(roleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改能效检测点";
      });
    },
    handleDelete(row) {
      const roleIds = row.id || this.ids;
      this.$confirm('是否确认删除能效预警为"' + roleIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return deleteCheckPoint(roleIds);
      }).then(() => {
        this.getCheckPointData();
        this.msgSuccess("删除成功");
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const apiCall = this.form.id ? putCheckPoint(this.form) : addCheckPoint(this.form);
          apiCall.then(() => {
            this.open = false;
            this.getCheckPointData();
            this.msgSuccess(this.form.id ? '修改成功' : '添加成功');
          });
        }
      });
    },
    cancel() {
      this.open = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
  }
};
</script>