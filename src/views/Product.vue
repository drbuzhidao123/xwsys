<template>
  <div class="product">
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
            <el-tag type="" v-if="scope.row.level == 1">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 2"
              >⊥——二级</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.level == 3"
              >⊥————三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="info"
              icon="el-icon-circle-plus-outline"
              size="mini"
              @click="goAddpage(scope.row.id,scope.row.title)"
            >添加内容</el-button>
            <el-button
              type="primary"
              icon="el-icon-view"
              size="mini"
              @click="goList(scope.row.id,scope.row.title)"
            >查看内容</el-button>
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
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
export default {
  name: "Product",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      show: false,
      queryInfo: {
        //查询参数
        query: "",
        //当前页码
        pagenum: 1,
        //每页显示的条数
        pagesize: 10,
      },
      total: 0, //总条数
      proCateList:[],
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

    goAddpage(id,title){
    this.$router.push({ path: '/proadd', query: { cate_id: id , cate_title:title} })
    },

     goList(id,title){
    this.$router.push({ path: '/ProductList',  query: { cate_id:id,cate_title:title} })
    } 
    
  },
};
</script>

<style scoped lang="scss">
.el-table--border {
  margin: 25px 0;
}
</style>