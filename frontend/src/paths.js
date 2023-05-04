import Home from "./Pages/Admin/Home"
import * as Users from "./Pages/Admin/Users"
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/RegisterGen"
import * as Dashboard from "./Pages/ProfileDashboard"

export const views = [
  {
    name: 'Home',
    action: '/',
    icon: 'feather icon-home',
    element: <Home />
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
    name:'View Profile',
    action: '/profile/:id',
    element: <Dashboard.ViewProfile />
  },
  // {
  //   name: 'Edit Profile',
  //   action: '/profile/edit/:id',
  //   element: <Dashboard.EditProfile />
  // }
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

// export const pages = [
//   {
//     name:'View Profile',
//     action: '/profile/view',
//     element: <Dashboard.ViewProfile />
//   },
//   {
//     name: 'Edit Profile',
//     action: '/:id/profile/edit',
//     element: <Dashboard.EditProfile />
//   }
// ]

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
}
