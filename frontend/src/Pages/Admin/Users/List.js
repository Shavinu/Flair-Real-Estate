import { useEffect, useMemo, useState } from "react";
import { Button, Card, ConfirmModal, ContentHeader, Dropdown } from "../../../Components";
import CardBody from "../../../Components/Card/CardBody";
import DataTable from 'react-data-table-component';
import * as UserService from '../../../Services/UserService';
import moment from "moment";
import { Link } from "react-router-dom";

const List = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

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
      selector: row => row.accType || '--',
      sortable: true,
    },
    {
      name: 'Last Modified At',
      selector: row => row.updatedAt,
      cell: row => row.updatedAt ? moment(row.updatedAt).format('YYYY-MM-DD hh:mm:ss A').toLocaleString() : '--',
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: row => (<>
        <Button className="btn btn-icon btn-sm btn-flat-primary my-1">
          <i className="feather icon-edit"></i>
        </Button>
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
    setShowConfirmDeleteModal(true);
  }

  const onConfirmDeleteUsers = () => {
    let updatedUsers = [...users];

    selectedUsers.forEach(user => {
      UserService.deleteUser(user._id)
        .then(() => {
        })
        .catch(() => { })

      const u = updatedUsers.find(u => user._id === u._id)
      const index = updatedUsers.indexOf(u)
      if (index > -1) {
        updatedUsers.splice(index, 1)
      }
    })

    setUsers(updatedUsers);
    setShowConfirmDeleteModal(false);
  }

  useEffect(() => {
    getUserList()
  }, []);

  return <>
    <ContentHeader headerTitle="User List"
      breadcrumb={[
        { name: "Home", link: "/" },
        { name: "Users", active: true },
      ]}
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
    />
  </>
}

export default List
