import { useEffect, useState } from "react";
import * as GroupService from '../../../../Services/GroupService';
import Toast from "../../../../Components/Toast";
import { Button, Col, ConfirmModal, Dropdown, Row } from "../../../../Components";
import { Group } from "../../../../Components/Form";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

const GroupMembers = ({ group }) => {
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedOneUserToRemoveFromGroup, setSelectedOneUserToRemoveFromGroup] = useState([]);
  const [selectedUsersToRemoveFromGroup, setSelectedUsersToRemoveFromGroup] = useState([]);
  const [toggledClearRows, setToggledClearRows] = useState(false);
  const [isAddingUserToGroup, setIsAddingUserToGroup] = useState(false);
  const [showConfirmRemoveOneUserFromGroupModal, setShowConfirmRemoveOneUserFromGroupModal] = useState(false);
  const [showConfirmRemoveManyUserFromGroupModal, setShowConfirmRemoveManyUserFromGroupModal] = useState(false);
  const [errors, setErrors] = useState();

  const getUsersByGroupId = (id) => {
    GroupService.getUsersByGroupId(id)
      .then(response => {
        setUsers(response);
      })
  }

  const getAvailableUsers = () => {
    GroupService.getAvailableUsers()
      .then(response => {
        setAvailableUsers(response);
      })
  }

  const onAddUserToGroup = () => {
    setIsAddingUserToGroup(true);
    if (!selectedUser) {
      setIsAddingUserToGroup(false);
      setErrors({ user: 'Please select user!' });
      return;
    }

    const body = {
      userId: selectedUser._id,
      groupId: group._id
    }

    GroupService.addUserToGroup(body)
      .then(response => {
        Toast('User has been added to group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(group._id);
      })
      .catch(response => {
        Toast('Failed to add user to group!', 'warning');
      })
      .finally(() => {
        setIsAddingUserToGroup(false);
      })
  }

  const onSelectedRowsChange = (selected) => {
    setSelectedUsersToRemoveFromGroup(selected.selectedRows);
  }

  const onRemoveOneUserFromGroup = () => {
    setIsAddingUserToGroup(true);

    const body = {
      userId: selectedOneUserToRemoveFromGroup._id,
      groupId: group._id
    }

    GroupService.removeUserFromGroup(body)
      .then(response => {
        Toast('User has been removed from group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(group._id);
      })
      .catch(response => {
        Toast('Failed to remove user from group!', 'warning');
      })
      .finally(() => {
        setIsAddingUserToGroup(false);
        setToggledClearRows(!toggledClearRows);
      })
  }

  const onRemoveManyUsersFromGroup = () => {
    setIsAddingUserToGroup(true);

    const body = {
      ids: selectedUsersToRemoveFromGroup.map(user => user._id),
    }

    GroupService.removeManyUsersFromGroup(body)
      .then(response => {
        Toast('Users have been removed from group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(group._id);
        setSelectedUsersToRemoveFromGroup([]);
      })
      .catch(response => {
        Toast('Failed to remove users from group!', 'warning');
      })
      .finally(() => {
        setIsAddingUserToGroup(false);
        setToggledClearRows(!toggledClearRows);
      })
  }

  useEffect(() => {
    if (group) {
      getUsersByGroupId(group._id);
      getAvailableUsers();
    }
  }, [group]);

  return <>
    {!group
      ?
      <p>No Group Found!</p>
      : <>
        <Row>
          <Col sm={12} md={8}>
            <Group>
              <Row>
                <Col sm={9}>
                  <select className={`form-control ${errors?.user ? 'is-invalid' : ''}`} name="group-member" id="group-members" onChange={e => setSelectedUser(availableUsers.find(user => user._id === e.target.value))} value={selectedUser?._id}>
                    <option value={null} selected>Select User</option>
                    {availableUsers.map(user => (<option value={user._id}>{user.email}</option>))}
                  </select>
                  {errors?.user && <div className="invalid-feedback">
                    {errors?.user}
                  </div>}
                </Col>
                <Col sm={3}>
                  <Button className="btn btn-primary waves-effect waves-light"
                    onClick={onAddUserToGroup}
                    isLoading={isAddingUserToGroup}
                  >
                    Add
                  </Button>
                </Col>
              </Row>
            </Group>
          </Col>
        </Row>
        {selectedUsersToRemoveFromGroup.length > 0 && <Dropdown
          className="btn btn-outline-success"
          label={`${selectedUsersToRemoveFromGroup.length} items selected`}
          items={[
            {
              name: "Remove selected users from group",
              onClick: () => setShowConfirmRemoveManyUserFromGroupModal(true)
            },
          ]} />}

        <DataTable
          columns={[
            {
              name: 'First Name',
              selector: row => row.firstName || '--',
              sortable: true,
            },
            {
              name: 'Last Name',
              selector: row => row.lastName || '--',
              sortable: true,
            },
            {
              name: 'Email',
              selector: row => row.email || '--',
              sortable: true,
            },
            {
              name: 'Phone',
              selector: row => row.phoneNo || '--',
              sortable: true,
            },
            {
              name: "Actions",
              button: true,
              cell: row => (<>
                <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/users/${row._id}`}>
                  <i className="feather icon-edit"></i>
                </Link>
                <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => {
                  setShowConfirmRemoveOneUserFromGroupModal(true);
                  setSelectedOneUserToRemoveFromGroup(row);
                }}>
                  <i className="feather icon-user-x"></i>
                </Button>
              </>)
            }
          ]}
          data={users}
          selectableRows
          onSelectedRowsChange={onSelectedRowsChange}
          pagination
          clearSelectedRows={toggledClearRows}
        />

        <ConfirmModal show={showConfirmRemoveOneUserFromGroupModal}
          setShow={setShowConfirmRemoveOneUserFromGroupModal}
          onSubmit={onRemoveOneUserFromGroup}
        />

        <ConfirmModal show={showConfirmRemoveManyUserFromGroupModal}
          setShow={setShowConfirmRemoveManyUserFromGroupModal}
          onSubmit={onRemoveManyUsersFromGroup}
        />
      </>
    }
  </>
}

export default GroupMembers;
