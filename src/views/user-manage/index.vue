<!-- 用户管理-->
<template>
  <div class="app-container">
    <el-col :span="1.5">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="small"
        @click="handleAdd"
        v-hasPermi="['system:selected:add']"
        >新增</el-button
      >
    </el-col>
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      <el-form-item label="用户昵称" prop="serverName">
        <el-input
          v-model="queryParams.serverName"
          placeholder="请输入服务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="serviceList">
      <el-table-column
        label="uid"
        align="center"
        prop="serverName"
      ></el-table-column>
      <el-table-column label="HID" align="center" prop="serviceCoding" />
      <el-table-column label="用户昵称" align="center" prop="serviceCoding" />
      <el-table-column label="设备号" align="center" prop="serviceCoding" />
      <el-table-column label="用户类型" align="center" prop="serviceCoding" />
      <el-table-column label="首起时间" align="center" prop="serviceCoding" />
      <el-table-column
        label="最近启动时间"
        align="center"
        prop="serviceCoding"
      />
      <el-table-column
        label="最近启动地区"
        align="center"
        prop="serviceCoding"
      />
      <el-table-column label="累计启动次数" align="center" prop="url" />
      <el-table-column label="状态" align="center" prop="url" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 'disabled'"
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:selected:edit']"
            >启用</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:selected:edit']"
            >禁用</el-button
          >
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="infoChange(scope.row)"
            v-hasPermi="['system:selected:remove']"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户信息编辑弹窗 -->
    <el-dialog
      title="用户信息编辑"
      :visible.sync="userchangeopen"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px">
        <!-- 用户类型 -->
        <el-form-item label="用户类型">
          <el-select
            v-model="form.status"
            placeholder="请选择用户类型"
            style="width: 100%"
          >
            <el-option label="虚拟用户" value="enabled" />
            <el-option label="真实用户" value="disabled" />
          </el-select>
        </el-form-item>

        <el-form-item label="用户昵称">
          <el-input
            v-model="form.nickname"
            placeholder="请输入用户昵称"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="账号状态">
          <el-select
            v-model="form.status"
            placeholder="请选择账号状态"
            style="width: 100%"
          >
            <el-option label="启用" value="enabled" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userchangeopen = false">取 消</el-button>
        <el-button type="primary">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

import {
  listInfo,
  addInfo,
  updateInfo,
  getEntity,
} from "@/api/selectedservices-module/index";
export default {
  name: "selectedservices",
  dicts: ["region_type"],
  components: {},
  data() {
    return {
      clickWhich: "", // 用于区分点击的是哪个按钮
      // 遮罩层
      loading: true,
      options: [
        { label: "打开网页", value: 1 },
        { label: "系统应用", value: 2 },
        { label: "系统二级分类", value: 3 },
      ],
      //显示操作日志弹窗
      showOperationAlert: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 服务表格数据
      serviceList: [],
      // 弹出层标题
      title: "",
      isEdit: false,
      // 是否显示弹出层
      open: false,
      userchangeopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        onescreen: "11111",
        serverName: null,
        state: null,
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传文件服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      disabled: false,
      // 表单参数
      form: {
        type: null,
        appId: null,
        serviceCoding: "",
        appUrl: null,
        serverIcon: "",
        serverId: null,
        serverName: "",
        state: null,
        url: null,
        packageName: "",
        launchIcon: null,
        abilityName: "",
        domesticSwitch: false,
      },
      // 表单校验
      rules: {
        serverName: [
          { required: true, message: "服务名称不能为空", trigger: "blur" },
        ],
        serverIcon: [
          { required: true, message: "服务图标不能为空", trigger: "change" },
        ],
        serviceCoding: [
          { required: true, message: "唯一标识不能为空", trigger: "change" },
        ],
        type: [{ required: true, message: "请选择分类", trigger: "blur" }],
        appId: [{ required: true, message: "请选择绑定应用", trigger: "blur" }],
        launchIcon: [
          { required: true, message: "gif图不能为空", trigger: "blur" },
        ],
        packageName: [
          { required: true, message: "包名不能为空", trigger: "blur" },
        ],
        abilityName: [
          { required: true, message: "跳转路径不能为空", trigger: "blur" },
        ],
        url: [{ required: true, message: "跳转路径不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    Promise.all([this.getList()]);
  },
  methods: {
    // 编辑按钮
    infoChange(row) {
      this.userchangeopen = true;
    },
    openLogChangeAlert() {
      this.$refs.adddlga.openel({
        title: "服务管理备注",
        width: "50%",
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.clickWhich === "add") {
        this.submitFormNext();
      } else {
        this.openLogChangeAlert();
      }
    },
    //提交表单
    submitFormNext() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form));

          if (this.form.serverId != null) {
            updateInfo(params).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(params).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 查询服务列表 */
    async getList() {
      this.loading = true;
      try {
        const res = await listInfo(this.queryParams);
        const result = JSON.parse(JSON.stringify(res.data.records));
        this.serviceList = result;
        this.total = res.data.total;
      } catch (error) {
        this.$modal.msgError(error);
      }
      this.loading = false;
    },
    // 表单重置
    reset() {
      this.isEdit = false;
      this.form = {
        type: null,
        appId: null,
        // appName: null,
        appUrl: null,
        serverIcon: null,
        serviceCoding: "",
        serverId: null,
        serverName: null,
        // sort: null,
        state: null,
        url: null,
        packageName: null,
        launchIcon: null,
        abilityName: null,
        domesticSwitch: false,
      };
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加服务";
      this.clickWhich = "add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.clickWhich = "change";
      this.reset();
      this.isEdit = true;
      const id = row.serverId;
      getEntity({ serverId: id }).then((response) => {
        const data = response.data || {};
        this.form = data;
        this.open = true;
        this.title = "修改服务";
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  text-align: center;
}
::v-deep .el-button--medium {
  width: 35%;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
::v-deep .el-dialog__title {
  font-weight: 900;
}
</style>
