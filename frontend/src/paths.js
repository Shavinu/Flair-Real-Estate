import Dashboard from "./Pages/Admin/Dashboard"
import * as Users from "./Pages/Admin/Users"

import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/Register"

import FileUpload from "./Pages/File/Upload"
import FileStream from "./Pages/File/Stream"
import FileUpdates from "./Pages/File/Update"

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
    name : 'Upload File',
    action: '/files/upload',
    element: <FileUpload />,
    isRoute: true,
  },
  {
    name : 'Stream File',
    action: '/files/stream',
    element: <FileStream />,
    isRoute: true,
  },
  {
    name : 'Update Files',
    action: '/files/update',
    element: <FileUpdates />,
    isRoute: true,
  },
  {
    name: 'Edit Users',
    action: '/users/:id',
    icon: 'feather icon-user',
    element: <Users.Edit />,
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
  },
  users: {
    list: '/api/users',
    create: '/api/users/create',
    edit: '/api/users/{{id}}',
    delete: '/api/users/{{id}}',
    deleteMany: '/api/users/delete-many',
  },
  files: {
    uploadSingle: '/api/files/uploadSingle',
    uploadMultiple: '/api/files/uploadMultiple',
    search: '/api/files/search',
    updateSingle: '/api/files/update',
    updateMultiple: '/api/files/update',
    stream: '/api/files/stream',
    download: '/api/files/download',
  }
}
