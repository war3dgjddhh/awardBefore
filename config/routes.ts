export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/admin',
    name: '系统管理',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/user',
        name: '用户管理',
        component: './Admin/SysUser',
      },
      {
        path: '/admin/rule',
        name: '角色管理',
        component: './Admin/SysRule',
      },
      // {
      //   component: './404',
      // },
    ],
  },
  {
    path: '/',
    redirect: '/admin',
  },
  {
    component: './404',
  },
];
