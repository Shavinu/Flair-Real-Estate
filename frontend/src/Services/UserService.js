import utils from "../Utils"
import { api } from "../paths"

export const getUserList = () => {
  return utils.fetch.httpGet(api.users.list);
}

export const getUserDetailById = (id) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.users.edit, id));
}

export const createUser = (body) => {
  return utils.fetch.httpPost(api.users.create, body);
}

export const updateUser = (id, body) => {
  return utils.fetch.httpPatch(utils.url.replaceId(api.users.edit, id), body);
}

export const deleteUser = (id) => {
  return utils.fetch.httpDelete(utils.url.replaceId(api.users.delete, id));
}

export const deleteManyUser = (ids) => {
  return utils.fetch.httpPost(api.users.deleteMany, ids);
}
