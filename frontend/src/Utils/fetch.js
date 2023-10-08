import axios from "axios";
import { HOST_URL } from "../config-global";

export const http = axios.create({
  baseURL: HOST_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'True'
  },
  withCredentials: true,
})

export const httpGet = (url) => {
  return http.get(url)
    .then(
      response => response.data
    )
}

export const httpPost = (url, body, headers = {}) => {
  return http.post(url, body, { headers: headers })
    .then(
      response => response.data
    )
}

export const httpPut = (url, body) => {
  return http.put(url, body)
    .then(
      response => response.data
    )
}

export const httpPatch = (url, body) => {
  return http.patch(url, body)
    .then(
      response => response.data
    )
}


export const httpDelete = (url, body) => {
  return http.delete(url, body)
    .then(
      response => response.data
    )
}
