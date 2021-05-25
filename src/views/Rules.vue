<template>
   <div class="rules">
    <bread-crumb></bread-crumb>
     <transition name="slide-fade">
        <el-card v-if="show">
    <!-- 列表 -->
    <el-table :data="rulesList" border>
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="title" label="角色名"></el-table-column>
      <el-table-column prop="name" label="模块"></el-table-column>
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
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
export default {
  name: "Rules",
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
      total: 0, //总页数
      rulesList: [],
    };
  },
  created() {
    this.getRulesList();
  },
  mounted(){
    this.fadeIn();
  },
  methods: {
      fadeIn(){
      this.show=!this.show;
    },
    getRulesList() {
      let _this = this;
      //初始列表数据
      this.axios.post("Rules/getList", this.queryInfo).then(function (res) {
        if (res.data.status == 1) {
          _this.rulesList = res.data.result;
          _this.total = res.data.extra;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getRulesList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getRulesList();
    },
  },
};
</script>

<style scoped lang="scss">
</style>
