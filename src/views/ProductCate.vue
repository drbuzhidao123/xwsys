<template>
  <div class="productcate">
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
                  @click="getProCate()"
                ></el-button>
              </template>
            </el-input>
          </el-form>
        </el-col>
        <el-col :span="1">
          <el-button
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="showAddDialog0()"
            >添加一级分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table
        :data="proCateList"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="title" label="分类名称" sortable>
        </el-table-column>
        <el-table-column prop="id" label="id" sortable> </el-table-column>
        <el-table-column prop="level" label="级别" sortable> 
           <template #default="scope">
          <el-tag type="" v-if="scope.row.level==1">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==2">⊥——二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level==3">⊥————三级</el-tag>
           </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="showAddDialog(scope.row.id, scope.row.level)"
            ></el-button>
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
    <!-- 一级分类对话框 -->
    <el-dialog
      title="添加一级分类"
      v-model="dialogVisible0"
      width="30%"
      :before-close="handleClose"
      @close="addDiglogClose0()"
    >
      <el-form
        :model="addForm0"
        :rules="addFormRules0"
        ref="addFormRef0"
        label-width="90px"
      >
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="addForm0.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible0 = false">取 消</el-button>
          <el-button type="primary" @click="addProCate0()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 子分类对话框 -->
    <el-dialog
      title="添加子分类"
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
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="addForm.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProCate()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑分类"
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
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="editForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="父级分类" prop="title">
        <el-input v-model="editForm.pid" autocomplete="off"></el-input>
      </el-form-item>-->
       <el-form-item label="父级" prop="title">
      <el-cascader style="width:100%"
    :options="editOption"
    :props="optionProps"
    @change="handleChange"
    placeholder="不修改分类"
    clearable></el-cascader>
       </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editProCate()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
export default {
  name: "ProductCate",
  components: {
    BreadCrumb,
  },
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
      total: 0, //总条数
      proCateList: [],
      dialogVisible0: false,
      dialogVisible: false,
      editDialogVisible: false,
      //添加产品分类
      addForm0: {
        title: "",
        pid: 0,
        level: 1,
      },
      addFormRules0: {
        title: [{ required: true, message: "请输入分类名", trigger: "blur" }],
      },
      addForm: {
        title: "",
        pid: 0,
        level: 1,
      },
      addFormRules: {
        title: [{ required: true, message: "请输入分类名", trigger: "blur" }],
      },
      editForm: {
        title: "",
        pid: 0,
        level: 1,
      },
      editFormRules: {
        title: [{ required: true, message: "请输入分类名", trigger: "blur" }],
      },
      checkedOptions:{pid:-1},
      editOption: [],
      optionProps: {
      checkStrictly: true,
		  value: 'id',
		  label: 'title',
      children:'children',
	}
    };
  },
  created() {
    this.getProCate();
  },
  mounted(){
    this.fadeIn();
  },
  methods: {
    fadeIn(){
      this.show=!this.show;
    },
    getProCate() {
      let _this = this;
      this.axios
        .post("ProductCate/getList", this.queryInfo)
        .then(function (res) {
          if (res.data.status == 1) {
            _this.proCateList = res.data.result;
            _this.total = res.data.extra;
            console.log(res);
          } else {
            _this.$message.error(res.data.message);
          }
        });
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getProCate();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getProCate();
    },
    //修饰添加对话框
    showAddDialog0() {
      this.dialogVisible0 = true;
    },
    //添加对话框关闭
    addDiglogClose0() {
      this.$refs.addFormRef0.resetFields();
    },
    //子分类对话框关闭
    addDiglogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //修饰编辑对话框
    showEditDialog(id) {
      let _this = this;
      this.axios
        .post("ProductCate/getParentList",{id: id})
        .then(function (res) {
          if (res.data.status == 1) {
            _this.editOption = res.data.result; 
          } else {
            _this.$message.error(res.data.message);
          }
        });
      this.axios
        .post("ProductCate/getProCate", { id: id })
        .then(function (res) {
          if (res.data.status == 1) {
            _this.editForm['pid']=res.data.result['pid'];
            _this.editForm['level']=res.data.result['level'];
            _this.editDialogVisible = true;
            _this.editForm = res.data.result;
          } else {
            _this.$message.error(res.data.message);
          }
        });
    },
    //编辑对话框关闭
    editDiglogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //添加一级分类
    addProCate0() {
      let _this = this;
      _this.$refs.addFormRef0.validate((valid) => {
        if (valid) {
          _this.axios
            .post("ProductCate/add0", _this.addForm0)
            .then(function (res) {
              //添加成功
              if (res.data.status == 1) {
                _this.$message.success({
                  message: res.data.message,
                  type: "success",
                });
                _this.dialogVisible0 = false;
                console.log(res);
                _this.getProCate();
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

    //添加子分类对话框
    showAddDialog(id, level) {
      this.dialogVisible = true;
      this.addForm.pid = id;
      this.addForm.level = level + 1;
    },

    //添加子分类
    addProCate() {
      let _this = this;
      _this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          _this.axios
            .post("ProductCate/add", _this.addForm)
            .then(function (res) {
              //添加成功
              if (res.data.status == 1) {
                _this.$message.success({
                  message: res.data.message,
                  type: "success",
                });
                _this.dialogVisible = false;
                _this.getProCate();
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

    //编辑
      editProCate(){
      let _this = this;
      _this.$refs.editFormRef.validate((valid) => {
         if (valid) {
           //console.log(_this.editForm);
           //return false;
          _this.axios.put('productCate/edit/',_this.editForm)
          .then(function (res) {
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.editDialogVisible=false;
              _this.getProCate();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
    });
  },

    //删除
      removeById(id){
      let _this = this;
        this.$confirm('永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           _this.axios.put('ProductCate/remove/',{id:id})
          .then(function (res) {
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              _this.getProCate();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    





  },

  handleChange(event){
            this.editForm['pid'] = event[event.length-1];
            this.editForm['level'] = event.length+1; 
  }


  },
};
</script>

<style scoped lang="scss">
.el-table--border {
  margin: 25px 0;
}



</style>