const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
}

const paths = {
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
    },
    groups: {
      root: `${ROOTS.DASHBOARD}/groups`,
      create: `${ROOTS.DASHBOARD}/groups/create`,
      edit: `${ROOTS.DASHBOARD}/groups/:id`
    },
    projects: {
      root: `${ROOTS.DASHBOARD}/projects`,
      create: `${ROOTS.DASHBOARD}/projects/create`,
      edit: `${ROOTS.DASHBOARD}/projects/:id`
    },
    listings: {
      root: `${ROOTS.DASHBOARD}/listings`,
      create: `${ROOTS.DASHBOARD}/listings/create`,
      edit: `${ROOTS.DASHBOARD}/listings/:id`
    }
  },
  client: {
    home: '/',
    properties: {
      list: `/properties`,
    },
    projects: {
      detail: '/projects/:id',
    },
    listings: {
      detail: '/listings/:id',
    },
    about: `/about`,
    contact: `/contact`,
  }
}

export default paths;
