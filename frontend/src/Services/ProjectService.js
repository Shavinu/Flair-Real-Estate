import utils from "../Utils"
import { api } from "../paths"
import axios from "axios"

export const createProject = async (body) => {
    return utils.fetch.httpPost(api.projects.create, body);
};

export const getProject = async (id) => {
    return utils.fetch.httpGet(utils.url.replaceId(api.projects.get, id));
};

export const getAllProjects = async () => {
    return utils.fetch.httpGet(api.projects.getAll);
};

export const getUnapprovedProjects = async () => {
    return utils.fetch.httpGet(api.projects.getUnapproved);
};

export const approveProjects = async (id) => {
    return utils.fetch.httpPost(api.projects.approve, id);
};

export const updateProject = async (id, data) => {
    const url = utils.url.replaceId(api.projects.update, id);
    return utils.fetch.httpPost(url, data);
};

export const searchProjects = async (page, limit, query = {}) => {
    if (query) {
        query.page = page;
        query.limit = limit;
    } else {
        query = {
            page: page,
            limit: limit,
        };
    }

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    return axios.get(`${process.env.REACT_APP_API_URL}${api.projects.search}`, {
        params: query
    })
        .then(
            response => response.data
        )
};

export const getProjectOwners = async () => {
    return utils.fetch.httpGet(api.projects.getProjectOwners);
};

export const getProjectByOwner = async (ownerId, page, limit, search = '', initialData) => {
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
    if (initialData) {
        url += url.includes('?') ? `&initialData=${initialData}` : `?initialData=${initialData}`;
    }
    return utils.fetch.httpGet(url);
};

export const deleteProject = async (id) => {
    console.log(JSON.stringify(id));
    return utils.fetch.httpDelete(utils.url.replaceId(api.projects.delete, id));
};

export const addMembersToProject = async (id, data) => {
    return utils.fetch.httpPatch(utils.replace(api.projects.addMembers, { id }), data)
};

export const removeMembersFromProject = async (id, data) => {
    return utils.fetch.httpPatch(utils.replace(api.projects.removeMembers, { id }), data)
};
