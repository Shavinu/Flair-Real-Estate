import axios from "axios";
import { api } from "../paths";
import utils from "../utils";
import { HOST_URL } from "../config-global";

const getProjectList = () => {
  return utils.fetch.httpGet(api.projects.list);
}

export const getProjectDetail = async (id) => {
  return utils.fetch.httpGet(utils.url.replaceId(api.projects.get, id));
};

const searchProjects = async (page, limit, query = {}) => {
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
  return axios.get(`${HOST_URL}${api.projects.search}`, {
    params: query
  })
    .then(
      response => response.data
    )
};

const ProjectService = {
  getProjectList,
  getProjectDetail,
  searchProjects
}

export default ProjectService;
