import * as React from 'react';
import { useEffect, useState } from 'react';
import * as GroupService from '../../../../Services/GroupService';
import utils from '../../../../Utils';
import { Link } from 'react-router-dom';

const ExpandedComponent = ({ data, setSelectedGroup, onSelectDelete }) => {
  const [subGroups, setSubGroups] = useState([]);

  const getSubGroupsByParentGroupId = (id) => {
    GroupService.getSubGroupsByParentGroupId(id)
      .then(response => setSubGroups(response));
  }

  useEffect(() => {
    if (data) {
      getSubGroupsByParentGroupId(data._id);
    }
  }, [data]);

  if (subGroups.length <= 0) {
    return <>
    </>
  }

  return <>
    {subGroups.map(group =>
      <div className="sc-jsMahE cKBiPJ rdt_TableRow" key={utils.newGuid()}>
        <div className="sc-hLseeU sc-gLDzan bEtVpA jICeoa rdt_TableCell">
        </div>
        <div className="sc-hLseeU sc-fsQiph bEtVpA cLPfJ">
          {/* <button aria-disabled="false" data-testid="expander-button-undefined" aria-label="Collapse Row" type="button" className="sc-iAEyYk bwdzsl">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path><path d="M0-.75h24v24H0z" fill="none"></path></svg>
        </button> */}

        </div>
        <div className="sc-hLseeU sc-eDDNvR sc-jTrPJq dpxigv gSVZoG dlfHg rdt_TableCell">
          <div>{group.groupName || '--'}</div>
        </div>
        <div className="sc-hLseeU sc-eDDNvR sc-jTrPJq dpxigv gSVZoG dlfHg rdt_TableCell">
          <div>{group.groupEmail || '--'}</div>
        </div>
        <div className="sc-hLseeU sc-eDDNvR sc-jTrPJq dpxigv gSVZoG dlfHg rdt_TableCell">
          <div>{group.groupContact || '--'}</div>
        </div>
        <div className="sc-hLseeU sc-eDDNvR sc-jTrPJq dpxigv gSVZoG dlfHg rdt_TableCell">
          <div>{group.groupArea || '--'}</div>
        </div>
        <div className="sc-hLseeU sc-eDDNvR sc-jTrPJq dpxigv gSVZoG djiwdj rdt_TableCell">
          {group.updatedAt ? utils.dateFormat(group.updatedAt) : '--'}
        </div>
        <div className="sc-hLseeU sc-eDDNvR sc-jTrPJq dpxigv jtrjYX djiwdj rdt_TableCell">
          <button className="btn btn-icon btn-sm btn-flat-secondary my-1"
            data-backdrop="false"
            data-target="#group-members-modal"
            data-toggle="modal"
            onClick={() => setSelectedGroup(group)}
          >
            <i className="feather icon-eye"></i>
          </button>
        </div>
        <div className="sc-hLseeU sc-eDDNvR sc-jTrPJq dpxigv jtrjYX djiwdj rdt_TableCell">
          <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/groups/${group._id}`}>
            <i className="feather icon-edit"></i>
          </Link>
          <button type="button" className="waves-effect waves-light btn btn-icon btn-sm btn-flat-danger my-1" aria-haspopup="false" aria-expanded="true" onClick={() => onSelectDelete(group)}>
            <i className="feather icon-trash"></i>
          </button>
        </div>
      </div >)
    }
  </>
};

export default ExpandedComponent
