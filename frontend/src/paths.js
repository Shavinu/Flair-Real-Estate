import Dashboard from "./Pages/Admin/Dashboard"
import * as Users from "./Pages/Admin/Users"
import * as Groups from "./Pages/Admin/Groups"

import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/RegisterGen"

export const views = [
  {
    name: 'Dashboard',
    action: '/',
    icon: 'feather icon-home',
    element: <Dashboard />
  },
  {
    name: 'Users',
    action: '/users',
    icon: 'feather icon-user',
    element: <Users.List />
  },
  {
    name: 'Create Users',
    action: '/users/create',
    icon: 'feather icon-user',
    element: <Users.Create />,
    isRoute: true,
  },
  {
    name: 'Edit Users',
    action: '/users/:id',
    icon: 'feather icon-user',
    element: <Users.Edit />,
    isRoute: true,
  },
  {
    name: 'User Groups',
    action: '/groups',
    icon: 'feather icon-users',
    element: <Groups.List />,
  },
  {
    name: 'Create User Group',
    action: '/groups/create',
    element: <Groups.Create />,
    isRoute: true,
  },
  {
    name: 'Edit User Group',
    action: '/groups/:id',
    element: <Groups.Edit />,
    isRoute: true,
  },
  // {
  //   name: 'Menu',
  //   icon: 'feather icon-menu',
  //   children: [
  //     {
  //       name: 'Second Level',
  //       action: '/second-level',
  //       element: <Dashboard />
  //     },
  //     {
  //       name: 'Second Level',
  //       action: '/second-level2',
  //       element: <Dashboard />
  //     }
  //   ],
  // }
  // {
  //   name: 'Products',
  //   isRoute: false,
  //   icon: "fa fa-fw fa-hdd-o",
  //   children: [
  //     {
  //       name: 'Stock In',
  //       action: '/',
  //       element: <StockIn.List />,
  //       isRoute: false,
  //     },
  //     {
  //       name: 'Product List',
  //       action: '/products',
  //       element: <Products.List />,
  //       isRoute: false,
  //     },
  //     {
  //       name: 'Create New Product',
  //       action: '/products/create',
  //       element: <Products.Create />,
  //       isRoute: true,
  //     },
  //     {
  //       name: 'Edit Product',
  //       action: '/products/:id',
  //       element: <Products.Edit />,
  //       isRoute: true,
  //     },
  //   ],
  // },
]

export const AuthViews = [
  {
    name: 'Login',
    action: '/auth/login',
    element: <Login />,
  },
  {
    name: 'Register',
    action: '/auth/register',
    element: <Register />,
  }
]

export const api = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    verifyLicence: '/api/auth/verify-licence/:accType/:licence',
  },
  users: {
    list: '/api/users',
    create: '/api/users/create',
    edit: '/api/users/{{id}}',
    delete: '/api/users/{{id}}',
    deleteMany: '/api/users/delete-many',
  },
  groups: {
    list: '/api/groups/getGroups',
    create: '/api/groups/createGroup',
    detail: '/api/groups/getGroup/{{id}}',
    update: '/api/groups/updateGroup',
    deleteMany: '/api/groups/deleteManyGroups',
    users: '/api/groups/getUsersInGroup',
    availableUsers: '/api/groups/getAvailableUsers',
    addUserToGroup: '/api/groups/addUserToGroup',
    removeUserFromGroup: '/api/groups/deleteUserFromGroup',
    removeManyUsersFromGroup: '/api/groups/removeManyUsersFromGroup'
  }
}
