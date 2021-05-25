<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{menu_title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "welcome",
  data(){
    return{
       menu_title:this.$route.query.menu_title
    }
  }
};
</script>

<style scoped lang="scss">
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}
</style>
