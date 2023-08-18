import { DeleteForeverRounded } from '@mui/icons-material';
import { Button, IconButton, Table, TableBody, TableContainer, Tooltip } from '@mui/material';
import { isEqual } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useMemo, useState } from 'react';
import { ConfirmDialog } from 'src/components';
import { TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, emptyRows, getComparator, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import GroupService from 'src/services/group-service';
import GroupDataTableFilters from './group-data-table-filters';
import GroupDataTableRow from './group-data-table-row';
import GroupDataTableToolbar from './group-data-table-toolbar';

const defaultFilters = {
  search: '',
};

const GroupDataTable = ({ groups = [], groupIds = [], rowCount = 0, getGroupList }) => {
  const table = useTable();
  const confirm = useBoolean();
  const [filters, setFilters] = useState(defaultFilters);

  const applyFilter = ({ inputData = [], comparator, filters }) => {
    const { search } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (search) {
      inputData = inputData?.filter(
        (group) => {
          console.log(group.groupName);
          return group.groupName?.toLowerCase().indexOf(search?.toLowerCase()) !== -1
            || group.groupEmail?.toLowerCase().indexOf(search?.toLowerCase()) !== -1
            || group.groupArea?.toLowerCase().indexOf(search?.toLowerCase()) !== -1
        }
      );
    }

    return inputData;
  }

  const dataFiltered = applyFilter({
    inputData: groups,
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
      GroupService.deleteManyGroups({ ids: [id] })
        .then(() => {
          getGroupList?.();
          enqueueSnackbar('Delete Sucessfully!', { variant: 'success' });
          table.onSelectAllRows(false);
        });
    },
    [table, getGroupList]
  );

  const handleDeleteRows = useCallback(() => {
    GroupService.deleteManyGroups({ ids: table.selected })
      .then(() => {
        getGroupList();
        enqueueSnackbar('Delete Sucessfully!', { variant: 'success' });
        table.onSelectAllRows(false);
      });
  }, [table, getGroupList]);

  const columns = useMemo(() => [
    { id: 'expand', width: 20 },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email', width: 180 },
    { id: 'contact', label: 'Contact', width: 180 },
    { id: 'area', label: 'Area', width: 180 },
    { id: 'modified', label: 'Modified' },
    { id: 'users', label: 'Users', width: 180 },
    { id: '', width: 88 },
  ], []);

  return (
    <>
      <GroupDataTableToolbar
        filters={filters}
        onFilters={handleFilters}
      />

      {canReset && (
        <GroupDataTableFilters
          filters={filters}
          onFilters={handleFilters}
          //
          onResetFilters={handleResetFilters}
          //
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'auto' }}>
        <TableSelectedAction
          numSelected={table.selected.length}
          rowCount={rowCount}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              groupIds
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
            rowCount={rowCount}
            numSelected={table.selected.length}
            onSort={table.onSort}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                groupIds
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
                <GroupDataTableRow
                  key={row._id}
                  row={row}
                  selected={table.selected}
                  onSelectRow={table.onSelectRow}
                  onDeleteRow={() => handleDeleteRow(row._id)}
                  getGroupList={getGroupList}
                />
              ))}

            <TableEmptyRows
              height={72}
              emptyRows={emptyRows(table.page, table.rowsPerPage, groups.length)}
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
  )
}

export default GroupDataTable
