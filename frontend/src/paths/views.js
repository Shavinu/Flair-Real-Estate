import React from "react";
import { ForgotPassword, Login, Register, VerifyEmail } from "src/pages/auth";
import Overview from "src/pages/dashboard/overview";
import { UserCreate, UserEdit, UserList } from "src/pages/dashboard/users";
import { ICONS } from "../components/icons";
import paths from "./paths";
import { ClientHome } from "src/pages/client/home";
import { PropertyHomeDetail, PropertyHomeList } from "src/pages/client/properties";
import { ProjectHomeDetail } from "src/pages/client/projects";
import { ListingHomeDetail } from "src/pages/client/listings";
import NotFoundPage from "src/pages/404";
import { Navigate } from "react-router-dom";
import { GroupCreate, GroupEdit, GroupList } from "src/pages/dashboard/groups";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { ProjectCreate, ProjectEdit, ProjectList } from "src/pages/dashboard/projects";
import { Add, Apartment, List } from "@mui/icons-material";
import { ListingCreate, ListingEdit, Listings } from "src/pages/dashboard/listings";

const auth = [
  {
    name: 'Login',
    action: paths.auth.login,
    element: <Login />,
  },
  {
    name: 'Register',
    action: paths.auth.register,
    element: <Register />,
  },
  {
    name: 'Verify Email',
    action: `/auth/verify/:userId/:token`,
    element: <VerifyEmail />,
  },
  {
    name: "Forgot",
    action: paths.auth.forgotPassword,
    element: <ForgotPassword />,
  },
];

const dashboard = [
  {
    name: 'Overview',
    action: paths.dashboard.root,
    icon: ICONS.analytics,
    element: <Overview />,
  },
  {
    name: 'Users',
    action: paths.dashboard.users.list,
    icon: ICONS.user,
    children: [
      {
        name: 'List',
        action: paths.dashboard.users.list,
        element: <UserList />,
      },
      {
        name: 'Create',
        action: paths.dashboard.users.create,
        element: <UserCreate />
      },
      {
        name: 'Edit',
        action: paths.dashboard.users.edit,
        element: <UserEdit />,
        isRoute: true
      },
    ]
  },
  {
    name: 'Groups',
    action: paths.dashboard.groups.root,
    icon: <PeopleAltIcon fontSize="small" />,
    children: [
      {
        name: 'List',
        action: paths.dashboard.groups.root,
        element: <GroupList />,
      },
      {
        name: 'Create',
        action: paths.dashboard.groups.create,
        element: <GroupCreate />
      },
      {
        name: 'Edit',
        action: paths.dashboard.groups.edit,
        element: <GroupEdit />,
        isRoute: true
      },
    ]
  },
  {
    name: 'Projects',
    action: paths.dashboard.projects.root,
    icon: <Apartment fontSize="small" />,
    children: [
      {
        name: 'List',
        action: paths.dashboard.projects.root,
        element: <ProjectList />,
      },
      {
        name: 'Create',
        action: paths.dashboard.projects.create,
        element: <ProjectCreate />,
      },
      {
        name: 'Edit',
        action: paths.dashboard.projects.edit,
        element: <ProjectEdit />,
        isRoute: true
      },
    ]
  },
  {
    name: 'Listings',
    action: paths.dashboard.listings.root,
    icon: <List fontSize="small" />,
    children: [
      {
        name: 'List',
        action: paths.dashboard.listings.root,
        element: <Listings />,
      },
      {
        name: 'Create',
        action: paths.dashboard.listings.create,
        element: <ListingCreate />
      },
      {
        name: 'Edit',
        action: paths.dashboard.listings.edit,
        element: <ListingEdit />,
        isRoute: true
      },
    ]
  }
];

const client = [
  {
    name: 'Home',
    action: paths.client.home,
    element: <ClientHome />,
  },
  {
    name: 'Properties',
    action: paths.client.properties.list,
    element: <PropertyHomeList />,
  },
  {
    name: 'Properties Detail',
    action: paths.client.properties.detail,
    element: <PropertyHomeDetail />,
    isRoute: true,
  },
  {
    name: 'Project Detail',
    action: paths.client.projects.detail,
    element: <ProjectHomeDetail />,
    isRoute: true,
  },
  {
    name: 'Listing Detail',
    action: paths.client.listings.detail,
    element: <ListingHomeDetail />,
    isRoute: true,
  },
  {
    action: "/404",
    element: <NotFoundPage />,
    isRoute: true,
  },
  {
    action: "*",
    element: <Navigate to="/404" replace />,
    isRoute: true,
  }]

const views = {
  auth,
  dashboard,
  client,
};

export default views;
