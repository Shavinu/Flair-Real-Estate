import newGuid from './guid';
import * as url from './url';
import * as fetch from './fetch';
import * as string from './string';
import moment from 'moment';

const dateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD [at] h:mm A z');
}

const flatten = (data: any, parent?: any, childHierarchy?: any) => {
  let newData: any = [];
  if (data) {
    data.forEach((initialRow: any, parentIndex: any) => {
      let parentHierarchy: any = [];
      initialRow.hierarchy = parentHierarchy;

      if (parent) {
        initialRow.parent = parent;
        parentHierarchy = [...childHierarchy];
        initialRow.hierarchy = parentHierarchy;
      }
      parentHierarchy.push(parentIndex);

      newData.push(initialRow);
      if (initialRow.children) {
        newData = [
          ...newData,
          ...flatten(
            initialRow.children,
            initialRow,
            parentHierarchy
          ),
        ];
      }
    });
  }

  return newData;
}

const utils = {
  newGuid: newGuid,
  url: url,
  fetch: fetch,
  dateFormat: dateFormat,
  string: string,
  flatten: flatten
}

export default utils;
