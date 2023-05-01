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
  return utils.fetch.httpGet(api.files.search, searchParams);
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

export const downloadFile = (fileId) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.files.download, fileId));
};
