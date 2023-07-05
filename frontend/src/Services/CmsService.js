import utils from "../Utils"
import { api } from "../paths"

export const getPages = () => {
    return utils.fetch.httpGet(api.cms.getAll);
};

export const findPage = (page) => {
    return utils.fetch.httpGet(utils.url.replaceId(api.cms.get, page));
};

export const createPage = (body) => {
    return utils.fetch.httpPost(api.cms.createOrUpdate, body);
};


export const updatePage = (page, body) => {
    return utils.fetch.httpPatch(utils.url.replaceId(api.cms.update, page), body);
};


export const deletePage = (id) => {
    return utils.fetch.httpDelete(utils.url.replaceId(api.cms.delete, id));
};

