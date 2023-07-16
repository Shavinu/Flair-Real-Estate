import axios from "axios";
import { HOST_URL } from "../config-global";
import { api } from "../paths";

const searchListings = async (page, limit, query = {}) => {
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
  return axios.get(`${HOST_URL}${api.listings.search}`, {
    params: query
  })
    .then(
      response => response.data
    )
};

const ListingService = {
  searchListings
}

export default ListingService;
