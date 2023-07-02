import { Add, DeleteForeverRounded } from '@mui/icons-material';
import { Button, Card, Container, IconButton, Table, TableBody, TableContainer, Tooltip } from '@mui/material';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfirmDialog, CustomBreadcrumbs, RouterLink } from '../../components';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from '../../components/table';
import { useBoolean } from '../../hooks/use-boolean';
import { paths } from '../../paths';
import UserService from '../../services/user-service';
import UserDataTableFilters from './user-data-table-filters';
import UserDataTableRow from './user-data-table-row';
import UserTableToolbar from './user-data-table-toolbar';

const defaultFilters = {
  name: '',
  role: [],
};

const UserDataTable = () => {
  const table = useTable();
  const confirm = useBoolean();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const getUserList = useCallback(
    async () => {
      try {
        setUsers(await UserService.getUserList());
      } catch (error) {
        console.log(error);
      }
    },
    [],
  )

  const applyFilter = ({ inputData = [], comparator, filters }) => {
    const { name, role } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
      inputData = inputData?.filter(
        (user) => user.firstName.toLowerCase().indexOf(name.toLowerCase()) !== -1
      );
    }

    if (role.length) {
      inputData = inputData.filter((user) => role.includes(user.accType));
    }

    return inputData;
  }

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      UserService.deleteUser(id)
        .then(() => {
          getUserList();
        });
    },
    [getUserList]
  );

  const handleDeleteRows = useCallback(() => {
    console.log(table.selected);
  }, [table]);

  const columns = useMemo(() => [
    { id: 'name', label: 'Name' },
    { id: 'phoneNo', label: 'Phone Number', width: 180 },
    { id: 'company', label: 'Company', width: 220 },
    { id: 'role', label: 'Role', width: 180 },
    {id: 'modified', label: 'Modified'},
    { id: '', width: 88 },
  ], []);

  useEffect(() => {
    return () => {
      getUserList();
    }
  }, [getUserList]);

  return <>
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.users.list },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.users.create}
            variant="contained"
            startIcon={<Add />}
          >
            New User
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <UserTableToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          roleOptions={[
            'admin',
            'agency',
            'agent',
            'assistant agent',
            'moderator',
            'developer',
            'builder'
          ]}
        />

        {canReset && (
          <UserDataTableFilters
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            numSelected={table.selected.length}
            rowCount={users.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                users.map((row) => row._id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <DeleteForeverRounded />
                </IconButton>
              </Tooltip>
            }
          />

          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={columns}
              rowCount={users.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  users.map((row) => row._id)
                )
              }
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <UserDataTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                    getUserList={getUserList}
                  />
                ))}

              <TableEmptyRows
                height={72}
                emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
              />
              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </Container>

    <ConfirmDialog
      open={confirm.value}
      onClose={confirm.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirm.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  </>
}

export default UserDataTable;
