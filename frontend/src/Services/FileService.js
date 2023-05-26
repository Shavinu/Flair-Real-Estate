import utils from "../Utils";
import { api } from "../paths";
import axios from "axios";

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
};

export const getFileById = (fileId) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.getById, fileId));
};

export const getAllFilesByUser = (userId) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.getAllByUser, userId));
};

export const getAllFilesByFileName = (fileName) => {
  const url = api.files.getAllByFileName.replace(':filename', fileName);
  return utils.fetch.httpGet(url);
};

export const getAllFilesByLabel = (label) => {
  const url = api.files.getAllByLabel.replace(':label', label);
  return utils.fetch.httpGet(url);
};

export const deleteFile = async (fileId) => {
  return utils.fetch.httpDelete(utils.url.replaceId(api.files.deleteSingle, fileId));
};

export const deleteFiles = (fileIds) => {
  return utils.fetch.httpPost(api.files.deleteMany, fileIds);
};

export const getFilesByParentId = (id) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.getByParentId, id));
};

export const getFilesByType = (type) => {
  const url = api.files.getByType.replace(':type', type);
  return utils.fetch.httpGet(url);
};