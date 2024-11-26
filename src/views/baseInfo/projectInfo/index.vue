<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="项目名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入项目名" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker v-model="startDateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker v-model="endDateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="角色状态" clearable size="small" style="width: 240px">
          <el-option value="1" label="正常"></el-option>
          <el-option value="2" label="挂起"></el-option>
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getProjectInfoData" />
    </el-row>

    <el-table v-loading="loading" :data="projectInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" prop="id" width="120" />
      <el-table-column label="项目名" prop="name" :show-overflow-tooltip="true" width="300" />
      <el-table-column label="负责人" prop="leader" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">{{ scope.row.status === '1' ? '正常' : '挂起'
            }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getProjectInfoData" />

    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="项目名" prop="name">
          <el-input v-model="form.name" placeholder="请输入检测点名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入检测点地址" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker v-model="form.startDate" type="date" placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="form.endDate" type="date" placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="2">挂起</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目介绍" prop="description">
          <file-upload v-model="form.description" :limit="5" :file-type="['png', 'jpg', 'jpeg']"></file-upload>
          <!-- <editor v-model="form.description" :height="200"></editor> -->
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
import editor from '@/components/Editor'
import fileUpload from '@/components/FileUpload'
import { addProjectInfo, putProjectInfo, exportProjectInfo, listProjectInfo, deleteProjectInfo, getProjectInfo } from '@/api/baseInfo/projectInfo'
export default {
  name: "ProjectInfo",
  components: { editor, fileUpload },
  data() {
    return {
      loading: true,
      projectInfoList: [],
      total: 0,
      queryParams: {
        name: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 20
      },
      title: '',
      open: false,
      form: {},
      rules: {
        name: [{ required: true, message: "项目名不能为空", trigger: "blur" }],
        leader: [{ required: true, message: "负责人不能为空", trigger: "blur" }],
        startDate: [{ required: true, message: "开始日期不能为空", trigger: "blur" }],
        endDate: [{ required: true, message: "结束日期不能为空", trigger: "blur" }]
      },
      showSearch: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 日期范围
      startDateRange: [],
      endDateRange: []
    };
  },
  created() {
    this.getProjectInfoData()
  },
  methods: {
    setDateRange(dateRange, paramPrefix) {
      if (dateRange && dateRange.length === 2) {
        if (!this.queryParams.params) {
          this.queryParams.params = {};
        }
        this.queryParams.params[`begin${paramPrefix}`] = dateRange[0];
        this.queryParams.params[`end${paramPrefix}`] = dateRange[1];
      }
    },
    getProjectInfoData() {
      this.loading = true;
      if (null != this.startDateRange && '' != this.startDateRange) {
        this.setDateRange.call(this, this.startDateRange, 'StartDate');
      }

      if (null != this.endDateRange && '' != this.endDateRange) {
        this.setDateRange.call(this, this.endDateRange, 'EndDate');
      }

      listProjectInfo(this.queryParams).then(response => {
        this.projectInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    resetFormData() {
      this.form = {
        name: undefined,
        leader: undefined,
        startDate: new Date(),
        endDate: new Date(),
        status: '1',
        remark: undefined
      }
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getProjectInfoData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.startDateRange = [];
      this.endDateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.resetFormData()
      this.open = true;
      this.title = '添加项目';
    },
    handleUpdate(row) {
      this.resetFormData();
      const roleId = row.id || this.ids
      getProjectInfo(roleId).then(response => {
        this.form = response.data;

        if (this.form.description && typeof this.form.description === 'string') {
          try {
            const parsedDescription = JSON.parse(this.form.description);
            if (Array.isArray(parsedDescription)) {
              this.form.description = parsedDescription;
            }
          } catch (error) {
            console.error('json 转换错误', error);
          }
        }

        this.open = true;
        this.title = "修改项目";
      });
    },
    handleDelete(row) {
      const roleIds = row.id || this.ids;
      this.$confirm('是否确认删除项目为"' + roleIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return deleteProjectInfo(roleIds);
      }).then(() => {
        this.getProjectInfoData();
        this.msgSuccess("删除成功");
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.description = JSON.stringify(this.form.description);
          const apiCall = this.form.id ? putProjectInfo(this.form) : addProjectInfo(this.form);
          apiCall.then(() => {
            this.open = false;
            this.getProjectInfoData();
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
