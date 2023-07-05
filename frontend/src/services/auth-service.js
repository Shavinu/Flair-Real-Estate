import { api } from "../paths";
import utils from "../utils";

const login = (credentials) => {
  return utils.fetch.httpPost(api.auth.login, credentials)
}

const getCurrentUser = (token) => {
  return utils.fetch.httpPost(api.auth.currentUser)
}

const forgotPassword = (body) => {
  return utils.fetch.httpPost(api.auth.forgotPassword, body)
}

const verifyEmail = (userId, token) => {
  const url = api.auth.verifyEmail.replace(':userId', userId).replace(':token', token);

  return utils.fetch.httpGet(url);
}

const verifyLicence = (accType, licence) => {
  const url = api.auth.verifyLicence.replace(':accType', accType).replace(':licence', licence);

  return utils.fetch.httpGet(url)
}

const AuthService = {
  login,
  getCurrentUser,
  forgotPassword,
  verifyEmail,
  verifyLicence,
}

export default AuthService
