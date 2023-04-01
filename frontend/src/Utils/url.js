import { matchRoutes } from "react-router-dom";
import { views } from "../paths";
import { getPaths } from "../routes";

export const urlWithQueryString = (url, queryFilters) => {
  let queryStringArray = Object.keys(queryFilters).map(
    (queryName) => {
      if (
        queryFilters[queryName] === undefined
        || queryFilters[queryName] === null
        || queryFilters[queryName] === ''
      ) {
        return '';
      }
      return `${queryName}=` + encodeURI(queryFilters[queryName])
    },
  )

  queryStringArray = queryStringArray.filter(queryString => !!queryString);

  if (queryStringArray.length > 0) {
    let queryString = queryStringArray.join('&')

    url += (url.includes('?') ? '&' : '?') + queryString
  }

  return url
}

export const replaceId = (url, id) => {
  return url.replace(/\{\{\s*id\s*\}\}/gi, id.toString())
}

export const currentPath = (location) => {
  const paths = getPaths(views);
  const route = matchRoutes(paths, location);
  return route ? route[0].route.path : null
}
