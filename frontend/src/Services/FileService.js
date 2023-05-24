import utils from "../Utils";
import { api } from "../paths";

export const uploadSingle = (formData) => {
  return utils.fetch.httpPost(api.files.uploadSingle, formData, {
    'Content-Type': 'multipart/form-data',
  });
};

export const uploadMultiple = (formData) => {
  return utils.fetch.httpPost(api.files.uploadMultiple, formData, {
    'Content-Type': 'multipart/form-data',
  });
};

export const searchFiles = (searchParams) => {
  let queryString = '';
  Object.keys(searchParams).forEach((key) => {
    if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== '') {
      queryString += `${key}=${searchParams[key]}&`;
    }
  }
  );
  queryString = queryString.slice(0, -1);

  return utils.fetch.httpGet(`${api.files.search}?${queryString}`);
};

export const updateSingleFile = (fileId, body) => {
  return utils.fetch.httpPatch(utils.url.replaceId(api.files.updateSingle, fileId), body);
};

export const updateMultipleFiles = (body) => {
  return utils.fetch.httpPatch(api.files.updateMultiple, body);
};

export const streamFile = (fileId) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.stream, fileId));
};

export const getImageUrl = (imageId) => {
  return `${process.env.REACT_APP_API_URL}${utils.url.replaceId(api.files.stream, imageId)}`;
};

export const downloadFile = (fileId) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.download, fileId));
};

export const getFileUrl = (fileId) => {
  return `${process.env.REACT_APP_API_URL}${utils.url.replaceId(api.files.download, fileId)}`;
}

export const getAllFilesByUser = (userId) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.getAllByUser, userId));
};

export const getAllFilesByLabel = (label) => {
  return utils.fetch.httpGet(`${api.files.getAllByLabel}?label=${label}`);
};

export const deleteFiles = (fileIds) => {
  return utils.fetch.httpDelete(api.files.deleteMany, { fileIds: fileIds });
};

export const getFilesByParentId = (parentId) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.getByParentId, parentId));
};

export const getFilesByType = (type) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.getByType, type));
};