<template>
  <div class="SpecsValue">
    <bread-crumb></bread-crumb>
    <transition name="slide-fade">
      <el-card v-if="show">
        <!-- 搜索&添加 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form>
              <el-input
                v-model="queryInfo.query"
                placeholder="请输入内容"
                clearable
              >
                <template #append>
                  <el-button
                    icon="el-icon-search"
                    @click="getspecsValueList()"
                  ></el-button>
                </template>
              </el-input>
            </el-form>
          </el-col>
          <el-col :span="1">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="showAddDialog()"
              >添加</el-button
            >
          </el-col>
        </el-row>
        <el-page-header @back="goBack" :content="specs_name">
        </el-page-header>
        <!-- 列表 -->
        <el-table :data="specsValueList" border>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="name" label="属性名称"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeById(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </transition>
  </div>
  <!-- 添加对话框 -->
  <el-dialog
    title="添加规格"
    v-model="dialogVisible"
    width="30%"
    :before-close="handleClose"
    @close="addDiglogClose()"
  >
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="90px"
    >
      <el-form-item label="规格属性名" prop="name">
        <el-input v-model="addForm.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑对话框 -->
  <el-dialog
    title="编辑用户"
    v-model="editDialogVisible"
    width="30%"
    :before-close="handleClose"
    @close="editDiglogClose()"
  >
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="90px"
    >
      <el-form-item label="规格名" prop="name">
        <el-input v-model="editForm.name" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
export default {
  name: "SpecsValue",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      show: false,
      specs_name:this.$route.query.specs_name,
      //列表传递的参数
      queryInfo: {
        //查询参数
        query: "",
        //当前页码
        pagenum: 1,
        //每页显示的条数
        pagesize: 10,

        specs_id:this.$route.query.specs_id,
      },
      specsValueList: [],
      total: 0, //总条数
      dialogVisible: false,
      editDialogVisible: false,
      //添加角色
      addForm: {
        name: "",
        specs_id:this.$route.query.specs_id,
      },
      addFormRules: {
        name: [{ required: true, message: "请输入规格名", trigger: "blur" }],
      },
      //编辑角色
      editForm: {
        name: "",
        specs_id:this.$route.query.specs_id,
      },
      editFormRules: {
        name: [{ required: true, message: "请输入规格名", trigger: "blur" }],
      },
    };
  },
  created() {
    this.$route.query.menu_title = this.$route.query.menu_title;
    this.getspecsValueList();
  },
  mounted() {
    this.fadeIn();
  },
  methods: {
    fadeIn() {
      this.show = !this.show;
    },
    goBack() {
           this.$router.push({path: "/Specs"});
    },
    getspecsValueList() {
      let _this = this;
      this.axios.post("SpecsValue/getList", _this.queryInfo).then(function (res) {
        if (res.data.status == 1) {
          _this.specsValueList = res.data.result;
          _this.total = res.data.extra;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getspecsValueList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getspecsValueList();
    },
    //添加用户对话框关闭
    addDiglogClose() {
      this.$refs.addFormRef.resetFields();
    },

    //编辑对话框关闭
    editDiglogClose() {
      this.$refs.editFormRef.resetFields();
    },

    //修饰添加对话框
    showAddDialog() {
      this.dialogVisible = true;
    },

    //修饰编辑对话框
    showEditDialog(id) {
      let _this = this;
      //初始列表数据
      this.axios.post("SpecsValue/getbyId", { id: id }).then(function (res) {
        if (res.data.status == 1) {
          _this.editDialogVisible = true;
          _this.editForm = res.data.result;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },

    //添加用户
    add() {
      let _this = this;
      _this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          _this.axios.post("SpecsValue/add", _this.addForm).then(function (res) {
            //添加成功
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.dialogVisible = false;
              _this.getspecsValueList();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //编辑用户
    edit() {
      let _this = this;
      _this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          _this.axios.put("SpecsValue/edit", _this.editForm).then(function (res) {
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.editDialogVisible = false;
              _this.getspecsValueList();
            } else {
              console.log(res);
              _this.$message.error(res.data.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //删除用户
    removeById(id) {
      let _this = this;
      this.$confirm("永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _this.axios.put("SpecsValue/remove", { id: id }).then(function (res) {
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.getspecsValueList();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.el-table--border {
  margin: 25px 0;
}
.el-page-header{
    margin: 20px 0;
    color: #b1b1b1;
}
</style>
