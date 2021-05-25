<template>
  <div class="authgroup">
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
                @click="getAuthGroupList()"
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
    <!-- 列表 -->
    <el-table :data="authGroupList" border>
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="title" label="角色名"></el-table-column>
      <el-table-column prop="rules" label="规则id"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            v-if="scope.row.id !== 1"
            @click="showEditDialog(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            v-if="scope.row.id !== 1"
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
  <!-- 添加用户对话框 -->
  <el-dialog
    title="添加用户"
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
      <el-form-item label="角色名" prop="title">
        <el-input v-model="addForm.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="规则" prop="rules">
          <el-checkbox-group  v-model="addForm.rules">
                 <el-checkbox v-for="rules in rulesOption" :label="rules['id']" :key="rules['id']">{{rules['title']}}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAuthGroup()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑用户对话框 -->
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
           <el-form-item label="角色名" prop="title">
        <el-input v-model="editForm.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="规则" prop="rules">
          <el-checkbox-group  v-model="editForm.rules" @change="handleCheckedCitiesChange">
                 <el-checkbox v-for="rules in rulesOptionedit" :label="rules['id']" :key="rules['id']">{{rules['title']}}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAuthGroup()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
export default {
  name: "AuthGroup",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      show:false,
      rulesOption:[],
      rulesOptionedit:[],
      //列表传递的参数
      queryInfo: {
        //查询参数
        query: "",
        //当前页码
        pagenum: 1,
        //每页显示的条数
        pagesize: 10,
      },
      authGroupList: [],
      total: 0, //总条数
      dialogVisible: false,
      editDialogVisible: false,
      //添加角色
      addForm: {
        title: "",
        rules:[],
      },
      addFormRules: {
        title: [{ required: true, message: "请输入角色名", trigger: "blur" }],
      },
      //编辑角色
      editForm: {
        title: "",
        rules:[],
      },
      editFormRules: {
        title: [{ required: true, message: "请输入角色名", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getAuthGroupList();
    this.getRulesList();
  },
  mounted(){
    this.fadeIn();
  },
  methods: {
     fadeIn(){
      this.show=!this.show;
    },
    getAuthGroupList() {
      let _this = this;
      //初始列表数据
      this.axios.post("AuthGroup/getList", this.queryInfo).then(function (res) {
        if (res.data.status == 1) {
          _this.authGroupList = res.data.result;
          _this.total = res.data.extra;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },
    getRulesList() {
      let _this = this;
      this.axios.post("Rules/getNameList").then(function (res) {
        if (res.data.status == 1) {
          _this.rulesOption = res.data.result;
          _this.rulesOptionedit = res.data.result;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getAuthGroupList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getAuthGroupList();
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
      /*this.axios.post("Auth/getNameList", {}).then(function (res) {
        if (res.data.status == 1) {
          _this.dialogVisible = true;
          for (let i = 0; i < res.data.result.length; i++) { 
                  _this.addForm.ruleList[i] = res.data.result[i]['id'];
                  console.log(_this.addForm.ruleList[i]);
            }
          //console.log(_this.RuleOptions);
        } else {
          _this.$message.error(res.data.message);
        }
      });*/
    },

    //修饰编辑对话框
    showEditDialog(id) {
      let _this = this;
      //初始列表数据
      this.axios.post("AuthGroup/getGroup", {id:id}).then(function (res) {
        if (res.data.status == 1) {
          _this.editDialogVisible = true;
          for(let i=0;i<res.data.result['rules'].length;i++){
            res.data.result['rules'][i]=parseInt(res.data.result['rules'][i])   
          }
          _this.editForm=res.data.result;
          console.log(_this.editForm)
        } else {
          _this.$message.error(res.data.message);
          //console.log(res);
        }
      });
    },

    handleCheckedCitiesChange(){
    },

    //添加用户
    addAuthGroup() {
      let _this = this;
      _this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          //console.log(_this.addForm.ruleList);
          _this.axios.post("AuthGroup/add", _this.addForm).then(function (res) {
            //添加成功
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.dialogVisible = false;
              _this.getAuthGroupList();
              console.log(res);
            } else {
              _this.$message.error(res.data.message);
              console.log(res);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //编辑用户
    editAuthGroup() {
      let _this = this;
      _this.$refs.editFormRef.validate((valid) => {
        if (valid) {
         _this.editForm.rules=_this.editForm.rules.toString();
          _this.axios
            .post("AuthGroup/edit/", _this.editForm)
            .then(function (res) {
              if (res.data.status == 1) {
                _this.$message.success({
                  message: res.data.message,
                  type: "success",
                });
                console.log(res);
                _this.editDialogVisible = false;
                _this.getAuthGroupList();
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
          _this.axios.put("authGroup/remove/", { id: id }).then(function (res) {
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.getAuthGroupList();
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
.el-table--border{
  margin: 25px 0;
}
</style>
