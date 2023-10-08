import newGuid from './guid';
import * as url from './url';
import * as fetch from './fetch';
import * as string from './string';
import * as token from './token-validator';
import array from './array';
import file from './file';

const utils = {
  newGuid: newGuid,
  url: url,
  fetch: fetch,
  string: string,
  token: token,
  array: array,
  file: file
}

export default utils;
