import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Card, CardBody, Col, ContentHeader, Dropdown, Row } from "../../../Components";
import { useEffect, useState } from "react";
import { Group, Input, Label, Select } from "../../../Components/Form";
import utils from "../../../Utils";
import * as GroupService from '../../../Services/GroupService';
import Toast from "../../../Components/Toast";
import GroupInformationForm from "./Components/GroupInformationForm";
import GroupMembers from "./Components/GroupMembers";
import SubGroups from "./Components/SubGroups";

const Edit = () => {
  const [groupDetail, setGroupDetail] = useState();
  const [subGroup, setSubGroup] = useState();

  const [alert, setAlert] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSubGroup, setIsCreatingSubGroup] = useState(false);
  const { id } = useParams();

  const getGroupDetailById = (id) => {
    GroupService.getGroupDetailById(id)
      .then(response => {
        setName(response.groupName);
        setEmail(response.groupEmail);
        setContact(response.groupContact);
        setArea(response.groupArea);
        setType(response.groupType);
        setLicense(response.groupLicence);
      })
  }

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

  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!name) {
      errors = { ...errors, name: 'Please enter group name!' }
      isValid = false
    }

    if (!email) {
      errors = { ...errors, email: 'Please provide email address!' }
      isValid = false
    }

    if (email && !utils.string.isValidEmail(email)) {
      errors = { ...errors, email: 'Please provide a valid email address!' }
      isValid = false
    }

    if (!area) {
      errors = { ...errors, area: 'Please enter group area!' }
      isValid = false
    }

    if (!type) {
      errors = { ...errors, type: 'Please select group type!' }
      isValid = false
    }

    if (!license) {
      errors = { ...errors, license: 'Please enter license!' }
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
      _id: id,
      groupName: name,
      groupContact: contact,
      groupEmail: email,
      groupArea: area,
      groupType: type,
      groupLicence: license,
    }

    GroupService.updateGroup(body)
      .then(response => {
        Toast('Group has been updated successfully!', 'success');
        setErrors();
        setAlert();
        getGroupDetailById(response._id);
      })
      .catch((response) => {
        console.log(response);
        Toast('Failed to update group!', 'danger');
        setAlert(response?.response?.data?.error);
      })
      .finally(() =>
        setIsLoading(false)
      )
  }

  const onSelectedRowsChange = (selected) => {
    setSelectedUsers(selected.selectedRows);
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
      groupId: id
    }

    GroupService.addUserToGroup(body)
      .then(response => {
        Toast('User has been added to group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(id);
      })
      .catch(response => {
        Toast('Failed to add user to group!', 'warning');
      })
      .finally(() => {
        setIsAddingUserToGroup(false);
      })
  }

  const onRemoveUserFromGroup = (userId) => {
    setIsAddingUserToGroup(true);

    const body = {
      userId: userId,
      groupId: id
    }

    GroupService.removeUserFromGroup(body)
      .then(response => {
        Toast('User has been removed from group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(id);
        setSelectedUsers([]);
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
      ids: selectedUsers.map(user => user._id),
    }

    GroupService.removeManyUsersFromGroup(body)
      .then(response => {
        Toast('Users have been removed from group successfully', 'success');
        setErrors();
        getAvailableUsers();
        getUsersByGroupId(id);
        setSelectedUsers([]);
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
    if (id) {
      getGroupDetailById(id);
      getUsersByGroupId(id);
    }
    getAvailableUsers();
  }, [id])

  return <>
    <ContentHeader headerTitle="Edit Group"
      breadcrumb={[
        { name: "Home", link: '/' },
        { name: "Groups", link: '/groups' },
        { name: 'Edit', active: true }
      ]}
      options={<Button className="btn btn-primary waves-effect waves-light"
        onClick={onSubmit}
        isLoading={isLoading}
      >
        Save
      </Button>}
    />
    <Row>
      <Col sm={12} md={3}>
        <h4>Group Information</h4>
        <p>Please fill out the following information to create a new group. Fields marked with an asterisk (*) are required.</p>
      </Col>
      <Col sm={12} md={9}>
        <Card>
          <CardBody>
            {alert &&
              <Alert type="danger" message={alert} icon={<i className="feather icon-info mr-1 align-middle"></i>} />
            }
            <Row>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Name (*)</Label>
                  <Input name="name"
                    value={name}
                    placeholder="Group Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    error={errors?.name}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Email (*)</Label>
                  <Input name="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    error={errors?.email}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Contact</Label>
                  <Input name="contact"
                    value={contact}
                    placeholder="Contact"
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                    error={errors?.contact}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Area (*)</Label>
                  <Input name="area"
                    value={area}
                    placeholder="Area"
                    onChange={(e) => {
                      setArea(e.target.value);
                    }}
                    error={errors?.area}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>License (*)</Label>
                  <Input name="license"
                    value={license}
                    placeholder="License"
                    onChange={(e) => {
                      setLicense(e.target.value);
                    }}
                    error={errors?.license}
                  />
                </Group>
              </Col>
              <Col sm={12} md={6}>
                <Group>
                  <Label>Type (*)</Label>
                  <Select
                    options={[
                      { value: 'builder', label: 'Builder' },
                      { value: 'agency', label: 'Agency' },
                    ]}
                    value={type}
                    onChange={(value) => setType(value)}
                    error={errors?.type}
                  />
                </Group>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>

    {!groupDetail?.groupParentId &&
      <Row>
        <Col sm={12} md={3}>
          <h4>Manage Subgroups</h4>
          <p>Use the options below to manage the subgroups of this group. You can add or remove child groups, and adjust their settings as needed.</p>
        </Col>

        <Col sm={12} md={9}>
          <Card>
            <CardBody>
              <SubGroups group={groupDetail} />
            </CardBody>
          </Card>
        </Col>
      </Row>}

    <Row>
      <Col sm={12} md={3}>
        <h4>Manage Group Members</h4>
        <p>Use the options below to manage group members. You can add or remove users from the group, and adjust their permissions as needed.</p>
      </Col>

      <Col sm={12} md={9}>
        <Card>
          <CardBody>
            <Row>
              <Col sm={12} md={6}>
                <Group>
                  <Row>
                    <Col sm={9}>
                      <Select
                        options={availableUsers.map(user => ({ value: user._id, label: user.email }))}
                        value={selectedUser?._id}
                        onChange={value => setSelectedUser(availableUsers.find(user => user._id === value))}
                        error={errors?.user}
                      />
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
            {selectedUsers.length > 0 && <Dropdown
              className="btn btn-outline-success"
              label={`${selectedUsers.length} items selected`}
              items={[
                { name: "Remove selected users from group", onClick: onRemoveManyUsersFromGroup },
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
                    <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onRemoveUserFromGroup(row._id)}>
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
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
}

export default Edit;
