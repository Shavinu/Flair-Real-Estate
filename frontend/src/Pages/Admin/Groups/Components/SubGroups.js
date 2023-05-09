import { useState, useEffect } from "react";
import GroupInformationForm from "./GroupInformationForm";
import * as GroupService from "../../../../Services/GroupService";
import { Col, Dropdown, Row } from "../../../../Components";
import DataTable from "react-data-table-component";

const SubGroups = ({ group }) => {
  const [subGroup, setSubGroup] = useState({});
  const [subGroups, setSubGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isCreatingSubGroup, setIsCreatingSubGroup] = useState(false);
  const [setShowConfirmDeleteOneGroupModal, setsetShowConfirmDeleteOneGroupModal] = useState(false);
  const [setShowConfirmDeleteManyGroupsModal, setsetShowConfirmDeleteManyGroupsModal] = useState(false);

  const getSubGroupsByParentGroupId = (id) => {
    GroupService.getSubGroupsByParentGroupId(id)
      .then(response => setSubGroups(response));
  }

  useEffect(() => {
    if (group) {
      getSubGroupsByParentGroupId(group._id);
    }
  }, [group]);

  return <>
    {!group
      ? <p>No Group Found !</p>
      : <>
        {isCreatingSubGroup && <GroupInformationForm group={subGroup} />}
        <Row>
          <Col sm={12}>
            <div className="d-flex justify-content-between">
              <h2>aah</h2>
              <h2>asdba</h2>
            </div>
          </Col>
        </Row>

        {selectedGroups.length > 0 && <Dropdown
          className="btn btn-outline-success"
          label={`${selectedGroups.length} items selected`}
          items={[
            {
              name: "Remove selected users from group",
              onClick: () => setShowConfirmDeleteManyGroupsModal(true)
            },
          ]} />}

        <DataTable
          columns={[
            {
              name: 'Name',
              selector: group => group.groupName || '--',
              sortable: true,
            },
            {
              name: 'Email',
              selector: group => group.groupEmail || '--',
              sortable: true,
            },
            {
              name: 'Contact',
              selector: row => row.groupContact || '--',
              sortable: true,
            },
            {
              name: 'Area',
              selector: row => row.groupArea || '--',
              sortable: true,
            },
          ]}
        />

      </>
    }
  </>
}

export default SubGroups;
