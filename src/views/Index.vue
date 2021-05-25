<template>
  <el-container>
    <el-header>
      <div class="title">后台管理</div>
      <div class="admin">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar icon="el-icon-user-solid"> {{ username }} </el-avatar
            ><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="showEditDialog(user_id)"
                ><i class="el-icon-edit"></i> 修改个人信息</el-dropdown-item
              >
              <el-dropdown-item @click="logout()"
                ><i class="el-icon-circle-close"></i> 退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!--<el-button
        type="danger"
        icon="el-icon-switch-button"
        class="logout"
        @click="logout()"
        round
        >退出</el-button
      >-->
    </el-header>
    <el-container>
      <el-aside width="initial">
        <div class="toggle-button" @click="toggleCollapse()">
          <i :class="togicon"></i>
        </div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#393D49"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-s-shop"></i>
              <span>产品管理</span>
            </template>
            <el-menu-item
              index="/productcate"
              :route="{
                path: '/productcate',
                query: { menu_title: '分类管理' },
              }"
            >
              <i class="el-icon-menu"></i>
              <template #title>分类管理</template>
            </el-menu-item>
            <el-menu-item
              index="/product"
              :route="{ path: '/product', query: { menu_title: '内容管理' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>内容管理</template>
            </el-menu-item>
          </el-submenu>
          <!--<el-submenu index="2">
            <template #title>
              <i class="el-icon-news"></i>
              <span>文章管理</span>
            </template>
            <el-menu-item
              index="/newscate"
              :route="{ path: '/newscate', query: { menu_title: '分类管理' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>分类管理</template>
            </el-menu-item>
            <el-menu-item
              index="/news"
              :route="{ path: '/news', query: { menu_title: '内容管理' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>内容管理</template>
            </el-menu-item>
          </el-submenu>-->
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item
              index="/admin"
              :route="{ path: '/admin', query: { menu_title: '用户列表' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>用户列表</template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template #title>
              <i class="el-icon-user"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item
              index="/rules"
              :route="{ path: '/rules', query: { menu_title: '权限列表' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>权限列表</template>
            </el-menu-item>
            <el-menu-item
              index="/authgroup"
              :route="{ path: '/authgroup', query: { menu_title: '角色管理' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>角色管理</template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template #title>
              <i class="el-icon-tickets"></i>
              <span>产品规格</span>
            </template>
            <el-menu-item
              index="/Specs"
              :route="{ path: '/Specs', query: { menu_title: '规格内容' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>规格内容</template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template #title>
              <i class="el-icon-circle-close"></i>
              <span>错误页面</span>
            </template>
            <el-menu-item
              index="/error"
              :route="{ path: '/error', query: { menu_title: '错误页面' } }"
            >
              <i class="el-icon-menu"></i>
              <template #title>错误页面</template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
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
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="editForm.username"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="editForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      isCollapse: false,
      togicon: "el-icon-s-fold",
      user_id: window.sessionStorage.getItem("id"),
      username: window.sessionStorage.getItem("username"),
      editDialogVisible: false,
      password: "",
      editForm: {
        username: "",
        password: "",
        mobile: "",
      },
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "输入的用户名长度在3到15之间" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 6, max: 15, message: "输入的手机号码是11位" },
        ],
      },
    };
  },
  created() {},
  methods: {
    editDiglogClose() {
      this.$refs.editFormRef.resetFields();
    },
    showEditDialog(id) {
      let _this = this;
      this.axios.post("admin/getUser", { id: id }).then(function (res) {
        if (res.data.status == 1) {
          //delete res.data.result.password;
          _this.editForm = res.data.result;
          _this.editForm.password = "";
          _this.editDialogVisible = true;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },
    //编辑用户
    editUser() {
      let _this = this;
      _this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          _this.axios
            .put("admin/edit/", _this.editForm) //put请求资源
            .then(function (res) {
              //添加成功
              if (res.data.status == 1) {
                _this.$message.success({
                  message: res.data.message,
                  type: "success",
                });
                _this.editDialogVisible = false;
                //_this.getUserList();
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

    logout() {
      window.sessionStorage.clear();
      this.$router.push("/Login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse == true) {
        this.togicon = "el-icon-s-unfold";
      } else {
        this.togicon = "el-icon-s-fold";
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.el-header,
.el-footer {
  background-color: #4a4a4b;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e9fff;
  padding: 0;
  .title {
    background-color: #0085e8;
    width: 200px;
    color: #fff;
    font-size: 18px;
  }
  .el-button.logout {
    height: 40px;
    margin-right: 20px;
  }
  .admin {
    margin-right: 35px;
    span {
      color: #fff;
      .el-avatar {
        font-size: 27px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
}

.el-aside {
  height: 100%;
  color: #fff;
  text-align: center;
  line-height: 200px;
  background-color: rgb(57, 61, 73);
  .el-menu {
    text-align: left;
    border-right: none;
    &:not(.el-menu--collapse) {
      width: 200px;
    }
  }
  .toggle-button {
    background-color: #fff;
    font-size: 24px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-icon-s-fold {
    color: #000;
  }
  .el-icon-s-unfold {
    color: #000;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container {
  height: 100%;
}
</style>

<style lang="scss">
.el-main {
  line-height: normal !important;
}
</style>

