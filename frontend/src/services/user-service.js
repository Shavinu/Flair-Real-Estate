import { api } from "../paths";
import utils from "../utils";

const getUserList = () => {
  return utils.fetch.httpGet(api.users.list);
}

const getUserDetailById = (id) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.users.edit, id));
}

export const createUser = (body) => {
  return utils.fetch.httpPost(api.users.create, body);
};

export const updateUser = (id, body) => {
  return utils.fetch.httpPatch(utils.url.replaceId(api.users.edit, id), body);
};

const deleteUser = (id) => {
  return utils.fetch.httpDelete(utils.url.replaceId(api.users.delete, id));
};

const deleteManyUsers = (ids) => {
  return utils.fetch.httpPost(api.users.deleteMany, ids);
};

const UserService = {
  getUserList,
  getUserDetailById,
  createUser,
  updateUser,
  deleteUser,
  deleteManyUsers,
}

export default UserService;
