import utils from "../Utils"
import { api } from "../paths"

export const createProject = async (body) => {
    return utils.fetch.httpPost(api.projects.create, body);
};

export const getProject = async (id) => {
    return utils.fetch.httpGet(utils.url.replaceId(api.projects.get, id));
};

export const getAllProjects = async () => {
    return utils.fetch.httpGet(api.projects.getAll);
};

export const updateProject = async (id, data) => {
    const url = utils.url.replaceId(api.projects.update, id);
    return utils.fetch.httpPost(url, data);
};

export const getProjectByOwner = async (ownerId, page, limit, search = '') => {
    let url = utils.url.replaceId(api.projects.getProjectByOwner, ownerId);
    if (page) {
        url += `?page=${page}`;
    }
    if (limit) {
        url += page ? `&limit=${limit}` : `?limit=${limit}`;
    }
    if (search) {
        url += url.includes('?') ? `&search=${search}` : `?search=${search}`;
    }
    return utils.fetch.httpGet(url);
};  

export const deleteProject = async (id) => {
    return utils.fetch.httpDelete(utils.url.replaceId(api.projects.delete, id));
};

export const addMembersToProject = async (id, data) => {
    return utils.fetch.httpPatch(utils.replace(api.projects.addMembers, { id }), data)
};

export const removeMembersFromProject = async (id, data) => {
    return utils.fetch.httpPatch(utils.replace(api.projects.removeMembers, { id }), data)
};