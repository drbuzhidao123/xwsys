<template>
  <div class="proadd">
    <bread-crumb></bread-crumb>
      <transition name="slide-fade">
    <el-card v-if="show">
      <el-row>
        <el-col :span="24">
          <el-alert title="添加内容" type="info" center show-icon> </el-alert
        ></el-col>
      </el-row>
            <el-row>
          <el-button type="info" class="back" plain @click="back()">返回列表</el-button>
      </el-row>
      <el-tabs :tab-position="tabPosition">
    <el-tab-pane label="基本信息">
      <el-row>
        <el-form
          style="width: 70%"
          class="form"
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="80px"
        >
          <el-form-item label="分类">
            <el-input v-model="cate_title" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="form.ex_title"></el-input>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-col :span="11">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                v-model="form.date"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="图片" style="text-align: left">
            <el-upload
              class="upload-demo"
              action="http://www.xwsysapi.com/admin/product/uploadImg"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
              :headers="headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">jpg/png,小于500kb</div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="审核" style="text-align: left">
            <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
            <el-form-item label="是否推荐" style="text-align: left">
            <el-switch v-model="form.is_recommend" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" v-model="form.summary"></el-input>
          </el-form-item>
          <el-form-item label="内容"
            ><editor v-model="form.content"></editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">新增</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="sku信息" style="width:70%;margin:0 auto">
      <el-row  v-for="(item,index) in specsOption">
       <el-col :span="3" style="padding:10px 0"> {{item.sname}}</el-col>
       <el-checkbox-group v-model="specsChecked[index].svalue">
     <el-checkbox v-for="svalue in item.svalue"  @change="checkchange"  :label="svalue" :key="svalue" border>{{svalue.name}}</el-checkbox>
  </el-checkbox-group>
      </el-row>
   
       <el-table v-if="skushow"
      :data="skuList"
      style="width: 100%">
      <el-table-column
        v-for="(item,index) in specsOption"
        :label="item.sname"
        :key="index">
          <template #default="scope">
        <span>{{ scope.row[index].name}}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="市场价格">
          <template #default="scope">
        <el-input style="width:100%" v-model="scope.row.const_price"  @change="scope.row.const_price=parseFloat(scope.row.const_price)"  placeholder="请输入价格"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="销售价格">
        <template #default="scope">
        <el-input style="width:100%" v-model="scope.row.price" @change="scope.row.price=parseFloat(scope.row.price)" placeholder="请输入价格"></el-input>
        </template>
      </el-table-column>
       <el-table-column
        label="库存">
           <template #default="scope">
         <el-input-number v-model="scope.row.stock"></el-input-number>
           </template>
      </el-table-column>
    </el-table>
    </el-tab-pane>
  </el-tabs>
    </el-card>
      </transition>
  </div>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import Editor from "@/components/TinyMce";
export default {
  name: "ProAdd",
  components: {
    BreadCrumb,
    Editor,
  },
  props: {},
  data() {
    return {
      show:false,
      skushow:false,
      cate_title:this.$route.query.cate_title,
      headers: { Authorization: window.sessionStorage.getItem("token") },
      tabPosition:'left',
      specsOption:[],
      specsChecked:[],
      skuArray: [],
      skuList: [],
      form: {
        cate_id:this.$route.query.cate_id,
        title: "",
        ex_title: "",
        date: "",
        image:'',
        status: 1,
        is_recommend:0,
        summary: "",
        content: "",
      },
      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
      },
    };
  },
  created() {
    this.$route.query.menu_title = "添加内容";
    this.getSpecs();
  },
  mounted(){
     this.fadeIn();
  },
  methods: {
     fadeIn(){
      this.show=!this.show;
    },
    back(){
      this.$router.push({ path: '/product',query: { menu_title:this.$route.query.menu_title}})
    },
    getSpecs(){
       let _this = this;
       _this.axios.post("Specs/getSpecs",{}).then(function (res) {
              if (res.data.status == 1) {
                _this.specsOption=res.data.result;
                _this.specsOption.forEach(element => {
                _this.specsChecked.push({sname:element.sname,svalue:[]});
                });
              } else {
                _this.$message.error(res.data.message);
              }
            });
    },
    checkchange(){
        this.skuArray = [];
        this.skuList = [];
        this.specsChecked.forEach((item,index) => {
              item.svalue.length>0?this.skuArray.push(item.svalue):'';
          });
        this.skuList=this.compose(this.skuArray);
        this.skuList.forEach((item,index) => {
         item['const_price']='';
         item['price']='';
         item['stock']=0;
          });
        if(this.skuArray.length==this.specsOption.length){
           this.skushow=true;
        }
    },
    //自由组合算法-reduce
    compose(arr) {
        return arr.reduce((acc, item) => {
            const res = [];
            for (let i = 0; i < acc.length; i++) {
                for (let j = 0; j < item.length; j++) {
                    const prev = [].concat(acc[i])
                    res.push([...prev, item[j]]);
             }
            }
            return res
        })
    },


    onSubmit() {
      let _this = this;
      _this.form.content=tinymce.activeEditor.getContent();
      _this.skuList.forEach((item,index) => {
           for(let i=0;i<this.specsOption.length;i++){
              _this.skuList[index][i]=item[i]['id'];
          }
           _this.skuList[index]  = Object.assign({},_this.skuList[index]);
          });
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.axios
            .post("product/add", {product:_this.form,
            skuList:_this.skuList
            })
            .then(function (res) {
              if (res.data.status == 1||res.data.status==-6) {
                _this.$message.success({
                  message: res.data.message,
                  type: "success",
                });
                _this.$router.push({ path: '/ProductList',  query: { cate_id: _this.form.cate_id} })
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


    handleRemove(fileList) {
      this.form.image='';
    },
    handleSuccess(response, fileList) {
      if (response.status == 1) {
        this.$message.success({
          message: response.message,
          type: "success",
        });
        this.form.image = response.result['url'];
      } else {
        this.$message.error(response.message);
      }
    },

    
  },
};
</script>

<style scoped lang="scss">
form {
  margin: 0 auto;
}
.back{
  margin: 20px;
}
.el-tabs__content .el-row{
  margin: 20px 0;
  vertical-align: middle;
  li{
    margin: 0 20px;
  }
}
li{
   list-style: none; 
}
</style>
          