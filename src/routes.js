import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import TableTest from './views/nav1/TableTest.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/updatePwd1',
        component: resolve => require(['./views/system/UpdatePw.vue'], resolve),
        name: '修改密码'
       
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '我的桌面',
        iconCls: 'fa fa-id-card-o',//图标样式class
        children: [
            { path: '/homeIndex',component: resolve => require(['./views/desktop/HomeIndex.vue'], resolve),  name: '主页' },
            { path: '/community',component: resolve => require(['./views/desktop/Community.vue'], resolve), name: '项目管理' },
            
            
            { path: '/resident',component: resolve => require(['./views/desktop/Resident.vue'], resolve), name: '住户管理' },
            
            
            
            
            
            
            
            // { path: '/work',component: resolve => require(['./views/desktop/Work.vue'], resolve), name: '工程商管理' },
            { path: '/worklist',component: resolve => require(['./views/desktop/WorkList.vue'], resolve), name: '用户管理列表' },
            { path: '/residentList',component: resolve => require(['./views/desktop/ResidentList.vue'], resolve), name: '用户管理列表' },
            { path: '/orderList',component: resolve => require(['./views/desktop/OrderList.vue'], resolve), name: '订单管理列表' },

           
            { path: '/authlist',component: resolve => require(['./views/desktop/AuthList.vue'], resolve), name: '授权管理列表' },
            { path: '/tableTest', component: TableTest, name: '列表测试' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa fa-id-card-o',//图标样式class
        children: [
            { path: '/message',component: resolve => require(['./views/system/Message.vue'], resolve),  name: '消息管理' },
            { path: '/notice',component: resolve => require(['./views/system/Notice.vue'], resolve), name: '公告管理' },
            { path: '/parameter',component: resolve => require(['./views/system/Parameter.vue'], resolve), name: '参数设置' },
            { path: '/role',component: resolve => require(['./views/system/Role.vue'], resolve), name: '权限管理' },
            { path: '/updatePw',component: resolve => require(['./views/system/UpdatePw.vue'], resolve), name: '修改密码' },
            { path: '/userInfo',component: resolve => require(['./views/system/UserInfo.vue'], resolve), name: '账户管理' },
            { path: '/userMessage',component: resolve => require(['./views/system/UserMessage.vue'], resolve), name: '基本信息' },
            
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;