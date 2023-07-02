import utils from "../Utils"
import { api } from "../paths"

export const getGroupList = () => {
  return utils.fetch.httpGet(api.groups.list);
}

export const getUsersByGroupId = (groupId) => {
  return utils.fetch.httpPost(api.groups.users, { _id: groupId });
}

export const getSubGroupsByParentGroupId = (groupId) => {
  return utils.fetch.httpPost(api.groups.subGroups, { groupParentId: groupId });
}

export const getAvailableUsers = () => {
  return utils.fetch.httpGet(api.groups.availableUsers);
}

export const getGroupDetailById = (id) => {
  const url = api.groups.detail.replace('{{id}}', id);
  return utils.fetch.httpGet(url);
  // return utils.fetch.httpGet(utils.url.replaceId(api.groups.detail, id));
}

export const createGroup = (body) => {
  return utils.fetch.httpPost(api.groups.create, body);
}

export const updateGroup = (body) => {
  return utils.fetch.httpPut(api.groups.update, body);
}

export const addUserToGroup = (body) => {
  return utils.fetch.httpPost(api.groups.addUserToGroup, body);
}

export const removeUserFromGroup = (body) => {
  return utils.fetch.httpPost(api.groups.removeUserFromGroup, body);
}
export const removeManyUsersFromGroup = (body) => {
  return utils.fetch.httpPost(api.groups.removeManyUsersFromGroup, body);
}

export const deleteManyGroups = (ids) => {
  return utils.fetch.httpPost(api.groups.deleteMany, ids);
}
