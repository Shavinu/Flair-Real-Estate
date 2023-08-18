const api = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    forgotPassword: '/api/auth/forgot-password',
    currentUser: '/api/auth/current-user',
    sendVerifyEmail: 'api/auth/send-verify-email',
    verifyEmail: 'api/auth/verify/:userId/:token',
    verifyLicence: '/api/auth/verify-licence/:accType/:licence',
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
    addManyUsersToGroup: '/api/groups/addManyUsersToGroup',
    removeUserFromGroup: '/api/groups/deleteUserFromGroup',
    removeManyUsersFromGroup: '/api/groups/removeManyUsersFromGroup',
  },
  projects: {
    get: '/api/projects/{{id}}',
    list: '/api/projects',
    search: '/api/search/projects_search',
  },
  files: {
    stream: '/api/files/stream/{{id}}',
  },
  listings: {
    get: '/api/listings/{{id}}',
    search: '/api/search/listings_search',
  }
}

export default api;
