import { DeleteForeverRounded, EditRounded, MoreVertRounded } from "@mui/icons-material";
import { Avatar, Button, Checkbox, IconButton, ListItemText, MenuItem, TableCell, TableRow, Tooltip } from "@mui/material";
import { ConfirmDialog, Dropdown } from "../../../components";
import useDropdown from "../../../components/dropdown/use-dropdown";
import { DEFAULT_AVATAR_URL } from "../../../config-global";
import { useRouter } from "../../../hooks/routes";
import { useBoolean } from "../../../hooks/use-boolean";
import utils from "../../../utils";
import UserQuickEditForm from "./user-quick-edit-form";

const UserDataTableRow = ({ row, selected, onSelectRow, onDeleteRow, getUserList }) => {
  const { _id, firstName, lastName, email, company, accType, phoneNo, avatar, updatedAt } = row;

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const dropdown = useDropdown();
  const router = useRouter();

  return <>
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={firstName + ' ' + lastName} src={avatar || DEFAULT_AVATAR_URL} sx={{ mr: 2 }} />
        <ListItemText
          primary={firstName + ' ' + lastName}
          secondary={email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{phoneNo}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{company}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{accType}</TableCell>

      <TableCell>
        {utils.string.dateFormat(updatedAt)}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Quick Edit" placement="top" arrow>
          <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
            <EditRounded />
          </IconButton>
        </Tooltip>

        <IconButton color={dropdown.open ? 'inherit' : 'default'} onClick={dropdown.onOpen}>
          <MoreVertRounded />
        </IconButton>
      </TableCell>
    </TableRow>

    <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} getUserList={getUserList} />

    <Dropdown
      open={dropdown.open}
      onClose={dropdown.onClose}
      arrow="right-top"
      sx={{ width: 140 }}>

      <MenuItem
        onClick={() => {
          confirm.onTrue();
          dropdown.onClose();
        }}
        sx={{ color: 'error.main' }}
      >
        <DeleteForeverRounded />
        Delete
      </MenuItem>

      <MenuItem
        onClick={() => {
          router.push(`/dashboard/users/${_id}`);
          dropdown.onClose();
        }}
      >
        <EditRounded />
        Edit
      </MenuItem>
    </Dropdown>

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
}

export default UserDataTableRow
