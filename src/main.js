import { createApp } from 'vue';
import App from './App.vue';
//import { createStore } from 'vuex'
import router from './router';
import axios  from 'axios';
import VueAxios from 'vue-axios'; 
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/css/global.css';
import './assets/css/icon.css';
import * as echarts from "echarts";
const app = createApp(App);
axios.defaults.baseURL='http://www.xwsysapi.com/admin/';
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(config => { 
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config;
    },
    error => {
      return Promise.reject(error);
    });
app.use(VueAxios,axios);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.$echarts = echarts
app.mount('#app');
