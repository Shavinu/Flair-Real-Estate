import { api } from "src/paths";
import utils from "src/utils";

const getGroupList = () => {
  return utils.fetch.httpGet(api.groups.list);
}

const getUsersByGroupId = (groupId) => {
  return utils.fetch.httpPost(api.groups.users, { _id: groupId });
}

const getSubGroupsByParentGroupId = (groupId) => {
  return utils.fetch.httpPost(api.groups.subGroups, { groupParentId: groupId });
}

const getAvailableUsers = () => {
  return utils.fetch.httpGet(api.groups.availableUsers);
}

const getGroupDetailById = (id) => {
  const url = api.groups.detail.replace('{{id}}', id);
  return utils.fetch.httpGet(url);
  // return utils.fetch.httpGet(utils.url.replaceId(api.groups.detail, id));
}

const createGroup = (body) => {
  return utils.fetch.httpPost(api.groups.create, body);
}

const updateGroup = (body) => {
  return utils.fetch.httpPut(api.groups.update, body);
}

const addUserToGroup = (body) => {
  return utils.fetch.httpPost(api.groups.addUserToGroup, body);
}

const addManyUsersToGroup = (body) => {
  return utils.fetch.httpPost(api.groups.addManyUsersToGroup, body);
}

const removeUserFromGroup = (body) => {
  return utils.fetch.httpPost(api.groups.removeUserFromGroup, body);
}
const removeManyUsersFromGroup = (body) => {
  return utils.fetch.httpPost(api.groups.removeManyUsersFromGroup, body);
}

const deleteManyGroups = (ids) => {
  return utils.fetch.httpPost(api.groups.deleteMany, ids);
}

const GroupService = {
  getGroupList,
  getAvailableUsers,
  getUsersByGroupId,
  getGroupDetailById,
  getSubGroupsByParentGroupId,
  createGroup,
  updateGroup,
  addUserToGroup,
  addManyUsersToGroup,
  removeUserFromGroup,
  removeManyUsersFromGroup,
  deleteManyGroups
}

export default GroupService
