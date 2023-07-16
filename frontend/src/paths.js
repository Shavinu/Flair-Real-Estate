import { ICONS, SvgColor } from "./components/icons";
import * as Auth from "./pages/auth";
import * as Dashboard from "./pages/dashboard";
import * as Client from "./pages/client";

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  Client: '/',
};

export const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`
  },
  dashboard: {
    root: `${ROOTS.DASHBOARD}`,
    one: `${ROOTS.DASHBOARD}/one`,
    four: `${ROOTS.DASHBOARD}/four`,
    users: {
      list: `${ROOTS.DASHBOARD}/users`,
      create: `${ROOTS.DASHBOARD}/users/create`,
      edit: `${ROOTS.DASHBOARD}/users/:id`
    }
  },
  client: {
    home: ROOTS.Client,
    about: `${ROOTS.Client}/about`,
    contact: `${ROOTS.Client}/contact`,
  }
}

export const api = {
  auth: {
    login: '/api/auth/login',
    forgotPassword: '/api/auth/forgot-password',
    currentUser: '/api/auth/current-user',
    verifyEmail: 'api/auth/verify/:userId/:token',
    verifyLicence: '/api/auth/verify-licence/:accType/:licence',
  },
  users: {
    list: '/api/users',
    create: '/api/users',
    edit: '/api/users/{{id}}',
    delete: '/api/users/{{id}}',
    deleteMany: '/api/users/delete-many',
  },
  projects: {
    list: '/api/projects',
    search: '/api/search/projects_search',
  },
  files: {
    stream: '/api/files/stream/{{id}}',
  },
  listings: {
    search: '/api/search/listings_search',
  }
}

export const views = [
  {
    name: 'Overview',
    action: paths.dashboard.root,
    icon: ICONS.analytics,
    element: <Dashboard.Home />,
  },
  {
    name: 'Users',
    action: paths.dashboard.users.list,
    icon: ICONS.user,
    children: [
      {
        name: 'List',
        action: paths.dashboard.users.list,
        element: <Dashboard.Users.List />,
      },
      {
        name: 'Edit',
        action: paths.dashboard.users.edit,
        element: <Dashboard.Users.Edit />,
        isRoute: true
      },
    ]
  },
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
    element: <Auth.Register />,
  },
  {
    name: 'Verify Email',
    action: `/auth/verify/:userId/:token`,
    element: <Auth.VerifyEmail />,
  },
  {
    name: "Forgot",
    action: '/auth/forgot-password',
    element: <Auth.ForgotPassword />,
  },
  // {
  //   name: "Reset",
  //   action: '/auth/reset-password/:userId/:token',
  //   element: <Auth.ResetPassword />,
  // },
];

export const ClientViews = [
  {
    name: 'Home',
    action: paths.client.home,
    element: <Client.Home />,
  },
];
