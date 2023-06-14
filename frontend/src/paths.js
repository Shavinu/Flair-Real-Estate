import Home from "./Pages/Admin/Home"
import * as Users from "./Pages/Admin/Users"
import * as Groups from "./Pages/Admin/Groups"
import * as Project from "./Pages/Project"
import Login from "./Pages/Auth/Login"
import Register from "./Pages/Auth/RegisterGen"
import * as Dashboard from "./Pages/ProfileDashboard"
import * as File from "./Pages/File"
// import Listing from "./Pages/Project/Test"
import * as Listing from "./Pages/Listing"

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
    name: 'View Profile',
    action: '/profile/:id',
    icon: 'feather icon-user-check',
    element: <Dashboard.ViewProfile />,
    isRoute: true,
  },
  {
    name: 'Edit Profile',
    action: '/profile/edit/:id',
    icon: 'feather icon-user-check',
    element: <Dashboard.EditProfile />,
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
  {
    name: 'Projects',
    action: '/projects',
    icon: 'feather icon-inbox',
    element: <Project.List />
  },
  {
    name: 'Create Project',
    action: '/projects/create',
    icon: 'feather icon-inbox',
    element: <Project.Create />,
    isRoute: true
  },
  {
    name: 'View Project',
    action: '/projects/:id',
    icon: 'feather icon-inbox',
    element: <Project.View />,
    isRoute: true
  },
  {
    name: 'Edit Project',
    action: '/projects/:id/edit',
    icon: 'feather icon-inbox',
    element: <Project.Edit />,
    isRoute: true
  },
  {
    name: 'Test',
    action: '/projects/test',
    icon: 'feather icon-inbox',
    element: <Project.Test />,
    isRoute: true
  },
  {
    name: 'Listings',
    icon: 'feather icon-list',
    children: [
      {
        name: 'Create Listing',
        action: '/listings/create',
        icon: 'feather icon-plus-circle',
        element: <Listing.Create />,
        isRoute: false,
      },
      {
        name: 'All Listings',
        action: '/listings',
        icon: 'feather icon-search',
        element: <Listing.Search />,
        isRoute: false
      },
      {
        name: 'Your Listings',
        action: '/listings/your',
        icon: 'feather icon-layers',
        element: <Listing.List />,
        isRoute: false
      }
    ]
  },
  {
    name: 'Create Project',
    action: '/listings/create',
    icon: 'feather icon-inbox',
    element: <Listing.Create />,
    isRoute: true
  },
  {
    name: 'View Listing',
    action: '/listings/:id',
    icon: 'feather icon-inbox',
    element: <Listing.View />,
    isRoute: true
  },
  // {
  //   name: 'Edit Listing',
  //   action: '/listings/:id/edit',
  //   icon: 'feather icon-inbox',
  //   element: <Listing.Edit />,
  //   isRoute: true
  // },
  {
    name: 'Test',
    action: '/listings/test',
    icon: 'feather icon-inbox',
    element: <Listing.Test />,
    isRoute: true
  },
  {
    name: 'File Upload',
    action: '/files/upload',
    icon: 'feather icon-inbox',
    element: <File.Upload />,
    isRoute: true
  },
  {
    name: 'File Browser',
    action: '/files/browser',
    icon: 'feather icon-inbox',
    element: <File.Browser />,
    isRoute: true
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
    verifyMobile: 'api/auth/verify-mobile/:code/:number'
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
    subGroups: '/api/groups/subGroups',
    availableUsers: '/api/groups/getAvailableUsers',
    addUserToGroup: '/api/groups/addUserToGroup',
    removeUserFromGroup: '/api/groups/deleteUserFromGroup',
    removeManyUsersFromGroup: '/api/groups/removeManyUsersFromGroup'
  },
  files: {
    uploadSingle: '/api/files/uploadSingle',
    uploadMultiple: '/api/files/uploadMultiple',
    search: '/api/files/search',
    updateSingle: '/api/files/update/{{id}}',
    updateMultiple: '/api/files/update',
    deleteSingle: '/api/files/delete/{{id}}',
    deleteMany: '/api/files/delete',
    stream: '/api/files/stream/{{id}}',
    download: '/api/files/download/{{id}}',
    getById: '/api/files/file/{{id}}',
    getAllByUser: '/api/files/user/{{id}}',
    getAllByFileName: '/api/files/filename/:filename',
    getAllByLabel: '/api/files/label/:label',
    getByParentId: '/api/files/parent/{{id}}',
    getByType: '/api/files/type/:type',
  },
  projects: {
    create: '/api/projects/',
    get: '/api/projects/{{id}}',
    getAll: '/api/projects/',
    update: '/api/projects/{{id}}',
    delete: '/api/projects/{{id}}',
    getProjectByOwner: '/api/projects/owner/{{Id}}',
    addMembers: '/api/projects/{{id}}/add-members/',
    removeMembers: '/api/projects/{{id}}/remove-members/'
  },
  listings: {
    create: '/api/listings/create',
    search: '/api/listings/search',
    get: '/api/listings/{{id}}',
    getAll: '/api/listings',
    getDevelopers: '/api/listings/developers',
    update: '/api/listings/{{id}}',
    delete: '/api/listings/{{id}}',
    getByDeveloper: '/api/listings/developer/{{id}}',
  }
}
