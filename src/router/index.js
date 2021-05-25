import {
    createRouter,
    createWebHashHistory
} from 'vue-router';
import Index from '../views/Index.vue';
import Login from '../views/Login.vue';
import Welcome from '../views/Welcome.vue';
import Admin from '../views/Admin.vue';
import Rules from '../views/Rules.vue';
import AuthGroup from '../views/AuthGroup.vue';
import ProductCate from '../views/ProductCate.vue';
import Product from '../views/Product.vue';
import News from '../views/News.vue';
import NewsCate from '../views/NewsCate.vue';
import ProAdd from '../views/ProAdd.vue';
import ProductList from '../views/ProductList.vue'
import ProEdit from '../views/ProEdit.vue'
import Specs from '../views/Specs.vue'
import SpecsValue from '../views/SpecsValue.vue'
import test from '../views/test.vue'
import error from '../views/error.vue'

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/index',
        component: Index,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome,
            },
            {
                path: '/productcate',
                component: ProductCate,
            },
            {
                path: '/product',
                component: Product,
            },
            {
                path: '/newscate',
                component: NewsCate,
            },
            {
                path: '/news',
                component: News,
            },
            {
                path: '/admin',
                component: Admin
            },
            {
                path: '/rules',
                component: Rules,
            },
            {
                path: '/authgroup',
                component: AuthGroup,
            },
            {
                name:'proadd',
                path: '/proadd',
                component: ProAdd,
            },
            {
                name:'ProductList',
                path: '/ProductList',
                component: ProductList,
            },
            {
                name:'ProEdit',
                path: '/ProEdit',
                component: ProEdit,
            },
            {
                name:'Specs',
                path: '/Specs',
                component: Specs,
            },
            {
                name:'SpecsValue',
                path: '/SpecsValue',
                component: SpecsValue,
            },
            {
                name:'error',
                path: '/error',
                component: error,
            },
            {
                path: '/test',
                component: test,
            },
        ]
    },


]


const router = createRouter({
    history: createWebHashHistory(),
    routes
});

//路由守卫
router.beforeEach((to, from, next) => {
    const tokenStr = window.sessionStorage.getItem('token');
    if (to.matched.length ===0) {
        from.name ? next({ name:from.name }) : next('/error');
    }
    //访问登录页的时候直接放行
    if (to.path == '/login') {
        return next();
    };
    //没有token，强制跳转
    if (!tokenStr) {
        return next('/login');
    }
    next();
})

export default router