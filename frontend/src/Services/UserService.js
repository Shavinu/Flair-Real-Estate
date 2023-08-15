import utils from '../Utils';
import { api } from '../paths';

export const getUserList = () => {
  return utils.fetch.httpGet(api.users.list);
};

export const getUserDetailById = (id) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.users.edit, id));
};

export const createUser = (body) => {
  return utils.fetch.httpPost(api.users.create, body);
};

export const updateUser = (id, body) => {
  return utils.fetch.httpPatch(utils.url.replaceId(api.users.edit, id), body);
};

export const approveUser = (id, body) => {
  return utils.fetch.httpPatch(utils.url.replaceId(api.users.approve, id), body);
};

export const deleteUser = (id) => {
  return utils.fetch.httpDelete(utils.url.replaceId(api.users.delete, id));
};

export const deleteManyUser = (ids) => {
  return utils.fetch.httpPost(api.users.deleteMany, ids);
};

export const requestChange = (credentials) => {
  return utils.fetch
    .httpPost(api.users.requestChange, credentials)
    .then((response) => {
      return response;
    });
};

export const verifyRequest = (userId, token, company) => {
  const url = api.users.verifyRequest
    .replace(':userId', userId)
    .replace(':token', token)
    .replace(':company', company);
  return utils.fetch
    .httpGet(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        return Promise.resolve(error.response.data);
      }
      return Promise.reject(error);
    });
};

export const deleteToken = (credentials) => {
  return utils.fetch
    .httpPost(api.users.deleteToken, credentials)
    .then((response) => {
      return response;
    });
};
