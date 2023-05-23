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
  return utils.fetch.httpPost(api.auth.register, credentials)
    .then((response) => {
      let user = response;
      localStorage.setItem('user', JSON.stringify(user));
    })
}

export const verifyLicence = (accType, licence) => {
  const url = api.auth.verifyLicence.replace(':accType', accType).replace(':licence', licence);

  return utils.fetch.httpGet(url)
    .then(response => {
      return response;
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        return Promise.resolve(error.response.data);
      }
      console.error(error);
      return Promise.reject(error);
    });
};

export const verifyMobile = (areaCode, number) => {
  const url = api.auth.verifyMobile.replace(':code', areaCode).replace(':number', number);

  return utils.fetch.httpGet(url)
    .then(response => {
      return response;
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        return Promise.resolve(error.response.data);
      }
      console.error(error);
      return Promise.reject(error);
    });
};

export const logout = () => {
  localStorage.clear();
}
