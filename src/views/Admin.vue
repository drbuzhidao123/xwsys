<template>
  <div class="admin">
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
                  @click="getUserList()"
                ></el-button>
              </template>
            </el-input>
          </el-form>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="dialogVisible = true"
            >添加</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="userList" border>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="title" label="角色"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch
              @click="changestatus(scope.row)"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建日期"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" v-if="scope.row.id !== 1" @click="showEditDialog(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" v-if="scope.row.id !== 1" @click="removeById(scope.row.id)"></el-button>
          <el-tooltip effect="light" content="分配角色" placement="top" v-if="scope.row.id !== 1">
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetDialog(scope.row.id)"
            ></el-button>
          </el-tooltip>
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
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
      @close="addDiglogClose()"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="addForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
         <el-form-item label="手机号码" prop="mobile">
          <el-input 
            v-model="addForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>  

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser()"
            >确 定</el-button
          >
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
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="90px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="editForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
         <el-form-item label="手机号码" prop="mobile">
          <el-input 
            v-model="editForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>  

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser()"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
      <!-- 分配对话框 -->
    <el-dialog
      title="分配角色"
      v-model="setDialogVisible"
      width="30%"
      :before-close="handleClose"
      @close="setDiglogClose()"
    >
    <el-dropdown @command="handleCommand">
  <el-button type="primary">
    {{checkgroup['title']}}<i class="el-icon-arrow-down el-icon--right"></i>
  </el-button>
  <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item v-for="group in authGroupList" :key="group['id']" :command="group">{{group.title}}</el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setgroup()"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
export default {
  name: "admin",
  data() {
    return {
      show:false,
      //列表传递的参数
      queryInfo: {
        //查询参数
        query: "",
        //当前页码
        pagenum: 1,
        //每页显示的条数
        pagesize: 10,
      },
      userList: [],
      total: 0, //总条数
      dialogVisible: false,
      editDialogVisible: false,
      setDialogVisible: false,
      checkgroup:{group_id:-1,title:'请选择角色'},
      authGroupList:[],
      //添加用户
        addForm: {
        username: "",
        password: "",
        mobile:"",
      },
      addFormRules: {
        username: [{ required: true,message:'请输入用户名', trigger: "blur" },{min:3,max:15,message:'输入的用户名长度在3到15之间'}],
        password: [{ required: true,message:'请输入密码', trigger: "blur" }],
        mobile: [{ required: true,message:'请输入手机号码', trigger: "blur" },{min:6,max:15,message:'输入的手机号码是11位'}],
      },
      //编辑用户
      editForm: {
        username: "",
        password: "",
        mobile:"",
      },
      editFormRules: {
        username: [{ required: true,message:'请输入用户名', trigger: "blur" },{min:3,max:15,message:'输入的用户名长度在3到15之间'}],
        mobile: [{ required: true,message:'请输入手机号码', trigger: "blur" },{min:6,max:15,message:'输入的手机号码是11位'}],
      },
    };
  },
  components: {
    BreadCrumb,
  },
  created() {
    this.getUserList();
  },
  mounted(){
    this.fadeIn();
  },
  methods: {
      fadeIn(){
      this.show=!this.show;
    },
    getUserList() {
      let _this = this;
      //初始列表数据
      this.axios.post("admin/getList", this.queryInfo).then(function (res) {
        if (res.data.status == 1) {
          _this.userList = res.data.result;
          _this.total = res.data.extra;
          console.log(res);
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },

    /*getGroup(id){
      let _this = this;
      this.axios.post("AuthGroup/getList", {uid:id}).then(function (res) {
        if (res.data.status == 1) {
          _this.authGroupList = res.data.result;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },*/

    getAuthGroupList() {
      let _this = this;
      //初始列表数据
      this.axios.post("AuthGroup/getList", this.queryInfo).then(function (res) {
        if (res.data.status == 1) {
          _this.authGroupList = res.data.result;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },
    /*getTotal() {
      let _this = this;
      //初始列表数据
      this.axios.post("user/getTotal", this.queryInfo).then(function (res) {
        if (res.data.status == 1) {
          _this.total = res.data.result;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },*/
    //监听每页条数的改变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    changestatus(userinfo) {
      let _this = this;
      this.axios
        .post("admin/changeStatus", {
          userid: userinfo.id,
          status: userinfo.status,
        })
        .then(function (res) {
          if (res.data.status == 1) {
            _this.$message.success("更新状态成功");
            console.log(res);
          } else {
            userinfo.status = !userinfo.status;
            _this.$message.error("更新状态失败"); 
            console.log(res);
          }
        });
    },

    //添加用户对话框关闭
    addDiglogClose(){
       this.$refs.addFormRef.resetFields(); 
    },

    //编辑对话框关闭
    editDiglogClose(){
       this.$refs.editFormRef.resetFields(); 
    },
    //编辑对话框
    showEditDialog(id){
       let _this = this;
      //初始列表数据
       this.axios.post("admin/getUser", {id:id}).then(function (res) {
        if (res.data.status == 1) {
          _this.editForm = res.data.result;
          _this.editForm.password='';
          _this.editDialogVisible = true;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },

    //分配对话框
    showSetDialog(id){
      this.authGroupList=this.getAuthGroupList();
      this.checkgroup['uid']=id;
      this.setDialogVisible = true;
    },

    //分配对话框关闭
    setDiglogClose(){
      this.checkgroup['id']=-1;
      this.checkgroup['title']='请选择角色';
    },  

    //添加用户
    addUser(){
      let _this = this;
      _this.$refs.addFormRef.validate((valid) => {
         if (valid) {
          _this.axios.post("admin/add", _this.addForm).then(function (res) {
            //添加成功
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.dialogVisible=false;
              _this.getUserList();
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
      editUser(){
      let _this = this;
      _this.$refs.editFormRef.validate((valid) => {
         if (valid) {
          _this.axios.put('admin/edit/',_this.editForm)//put请求资源
          .then(function (res) {
            //添加成功
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.editDialogVisible=false;
              _this.getUserList();
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

  //删除用户
      removeById(id){
      let _this = this;
        this.$confirm('永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           _this.axios.put('admin/remove/',{id:id})
          .then(function (res) {
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.getUserList();
            } else {
              _this.$message.error(res.data.message);
              console.log(res);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    





  },

    //添加用户
    setgroup(){
      let _this = this;
          _this.axios.post("admin/setGroup", _this.checkgroup).then(function (res) {
            //添加成功
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.setDialogVisible=false;
              _this.getUserList();
              console.log(res);
            } else {
              _this.$message.error(res.data.message);
                            console.log(res);
            }
          });
  },


     handleCommand(command) {
         this.checkgroup['group_id']=command['id'];
         this.checkgroup['title']=command['title']
      }

  }

};
</script>

<style scoped lang="scss">
.el-card {
  .el-row {
    text-align: left;
  }
  .el-table {
    margin-top: 25px;
    font-size: 12px;
  }
  .el-pagination{
    padding: 25px 0 5px 0;
  }
}
</style>
