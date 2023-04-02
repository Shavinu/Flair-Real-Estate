import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

export const httpDelete = (url) => {
  return http.delete(url)
    .then(
      response => response.data
    )
}
