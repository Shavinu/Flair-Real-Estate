import { DeleteForeverRounded, EditRounded } from '@mui/icons-material';
import { Button, Checkbox, IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { ConfirmDialog } from 'src/components';
import Iconify from 'src/components/icons/iconify';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import utils from 'src/utils';

const GroupDataTableRow = ({ row, selected, onSelectRow, onDeleteRow }) => {
  const { _id, groupName, groupEmail, groupContact, groupArea, updatedAt, children } = row;

  const confirm = useBoolean();
  const router = useRouter();
  const collapse = useBoolean();

  return (
    <>
      <TableRow hover selected={selected.includes(_id)}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected.includes(_id)} onClick={() => onSelectRow(_id)} />
        </TableCell>

        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {!!children?.length && <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={collapse.onToggle}
            sx={{
              ...(collapse.value && {
                bgcolor: 'action.hover',
              }),
            }}
          >
            <Iconify icon={collapse.value ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"} />
          </IconButton>}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{groupName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{groupEmail}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{groupContact}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{groupArea}</TableCell>

        <TableCell>
          {utils.string.dateFormat(updatedAt)}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{groupArea}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton color="default" onClick={() => router.push(`/dashboard/groups/${_id}`)}>
              <EditRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton color="error" onClick={() => confirm.onTrue()}>
              <DeleteForeverRounded />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {!!children?.length && !!collapse.value && children.map((group, index) => (
        <TableRow key={`${group.groupName}-${index}`} hover selected={selected.includes(group._id)}>
          <TableCell padding="checkbox">
            <Checkbox checked={selected.includes(group._id)} onClick={() => onSelectRow(group._id)} />
          </TableCell>

          <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap' }}>{group.groupName}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{group.groupEmail}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{group.groupContact}</TableCell>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{group.groupArea}</TableCell>

          <TableCell>
            {utils.string.dateFormat(group.updatedAt)}
          </TableCell>

          <TableCell sx={{ whiteSpace: 'nowrap' }}>{group.groupArea}</TableCell>

          <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton color="default" onClick={() => router.push(`/dashboard/groups/${group._id}`)}>
                <EditRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton color="error" onClick={() => confirm.onTrue()}>
                <DeleteForeverRounded />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow >
      ))}

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  )
}

export default GroupDataTableRow
