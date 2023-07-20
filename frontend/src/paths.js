import Home from './Pages/Admin/Home';
import * as Users from './Pages/Admin/Users';
import * as Groups from './Pages/Admin/Groups';
import * as Project from './Pages/Project';
import * as Dashboard from './Pages/ProfileDashboard';
import * as File from './Pages/File';
import * as Listing from './Pages/Listing';
import * as Auth from './Pages/Auth'
import * as About from "./Pages/Contact/About"
import * as ContactForm from "./Pages/Contact/ContactForm"
import * as BuyersArticles from './Pages/Resources/BuyersArticles';
import * as MortgageCal from './Pages/Resources/MortgageCal';
import * as News from './Pages/Resources/News';
import HomePage from './Pages/Client/Home/HomePage';
import AboutUs from './Pages/Client/About/AboutUs';
import ResourcesPage from './Pages/Client/Resources/ResourcesPage';
import MortCal from './Pages/Client/Resources/MortCal';
import BuyProcess from './Pages/Client/Resources/BuyProcess';
import PropNews from './Pages/Client/Resources/PropNews';
import Contact from './Pages/Client/Contact/Contact';
import ListingPage from './Pages/Client/Listing/ListingPage';
import AboutContent from './Pages/Admin/Management/AboutContent';
import ProjectDetail from './Pages/Client/Listing/ProjectDetail';
import ListingDetail from './Pages/Client/Listing/ListingDetail';

export const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  CLIENT: '/',
}

export const paths = {
  auth: {
    root: ROOTS.AUTH,
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    resetPassword: `${ROOTS.AUTH}/reset-password/:userId/:token`,
    verifyEmail: `${ROOTS.AUTH}/verify/:userId/:token`,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    users: {
      list: `${ROOTS.DASHBOARD}/users`,
    }
  },
}

export const views = [
  // {
  //   name: 'Home',
  //   action: '/',
  //   icon: 'feather icon-home',
  //   element: <Home />,
  // },
  {
    name: 'About',
    action: '/About',
    icon: 'feather icon-about',
    element: <About.default />,
    isRoute: true,
  },
  {
    name: 'Contact Form',
    action: '/ContactForm',
    icon: 'feather icon-about',
    element: <ContactForm.default />,
    isRoute: true,
  },
  {
    name: 'Buyers Articles',
    action: '/BuyersArticles',
    icon: 'feather icon-about',
    element: <BuyersArticles.default />,
    isRoute: true,
  },
  {
    name: 'Mortgage Calculator',
    action: '/MortgageCal',
    icon: 'feather icon-about',
    element: <MortgageCal.default />,
    isRoute: true,
  },
  {
    name: 'News',
    action: '/News',
    icon: 'feather icon-about',
    element: <News.default />,
    isRoute: true,
  },
  {
    name: 'CMS',
    action: '/AboutContent',
    icon: 'feather icon-about',
    element: <AboutContent />,
    isRoute: true,
  },
  {
    name: 'Users',
    action: '/users',
    icon: 'feather icon-user',
    element: <Users.List />,
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
    name: 'Request Change',
    action: '/users/request-change/:userId/:token/:company',
    icon: 'feather icon-user',
    element: <Dashboard.RequestChange />,
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
    icon: 'feather icon-inbox',
    children: [
      {
        name: 'Create Project',
        action: '/projects/create',
        icon: 'feather icon-plus-circle',
        element: <Project.Create />,
        isRoute: false,
      },
      {
        name: 'All Projects',
        action: '/projects',
        icon: 'feather icon-search',
        element: <Project.Search />,
        isRoute: false
      },
      {
        name: 'Your Projects',
        action: '/projects/your',
        icon: 'feather icon-layers',
        element: <Project.List />,
        isRoute: false
      }
    ]
  },
  {
    name: 'View Project',
    action: '/projects/:id',
    icon: 'feather icon-inbox',
    element: <Project.View />,
    isRoute: true,
  },
  {
    name: 'Edit Project',
    action: '/projects/:id/edit',
    icon: 'feather icon-inbox',
    element: <Project.Edit />,
    isRoute: true,
  },
  {
    name: 'Test',
    action: '/projects/test',
    icon: 'feather icon-inbox',
    element: <Project.Test />,
    isRoute: true,
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
        isRoute: false,
      },
      {
        name: 'Your Listings',
        action: '/listings/your',
        icon: 'feather icon-layers',
        element: <Listing.List />,
        isRoute: false,
      },
    ],
  },
  {
    name: 'View Listing',
    action: '/listings/:id',
    icon: 'feather icon-inbox',
    element: <Listing.View />,
    isRoute: true
  },
  {
    name: 'Edit Listing',
    action: '/listings/:id/edit',
    icon: 'feather icon-inbox',
    element: <Listing.Edit />,
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
    isRoute: true,
  },
  {
    name: 'File Upload',
    action: '/files/upload',
    icon: 'feather icon-inbox',
    element: <File.Upload />,
    isRoute: true,
  },
  {
    name: 'File Browser',
    action: '/files/browser',
    icon: 'feather icon-inbox',
    element: <File.Browser />,
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
];

