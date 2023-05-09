import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, ConfirmModal, ContentHeader, Dropdown, Modal, Row } from "../../../Components";
import CardBody from "../../../Components/Card/CardBody";
import DataTable from 'react-data-table-component';
import * as GroupService from '../../../Services/GroupService';
import { Link } from "react-router-dom";
import Toast from "../../../Components/Toast";
import utils from "../../../Utils";
import { Group, Select } from "../../../Components/Form";

const List = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedGroup, setSelectedGroup] = useState();

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showConfirmRemoveUsersFromGroupModal, setShowConfirmRemoveUsersFromGroupModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [isAddingUserToGroup, setIsAddingUserToGroup] = useState(false);
  const [isRemoveOne, setIsRemoveOne] = useState(false);
  const [toggledClearGroupRows, setToggledClearGroupRows] = useState(false);
  const [toggledClearUserRows, setToggledClearUserRows] = useState(false);
  const [errors, setErrors] = useState();

  const getGroupList = () => {
    GroupService.getGroupList()
      .then((response) => {
        setGroups(response);
      })
  }

  const getAvailableUsers = () => {
    GroupService.getAvailableUsers()
      .then(response => {
        setAvailableUsers(response);
      })
  }

  const getUsersByGroupId = (id) => {
    GroupService.getUsersByGroupId(id)
      .then(response => {
        setUsers(response);
      })
    getAvailableUsers();
  }

  const columns = useMemo(() => [
    {
      name: 'Name',
      selector: row => row.groupName || '--',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.groupEmail || '--',
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
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: 'Users',
      // cell: row => (<Button className="btn btn-icon btn-sm btn-flat-secondary my-1" onClick={() => onShowUsersModel(row)}>
      //   <i className="feather icon-eye"></i>
      // </Button>),
      cell: row => (<button className="btn btn-icon btn-sm btn-flat-secondary my-1" data-backdrop="false" data-target="#group-members-modal" data-toggle="modal" onClick={() => onShowUsersModel(row)}>
        <i className="feather icon-eye"></i>
      </button>),
      button: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/groups/${row._id}`}>
          <i className="feather icon-edit"></i>
        </Link>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onSelectDelete(row)}>
          <i className="feather icon-trash"></i>
        </Button>
      </>)
    }
  ], []);

  const onSelectedRowsChange = (selected) => {
    setSelectedGroups(selected.selectedRows);
  }

  const onSelectedUserRowsChange = (selected) => {
    setSelectedUsers(selected.selectedRows);
  }

  const onSelectDelete = (user) => {
    setSelectedGroups([user]);
    setShowConfirmDeleteModal(true);
  }

  const onConfirmDeleteGroups = () => {
    const ids = selectedGroups.map(group => group._id);

    GroupService.deleteManyGroups({ ids: ids })
      .then(() => {
        setSelectedGroups([]);
        Toast('Delete successfully', 'success');
        getGroupList();
      })
      .catch(() => {
        Toast('Failed to delete groups!', 'danger');
      })
      .finally(() => {
        setShowConfirmDeleteModal(false)
        setToggledClearGroupRows(!toggledClearGroupRows)
      })
    setShowConfirmDeleteModal(false);
  }

  const onShowUsersModel = (group) => {
    setSelectedGroup(group);
    setSelectedUsers([]);
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
      groupId: selectedGroup._id
    }

    GroupService.addUserToGroup(body)
      .then(response => {
        Toast('User has been added to group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(selectedGroup._id);
      })
      .catch(response => {
        Toast('Failed to add user to group!', 'warning');
      })
      .finally(() => {
        setIsAddingUserToGroup(false);
      })
  }

  const onOpenRemoveUsersFromGroupModal = (users, isRemoveOne = false) => {
    setSelectedUsers(users);

    setShowConfirmRemoveUsersFromGroupModal(true);
  }

  // const onRemoveUserFromGroup = () => {
  //   setIsAddingUserToGroup(true);

  //   const body = {
  //     userId: selectedUserToRemoveFromGroup._id,
  //     groupId: selectedGroup._id
  //   }

  //   GroupService.removeUserFromGroup(body)
  //     .then(response => {
  //       Toast('User has been removed from group successfully', 'success');
  //       setErrors();
  //       getAvailableUsers();
  //       getUsersByGroupId(selectedGroup._id);
  //       setSelectedUsers([]);
  //     })
  //     .catch(response => {
  //       Toast('Failed to remove user from group!', 'warning');
  //     })
  //     .finally(() => {
  //       setIsAddingUserToGroup(false);
  //       setToggledClearUserRows(!toggledClearUserRows);
  //     })
  // }

  const onRemoveManyUsersFromGroup = () => {
    setIsAddingUserToGroup(true);

    const body = {
      ids: selectedUsers.map(user => user._id),
    }

    GroupService.removeManyUsersFromGroup(body)
      .then(response => {
        Toast('Users have been removed from group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(selectedGroup._id);
        setSelectedUsers([]);
      })
      .catch(response => {
        Toast('Failed to remove users from group!', 'warning');
      })
      .finally(() => {
        setIsAddingUserToGroup(false);
        setToggledClearUserRows(!toggledClearUserRows);
      })
  }

  useEffect(() => {
    getGroupList()
  }, []);

  useEffect(() => {
    selectedGroup && getUsersByGroupId(selectedGroup._id);
  }, [selectedGroup])

  return <>
    <ContentHeader headerTitle="Group List"
      breadcrumb={[
        { name: "Home", link: "/" },
        { name: "Users", active: true },
      ]}
      options={<Link className="btn btn-primary waves-effect waves-light" to="/groups/create">Add User Group</Link>}
    />
    <Card>
      <CardBody>
        {selectedGroups.length > 0 && <Dropdown
          className="btn btn-outline-success"
          label={`${selectedGroups.length} items selected`}
          items={[
            { name: "Delete selected items", onClick: () => setShowConfirmDeleteModal(true) },
          ]} />}

        <DataTable
          columns={columns}
          data={groups}
          selectableRows
          onSelectedRowsChange={onSelectedRowsChange}
          pagination
          clearSelectedRows={toggledClearGroupRows}
        />
      </CardBody>
    </Card>

    <ConfirmModal show={showConfirmDeleteModal}
      setShow={setShowConfirmDeleteModal}
      onSubmit={onConfirmDeleteGroups}
    />

    <Modal
      id="group-members-modal"
      show={showUsersModal}
      setShow={setShowUsersModal}
      title="Group Members"
      size="lg"
      isStatic
    >
      <Row>
        <Col sm={12} md={8}>
          <Group>
            <Row>
              <Col sm={8}>
                {/* <Select
                      options={availableUsers.map(user => ({ value: user._id, label: user.email }))}
                      value={selectedUser?._id}
                      onChange={value => setSelectedUser(availableUsers.find(user => user._id === value))}
                      error={errors?.user}
                    /> */}
                <select className={`form-control ${errors?.user ? 'is-invalid' : ''}`} name="group-member" id="group-members" onChange={e => setSelectedUser(availableUsers.find(user => user._id === e.target.value))} value={selectedUser?._id}>
                  <option value={null} selected>Select User</option>
                  {availableUsers.map(user => (<option value={user._id}>{user.email}</option>))}
                </select>
                {errors?.user && <div className="invalid-feedback">
                  {errors?.user}
                </div>}
              </Col>
              <Col sm={4}>
                <Button className="btn btn-primary waves-effect waves-light"
                  onClick={() => onAddUserToGroup()}
                  isLoading={isAddingUserToGroup}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Group>
        </Col>
      </Row>
      {selectedUsers.length > 0 && <Dropdown
        className="btn btn-outline-success"
        label={`${selectedUsers.length} items selected`}
        items={[
          { name: "Remove selected users from group", onClick: () => setShowConfirmRemoveUsersFromGroupModal(true) },
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
              {/* <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/users/${row._id}`}>
                    <i className="feather icon-edit"></i>
                  </Link> */}
              <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onOpenRemoveUsersFromGroupModal([row])}>
                <i className="feather icon-user-x"></i>
              </Button>
            </>)
          }
        ]}
        data={users}
        selectableRows
        onSelectedRowsChange={onSelectedUserRowsChange}
        pagination
        clearSelectedRows={toggledClearUserRows}
      />
    </Modal >

    <ConfirmModal show={showConfirmRemoveUsersFromGroupModal}
      setShow={setShowConfirmRemoveUsersFromGroupModal}
      onSubmit={onRemoveManyUsersFromGroup}
    />
  </>
}

export default List
