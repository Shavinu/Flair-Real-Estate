import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Stack, Typography, DialogContentText, DialogActions, Autocomplete, TextField, List, ListItem, IconButton, ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import GroupService from 'src/services/group-service';
import { GroupDataTable } from '../group-data-table';
import GroupDetailForm from './group-detail-form';
import { UserDataTable } from 'src/sections/users/user-data-table';
import { enqueueSnackbar } from 'notistack';
import { Clear, DeleteForeverRounded, Group } from '@mui/icons-material';

const GroupForm = ({ currentGroup }) => {
  const mdUp = useResponsive('up', 'md');
  const showCreateSubGroupForm = useBoolean();
  const showUsersModal = useBoolean();

  const [subGroups, setSubGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const getSubGroupList = useCallback(
    async () => {
      if (!currentGroup) { return; }
      const groups = await GroupService.getSubGroupsByParentGroupId(currentGroup._id);
      setSubGroups(groups);
    },
    [currentGroup],
  )

  useEffect(() => {
    getSubGroupList();
  }, [getSubGroupList]);

  const getUserList = useCallback(
    async () => {
      if (!currentGroup) { return; }
      const users = await GroupService.getUsersByGroupId(currentGroup._id);
      setUsers(users);
    },
    [currentGroup],
  )

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const getAvailableUserList = useCallback(
    async () => {
      if (!currentGroup) { return; }
      const users = await GroupService.getAvailableUsers();
      setAvailableUsers(users);
    },
    [currentGroup],
  )

  useEffect(() => {
    getAvailableUserList();
  }, [getAvailableUserList]);

  const handleAddUsersToGroup = async () => {
    if (!currentGroup) { return; }

    try {
      const data = {
        userIds: selectedUsers.map(user => user._id),
        groupId: currentGroup._id
      }
      await GroupService.addManyUsersToGroup(data);
      getAvailableUserList();
      getUserList();
      enqueueSnackbar('Successfully added users to group!', { variant: 'success' });
      setSelectedUsers([]);
    } catch (error) {
      enqueueSnackbar('Failed to add users to group!', { variant: 'error' });
    }
  }

  const removeUserFromGroup = async (id) => {
    try {
      await GroupService.removeManyUsersFromGroup({ ids: [id] });
      getAvailableUserList();
      getUserList();
      enqueueSnackbar('Remove Successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to remove user from group!', { variant: 'error' });
    }
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {mdUp && (
          <Grid md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Group Information
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Please fill out the following information to create a new group. Fields marked with an asterisk (*) are required.

              Note: If you have selected a parent group, the subgroups component will not be displayed..
            </Typography>
          </Grid>
        )}

        <Grid xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Details" />}

            <CardContent>
              <GroupDetailForm currentGroup={currentGroup} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!!currentGroup && !currentGroup.groupParentId && <Grid container spacing={3}>
        {mdUp && (
          <Grid md={4}>
            <Stack spacing={2}>
              <Typography variant="h6">
                Manage Subgroups
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Use the options below to manage the subgroups of this group. You can add or remove child groups, and adjust their settings as needed.
              </Typography>
              <Box>
                <Button variant="contained" color="primary" onClick={showCreateSubGroupForm.onTrue}>
                  Add Group
                </Button>
              </Box>
            </Stack>
          </Grid>
        )}

        <Grid xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Subgroups" />}

            <CardContent>
              <GroupDataTable
                groups={subGroups}
                groupIds={subGroups.map(group => group._id)}
                rowCount={subGroups.length} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>}

      {!!currentGroup && <Grid container spacing={3}>
        {mdUp && (
          <Grid md={4}>
            <Stack spacing={2}>
              <Typography variant="h6">
                Manage Group Members
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Use the options below to manage group members. You can add or remove users from the group, and adjust their permissions as needed.
              </Typography>
              <Box>
                <Button variant="contained" color="primary" onClick={showUsersModal.onTrue}>
                  Add Users
                </Button>
              </Box>
            </Stack>
          </Grid>
        )}

        <Grid xs={12} md={8}>
          <Card>
            {!mdUp && <CardHeader title="Group Members" />}

            <CardContent>
              <UserDataTable
                users={users}
                getUserList={getUserList} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>}

      <Dialog open={showCreateSubGroupForm.value} onClose={showCreateSubGroupForm.onFalse} aria-labelledby="create-subgroup-form">
        <DialogTitle id="create-subgroup-form">
          Add Group
        </DialogTitle>
        <DialogContent>
          <GroupDetailForm
            parentGroup={currentGroup}
            getSubGroupList={getSubGroupList}
            onClose={showCreateSubGroupForm.onFalse} />
        </DialogContent>
      </Dialog>

      <Dialog
        maxWidth="xs"
        fullWidth
        open={showUsersModal.value}
        onClose={showUsersModal.onFalse}
        aria-labelledby="users-modal"
      >
        <DialogTitle id="users-modal">
          Add Users
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
            multiple
            disableCloseOnSelect
            options={availableUsers}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}` || ''}
            value={selectedUsers}
            isOptionEqualToValue={(option, value) => option._id === value?._id}
            onChange={(event, value) => setSelectedUsers(value)}
            renderInput={(params) => <TextField {...params} label="Users" />}
            renderOption={(props, user) => (
              <ListItem>
                <ListItemButton {...props}>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${user._id}`}
                      src={user.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                    secondary={user.email}
                  />
                </ListItemButton>
              </ListItem>
            )}
            sx={{ mt: 2 }}
          />

          <List sx={{ width: '100%', }}>
            {users.map((user) => {
              const labelId = `checkbox-list-secondary-label-${user._id}`;
              return (
                <ListItem
                  key={user._id}
                  secondaryAction={
                    <IconButton color="error" onClick={() => removeUserFromGroup(user._id)}>
                      <Clear fontSize="small" />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar n°${user._id}`}
                        src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      primary={`${user.firstName} ${user.lastName}`}
                      secondary={user.email}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pt: 0, px: 3 }}>
          <Button
            variant="contained"
            color="inherit"
            onClick={showUsersModal.onFalse}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddUsersToGroup}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default GroupForm