export const AuthViews = [
  {
    name: 'Login',
    action: '/auth/login',
    element: <Auth.Login />,
  },
  {
    name: 'Register',
    action: '/auth/register',
    element: <Auth.RegisterGen />,
  },
  {
    name: 'Verify Email',
    action: `/auth/verify/:userId/:token`,
    element: <Auth.Verified />,
  },
  {
    name: "Forgot",
    action: '/auth/forgot-password',
    element: <Auth.ForgotPassword />,
  },
  {
    name: "Reset",
    action: '/auth/reset-password/:userId/:token',
    element: <Auth.ResetPassword />,
  },
];

export const ClientViews = [
  {
    name: 'HomePage',
    action: '/',
    icon: 'feather icon-home',
    element: <HomePage />,
  },
  {
    name: 'ListingPage',
    action: '/ListingPage',
    icon: 'feather icon-home',
    element: <ListingPage />,
  },
  {
    name: 'ListingDetail',
    action: '/ListingDetail/:id',
    icon: 'feather icon-home',
    element: <ListingDetail />,
  },
  {
    name: 'ProjectDetail',
    action: '/ProjectDetail/:id',
    icon: 'feather icon-home',
    element: <ProjectDetail />,
  },
  {
    name: 'AboutUs',
    action: '/AboutUs',
    icon: 'feather icon-about',
    element: <AboutUs />,
    isRoute: true,
  },
  {
    name: 'Resources',
    action: '/ResourcesPage',
    icon: 'feather icon-about',
    element: <ResourcesPage />,
    isRoute: true,
  },
  {
    name: 'MortCal',
    action: '/MortCal',
    icon: 'feather icon-about',
    element: <MortCal />,
    isRoute: true,
  },
  {
    name: 'BuyProcess',
    action: '/BuyProcess',
    icon: 'feather icon-about',
    element: <BuyProcess />,
    isRoute: true,
  },
  {
    name: 'PropNews',
    action: '/PropNews',
    icon: 'feather icon-about',
    element: <PropNews />,
    isRoute: true,
  },
  {
    name: 'Contact',
    action: '/Contact',
    icon: 'feather icon-about',
    element: <Contact />,
    isRoute: true,
  },

]

export const api = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    verifyLicence: '/api/auth/verify-licence/:accType/:licence',
    verifyEmail: 'api/auth/verify/:userId/:token',
    forgotPassword: 'api/auth/forgot-password',
    resetPassword: 'api/auth/reset-password/:userId/:token',
    updatePassword: 'api/auth/update-password',
  },
  users: {
    list: '/api/users',
    create: '/api/users/create',
    edit: '/api/users/{{id}}',
    delete: '/api/users/{{id}}',
    deleteMany: '/api/users/delete-many',
    requestChange: 'api/users/request-change',
    verifyRequest: 'api/users/verify-request/:userId/:token/:company',
    deleteToken: 'api/users/delete-token',
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
    removeManyUsersFromGroup: '/api/groups/removeManyUsersFromGroup',
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
    getByProjectId: '/api/files/projectId/{{id}}',
  },
  projects: {
    create: '/api/projects/',
    search: '/api/search/projects_search',
    get: '/api/projects/{{id}}',
    getAll: '/api/projects/',
    update: '/api/projects/{{id}}',
    delete: '/api/projects/{{id}}',
    getProjectOwners: '/api/search/projectOwners',
    getProjectByOwner: '/api/projects/owner/{{Id}}',
    addMembers: '/api/projects/{{id}}/add-members/',
    removeMembers: '/api/projects/{{id}}/remove-members/',
  },
  listings: {
    create: '/api/listings/create',
    search: '/api/search/listings_search',
    get: '/api/listings/{{id}}',
    getAll: '/api/listings',
    getDevelopers: '/api/search/developers',
    update: '/api/listings/{{id}}',
    delete: '/api/listings/{{id}}',
    getByDeveloper: '/api/listings/developer/{{id}}',
  },
  cms: {
    getAll: '/api/cms',
    get: '/api/cms/{{id}}',
    create: '/api/cms/create',
    update: '/api/cms/{{id}}',
    delete: '/api/cms/{{id}}'
  }
};
