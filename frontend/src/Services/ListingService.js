import utils from "../Utils"
import { api } from "../paths"
import axios from "axios"

export const createListing = async (body) => {
    return utils.fetch.httpPost(api.listings.create, body);
};

export const getListing = async (id) => {
    return utils.fetch.httpGet(utils.url.replaceId(api.listings.get, id));
};

export const searchListings = async (page, limit, query = {}) => {
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
    return axios.get(`${process.env.REACT_APP_API_URL}${api.listings.search}`, {
        params: query
    })
    .then(
        response => response.data
    )

};

export const getAllListings = async () => {
    return utils.fetch.httpGet(api.listings.getAll);
};

export const getDevelopers = async () => {
    return utils.fetch.httpGet(api.listings.getDevelopers);
};

export const updateListing = async (id, data) => {
    const url = utils.url.replaceId(api.listings.update, id);
    return utils.fetch.httpPost(url, data);
};

export const getListingsByDeveloper = async (developerId, page, limit) => {
    let url = utils.url.replaceId(api.listings.getByDeveloper, developerId);
    if (page) {
        url += `?page=${page}`;
    }
    if (limit) {
        url += page ? `&limit=${limit}` : `?limit=${limit}`;
    }
    return utils.fetch.httpGet(url);
};

export const deleteListing = async (id) => {
    return utils.fetch.httpDelete(utils.url.replaceId(api.listings.delete, id));
};