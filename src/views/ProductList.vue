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
                  @click="getProList()"
                ></el-button>
              </template>
            </el-input>
          </el-form>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table
        :data="proList"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="cate_id" label="分类">
           <template #default>
            <p>{{cate_title}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="ex_title" label="副标题"></el-table-column>
        <el-table-column prop="date" label="发布时间"></el-table-column>
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
        <el-table-column prop="image" label="图片" width="200">
          <template #default="scope">
            <img :src="scope.row.image" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"  @click="goEditpage(scope.row.id,scope.row.cate_id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeById(scope.row.id)"></el-button>
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
  name: "ProductList",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      show:false,
      queryInfo: {
        //查询参数
        query: "",
        //当前页码
        pagenum: 1,
        //每页显示的条数
        pagesize: 10,
        cate_id: this.$route.query.cate_id,
      },
      total: 0, //总条数
      proList: [],
      cate_title:this.$route.query.cate_title,
    };
    
  },
  created() {
    this.$route.query.menu_title = this.$route.query.cate_title;
    this.getProList();
  },
  mounted(){
    this.fadeIn();
  },
  methods: {
    fadeIn(){
         this.show=!this.show;
    },
    getProList() {
      let _this = this;
      this.axios.post("Product/getList", this.queryInfo).then(function (res) {
        if (res.data.status == 1) {
          _this.proList = res.data.result;
          _this.total = res.data.extra;
        } else {
          _this.$message.error(res.data.message);
        }
      });
    },

    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getProList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getProList();
    },
    changestatus(proinfo) {
      let _this = this;
      this.axios
        .post("product/changeStatus", {
          id: proinfo.id,
          status: proinfo.status,
        })
        .then(function (res) {
          if (res.data.status == 1) {
            _this.$message.success("更新状态成功");
            console.log(res);
          } else {
            proinfo.status = !proinfo.status;
            _this.$message.error("更新状态失败");
            console.log(res);
          }
        });
    },

       goEditpage(id,cate_id){
    this.$router.push({ path: '/ProEdit', query: { id: id , cate_title:this.cate_title , cate_id:cate_id} })
    },

 //删除用户
      removeById(id){
      let _this = this;
        this.$confirm('永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           _this.axios.put('product/remove/',{id:id})
          .then(function (res) {
            if (res.data.status == 1) {
              _this.$message.success({
                message: res.data.message,
                type: "success",
              });
              //_this.getProList();
             location. reload();
             //this.$router.replace({path: '/ProductList',  query: { cate_id:_this.queryInfo.cate_id,cate_title:_this.cate_title}})
            //this.$router.push({ path: '/ProductList',  query: { cate_id:_this.queryInfo.cate_id,cate_title:_this.cate_title} })
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

  }
};
</script>

<style scoped lang="scss">
.el-table--border {
  margin: 25px 0;
}

.el-table tr img{
  width: 100%;
  max-height: 120px;
}
</style>