import Dashboard from "./Pages/Admin/Dashboard"

import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register"

export const views = [
  {
    name: 'Dashboard',
    action: '/',
    icon: "feather icon-home",
    element: <Dashboard />
  },
  {
    name: 'Menu',
    icon: 'feather icon-menu',
    children: [
      {
        name: 'Second Level',
        action: '/second-level',
        element: <Dashboard />
      },
      {
        name: 'Second Level',
        action: '/second-level2',
        element: <Dashboard />
      }
    ],
  }
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
  },
  // categories: {
  //   list: '/api/v1/categories',
  //   create: '/api/v1/categories',
  //   edit: '/api/v1/categories/{{id}}',
  //   restoreMany: '/api/v1/categories/restore-many',
  //   deleteMany: '/api/v1/categories/delete-many',
  //   permanentDeleteMany: '/api/v1/categories/permanent-delete-many',
  // },
  // products: {
  //   list: '/api/v1/products',
  //   create: '/api/v1/products',
  //   edit: '/api/v1/products/{{id}}',
  //   deleteMany: '/api/v1/products/delete-many',
  //   status: '/api/v1/products/status',
  // },
  // roles: {
  //   list: '/api/v1/roles',
  //   create: '/api/v1/roles',
  //   edit: '/api/v1/roles/{{id}}',
  //   deleteMany: '/api/v1/roles/delete-many',
  // },
  // permissions: {
  //   list: '/api/v1/permissions',
  // },
  // users: {
  //   list: '/api/v1/users',
  //   create: '/api/v1/users',
  //   edit: '/api/v1/users/{{id}}',
  //   deleteMany: '/api/v1/users/delete-many',
  // },
}
