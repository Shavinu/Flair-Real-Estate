import { useEffect, useMemo, useState } from "react";
import { Container, Button, Card, ConfirmModal, ContentHeader, Dropdown, Modal } from "../../../Components";
import CardBody from "../../../Components/Card/CardBody";
import DataTable from 'react-data-table-component';
import * as GroupService from '../../../Services/GroupService';
import { Link } from "react-router-dom";
import Toast from "../../../Components/Toast";
import utils from "../../../Utils";
import GroupMembers from "./Components/GroupMembers";
import ExpandedComponent from "./Components/ExpandedComponent";
import "../Layout.css";

const List = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [toggledClearGroupRows, setToggledClearGroupRows] = useState(false);

  const getGroupList = () => {
    GroupService.getGroupList()
      .then((response) => {
        setGroups(response);
      })
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
      cell: row => (<button className="btn btn-icon btn-sm btn-flat-secondary my-1" data-backdrop="false" data-target="#group-members-modal" data-toggle="modal" onClick={() => setSelectedGroup(row)}>
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

  const onSelectDelete = (group) => {
    setSelectedGroups([group]);
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
  }

  useEffect(() => {
    getGroupList()
  }, []);

  return <>
    <Container className="content-container">
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
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          expandableRowsComponentProps={{
            "setSelectedGroup": setSelectedGroup,
            "onSelectDelete": onSelectDelete
          }}
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
      <GroupMembers group={selectedGroup} />
    </Modal >
    </Container>
  </>
}

export default List
