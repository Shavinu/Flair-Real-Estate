import utils from "../Utils"
import { api } from "../paths"

export const getUserList = () => {
  return utils.fetch.httpGet(api.users.list);
}

export const deleteUser = (id) => {
  return utils.fetch.httpDelete(utils.url.replaceId(api.users.delete, id));
}
