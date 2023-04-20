import moment from "moment"
import utils from "../Utils"
import { api } from "../paths"

export const login = (credentials) => {
  return utils.fetch.httpPost(api.auth.login, credentials)
    .then((response) => {
      let user = response;
      localStorage.setItem('user', JSON.stringify(user));
    })
}

export const register = (credentials) => {
  return utils.fetch.httpPost(api.auth.register/*api.auth.verify*/, credentials)
    .then((response) => {
      let user = response;
      localStorage.setItem('user', JSON.stringify(user));
    })
}

export const logout = () => {
  localStorage.clear();
}
