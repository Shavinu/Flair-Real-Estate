import { useState, useEffect } from "react";
import GroupInformationForm from "./GroupInformationForm";
import * as GroupService from "../../../../Services/GroupService";
import { Button, Col, ConfirmModal, Dropdown, Row } from "../../../../Components";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Toast from "../../../../Components/Toast";
import utils from "../../../../Utils";

const SubGroups = ({ group, isCreatingSubGroup, setIsCreatingSubGroup }) => {
  const [subGroup, setSubGroup] = useState({});
  const [subGroups, setSubGroups] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  // const [isCreatingSubGroup, setIsCreatingSubGroup] = useState(false);
  const [showConfirmDeleteManyGroupsModal, setShowConfirmDeleteManyGroupsModal] = useState(false);
  const [toggledClearGroupRows, setToggledClearGroupRows] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [alert, setAlert] = useState();

  const getSubGroupsByParentGroupId = (id) => {
    GroupService.getSubGroupsByParentGroupId(id)
      .then(response => setSubGroups(response));
  }

  const onSelectDelete = (group) => {
    setSelectedGroups([group]);
    setShowConfirmDeleteManyGroupsModal(true);
  }

  const onConfirmDeleteGroups = () => {
    const ids = selectedGroups.map(group => group._id);

    GroupService.deleteManyGroups({ ids: ids })
      .then(() => {
        setSelectedGroups([]);
        Toast('Delete successfully', 'success');
        getSubGroupsByParentGroupId(group._id);
      })
      .catch(() => {
        Toast('Failed to delete groups!', 'danger');
      })
      .finally(() => {
        setShowConfirmDeleteManyGroupsModal(false)
        setToggledClearGroupRows(!toggledClearGroupRows)
      })
  }

  const onSelectedRowsChange = (selected) => {
    setSelectedGroups(selected.selectedRows);
  }

  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!subGroup?.groupName) {
      errors = { ...errors, groupName: 'Please enter group name!' }
      isValid = false
    }

    if (!subGroup?.groupEmail) {
      errors = { ...errors, groupEmail: 'Please provide email address!' }
      isValid = false
    }

    if (subGroup?.groupEmail && !utils.string.isValidEmail(subGroup?.groupEmail)) {
      errors = { ...errors, groupEmail: 'Please provide a valid email address!' }
      isValid = false
    }

    if (!subGroup?.groupArea) {
      errors = { ...errors, groupArea: 'Please enter group area!' }
      isValid = false
    }

    if (!subGroup?.groupLicence) {
      errors = { ...errors, groupLicence: 'Please enter license!' }
      isValid = false
    }

    setErrors(errors);
    return isValid;
  }

  const onSubmit = () => {
    setIsLoading(true);

    if (!isValid()) {
      setIsLoading(false);
      return
    }

    const body = {
      groupName: subGroup?.groupName,
      groupContact: subGroup?.groupContact,
      groupEmail: subGroup?.groupEmail,
      groupArea: subGroup?.groupArea,
      groupType: group?.groupType,
      groupLicence: subGroup?.groupLicence,
      groupParentId: group?._id,
    }

    GroupService.createGroup(body)
      .then(response => {
        Toast('Group has been created successfully!', 'success');
        setErrors();
        setAlert();
        getSubGroupsByParentGroupId(group._id);
        setIsCreatingSubGroup(false);
        setSubGroup();
      })
      .catch((response) => {
        console.log(response);
        Toast('Failed to create group!', 'danger');
        setAlert(response?.response?.data?.error);
      })
      .finally(() =>
        setIsLoading(false)
      )
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
        {isCreatingSubGroup && <>
          <GroupInformationForm group={subGroup} setGroup={setSubGroup} isSubGroup errors={errors} alert={alert} />
          <Row>
            <Col sm={12}>
              <div className="d-flex justify-content-end">
                <Button className="btn btn-flat-dark waves-effect waves-light mr-1"
                  onClick={() => setIsCreatingSubGroup(false)}
                >
                  Cancel
                </Button>
                <Button className="btn btn-primary waves-effect waves-light"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  Add Group
                </Button>
              </div>
            </Col>
          </Row>
          <hr />
        </>}

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
              selector: group => group.groupContact || '--',
              sortable: true,
            },
            {
              name: 'Area',
              selector: group => group.groupArea || '--',
              sortable: true,
            },
            {
              name: "Actions",
              button: true,
              cell: group => (<>
                <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/groups/${group._id}`}>
                  <i className="feather icon-edit"></i>
                </Link>
                <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onSelectDelete(group)}>
                  <i className="feather icon-trash-2"></i>
                </Button>
              </>)
            }
          ]}
          data={subGroups}
          selectableRows
          onSelectedRowsChange={onSelectedRowsChange}
          pagination
          clearSelectedRows={toggledClearGroupRows}
        />

        <ConfirmModal show={showConfirmDeleteManyGroupsModal}
          setShow={setShowConfirmDeleteManyGroupsModal}
          onSubmit={onConfirmDeleteGroups}
        />
      </>
    }
  </>
}

export default SubGroups;
