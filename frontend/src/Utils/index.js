import newGuid from './guid';
import * as url from './url';
import * as fetch from './fetch';
import * as string from './string';
import moment from 'moment';

const dateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD [at] h:mm A z');
}

const utils = {
  newGuid: newGuid,
  url: url,
  fetch: fetch,
  dateFormat: dateFormat,
  string: string,
}

export default utils;
