<template>
  <div class="error">
    <bread-crumb></bread-crumb>
  <transition name="slide-fade">
    <el-card v-if="show">
      <div class="box">
      <h1>error，404！</h1>
      <p>路由地址错误或服务器未响应</p>
        <el-button type="primary" @click="toHome()" round>返回首页</el-button>
    </div>
    </el-card>
  </transition>
</div>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
export default {
  name: "error",
  components: {
    BreadCrumb
  },
  data() {
    return {
      show: false,
    };
  },
  mounted(){
    this.fadeIn();
  },
  methods: {
    fadeIn(){
      this.show=!this.show;
    },
    toHome(){
      this.$router.push({ path: '/Index' })
    }
  },
};
</script>

<style scoped lang="scss">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.error {
  p{
    margin: 20px 0;
  }
  .el-button{
    margin-bottom: 20px;
  }
}

/*.el-button--primary{
      background-color: #2c557f;
    border-color: #2c557f;
}*/
</style>
