import { useParams } from "react-router-dom";
import { Button, Card, CardBody, Col, ContentHeader, Row } from "../../../Components";
import { useEffect, useState } from "react";
import utils from "../../../Utils";
import * as GroupService from '../../../Services/GroupService';
import Toast from "../../../Components/Toast";
import GroupInformationForm from "./Components/GroupInformationForm";
import GroupMembers from "./Components/GroupMembers";

const Edit = () => {
  const [groupDetail, setGroupDetail] = useState();

  const [alert, setAlert] = useState();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const getGroupDetailById = (id) => {
    GroupService.getGroupDetailById(id)
      .then(response => {
        setGroupDetail(response);
      })
  }

  const isValid = () => {
    let isValid = true;
    let errors = {};

    if (!groupDetail?.groupName) {
      errors = { ...errors, groupName: 'Please enter group name!' }
      isValid = false
    }

    if (!groupDetail?.groupEmail) {
      errors = { ...errors, groupEmail: 'Please provide email address!' }
      isValid = false
    }

    if (groupDetail?.groupEmail && !utils.string.isValidEmail(groupDetail?.groupEmail)) {
      errors = { ...errors, groupEmail: 'Please provide a valid email address!' }
      isValid = false
    }

    if (!groupDetail?.groupArea) {
      errors = { ...errors, groupArea: 'Please enter group area!' }
      isValid = false
    }

    if (!groupDetail?.groupType) {
      errors = { ...errors, groupType: 'Please select group type!' }
      isValid = false
    }

    if (!groupDetail?.groupLicence) {
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
      _id: id,
      groupName: groupDetail?.groupName,
      groupContact: groupDetail?.groupContact,
      groupEmail: groupDetail?.groupEmail,
      groupArea: groupDetail?.groupArea,
      groupType: groupDetail?.groupType,
      groupLicence: groupDetail?.groupLicence,
      groupParentId: groupDetail?.groupParentId,
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

  useEffect(() => {
    if (id) {
      getGroupDetailById(id);
    }
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

        <p>Note: If you have selected a parent group, the subgroups component will not be displayed..</p>
      </Col>
      <Col sm={12} md={9}>
        <Card>
          <CardBody>
            <GroupInformationForm group={groupDetail} setGroup={setGroupDetail} alert={alert} errors={errors} />
          </CardBody>
        </Card>
      </Col>
    </Row>

    {/* {!groupDetail?.groupParentId &&
      <Row>
        <Col sm={12} md={3}>
          <h4>Manage Subgroups</h4>
          <p>Use the options below to manage the subgroups of this group. You can add or remove child groups, and adjust their settings as needed.</p>
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
      </Row>} */}

    <Row>
      <Col sm={12} md={3}>
        <h4>Manage Group Members</h4>
        <p>Use the options below to manage group members. You can add or remove users from the group, and adjust their permissions as needed.</p>
      </Col>

      <Col sm={12} md={9}>
        <Card>
          <CardBody>
            <GroupMembers group={groupDetail} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>
}

export default Edit;
