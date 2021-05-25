<template>
  <canvas id="canvas"> </canvas>
  <div class="login">
    <div class="box">
      <div class="title">
        <h3>后台管理系统</h3>
      </div>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-yonghu"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import lizi_init from "../assets/js/lizi";
export default {
  name: "Login",
  data() {
    var validatename = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "left",
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: validatename, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  created() {},
  mounted() {
    this.$nextTick(function () {
      // 仅在渲染整个视图之后运行的代码
      let _this = this;
      lizi_init();
      document.onkeypress = function () {
        if (window.event.keyCode == 13) {
          _this.submitForm("ruleForm");
        }
      };
    });
  },
  methods: {
    submitForm(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios
            .post("login/check", _this.ruleForm,)
            .then(function (res) {
              //登录成功
              if (res.data.status == 1) {
                _this.$message.success({
                  message: res.data.message,
                  type: "success",
                });
                window.sessionStorage.setItem("token", res.data.result.token);
                window.sessionStorage.setItem("id", res.data.result.id);
                window.sessionStorage.setItem(
                  "username",
                  res.data.result.username
                );
                window.sessionStorage.setItem("mobile", res.data.result.mobile);
                window.sessionStorage.setItem("group", res.data.result.group);
                _this.$router.push({ path: "/index" });
                //_this.$router.push("/index",);
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#canvas {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;
  background-color: #005ea3;
}

.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    width: 400px;
    height: 250px;
    margin-top: -10%;
    box-shadow: 0 -15px 30px #000;
    background-color: #fff;
    padding: 30px;
    border-radius: 2%;
    .title {
      h3 {
        color: #000;
        font-weight: 100;
        text-align: center;
      }
    }
    .demo-ruleForm {
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>


