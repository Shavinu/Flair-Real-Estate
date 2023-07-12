import { useEffect, useMemo, useState } from "react";
import { Container, Button, Card, ConfirmModal, ContentHeader, Dropdown } from "../../../Components";
import CardBody from "../../../Components/Card/CardBody";
import DataTable from 'react-data-table-component';
import * as UserService from '../../../Services/UserService';
import { Link } from "react-router-dom";
import Toast from "../../../Components/Toast";
import utils from "../../../Utils";
import "../Layout.css";

const List = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const getUserList = () => {
    UserService.getUserList()
      .then((response) => {
        setUsers(response);
      })
  }

  const columns = useMemo(() => [
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
      name: 'Phone Number',
      selector: row => row.phoneNo || '--',
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => utils.string.capitalize(row.accType) || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? utils.dateFormat(row.updatedAt) : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Link className="btn btn-icon btn-sm btn-flat-primary my-1" to={`/users/${row._id}`}>
          <i className="feather icon-edit"></i>
        </Link>
        <Button className="btn btn-icon btn-sm btn-flat-danger my-1" onClick={() => onSelectDelete(row)}>
          <i className="feather icon-trash"></i>
        </Button>
      </>)
    }
  ], []);

  const onSelectedRowsChange = (selected) => {
    setSelectedUsers(selected.selectedRows);
  }

  const onSelectDelete = (user) => {
    setSelectedUsers([user]);
    if (selectedUsers.length > 1){
      setModalTitle = "Delete Users";
    } else if (selectedUsers.length == 1){
      setModalTitle = "Delete User";
    }
    setShowConfirmDeleteModal(true);
  }

  const onConfirmDeleteUsers = () => {
    const ids = selectedUsers.map(user => user._id);

    UserService.deleteManyUser({ ids: ids })
      .then(() => {
        setSelectedUsers([]);
        Toast('Delete successfully', 'success');
        getUserList();
      })
      .catch(() => {
        Toast('Failed to delete users!', 'danger');
      })
      .finally(() => setShowConfirmDeleteModal(false))
    setShowConfirmDeleteModal(false);
  }

  useEffect(() => {
    getUserList()
  }, []);

  return <>
  <Container className="content-container">
    <ContentHeader headerTitle="User List"
      options={<Link className="btn btn-primary waves-effect waves-light" to="/users/create">Add User</Link>}
    />
    <Card>
      <CardBody>
        {selectedUsers.length > 0 && <Dropdown
          className="btn btn-outline-success"
          label={`${selectedUsers.length} items selected`}
          items={[
            { name: "Delete selected items", onClick: () => setShowConfirmDeleteModal(true) },
          ]} />}

        <DataTable
          columns={columns}
          data={users}
          selectableRows
          onSelectedRowsChange={onSelectedRowsChange}
          pagination />
      </CardBody>
    </Card>

    <ConfirmModal show={showConfirmDeleteModal}
      setShow={setShowConfirmDeleteModal}
      onSubmit={onConfirmDeleteUsers}
      title={modalTitle}
    />
    </Container>
  </>
}

export default List
