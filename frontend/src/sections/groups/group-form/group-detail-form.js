import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Stack, TextField } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from 'src/components';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/paths';
import GroupService from 'src/services/group-service';
import * as Yup from 'yup';

const GroupDetailForm = ({ currentGroup, parentGroup, getSubGroupList, onClose }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const confirmDelete = useBoolean();

  const getGroupList = useCallback(
    async () => {
      const groups = await GroupService.getGroupList();
      setGroups(groups.map(group => ({ value: group._id, label: group.groupName })));
    },
    [],
  )

  useEffect(() => {
    getGroupList();
  }, [getGroupList]);

  const groupTypes = useMemo(() => [
    { value: 'builder', label: 'Builder' },
    { value: 'agency', label: 'Agency' },
  ], []);

  const formik = useFormik({
    initialValues: {
      groupName: currentGroup?.groupName || '',
      groupEmail: currentGroup?.groupEmail || '',
      groupContact: currentGroup?.groupContact || '',
      groupArea: currentGroup?.groupArea || '',
      groupLicence: currentGroup?.groupLicence || '',
      groupType: groupTypes.find(groupType => groupType.value === currentGroup?.groupType) || groupTypes[0],
      groupParentId: !!groups.length && (groups.find(group => group?.value === currentGroup?.groupParentId)),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      groupName: Yup
        .string()
        .max(255)
        .required('Name is required!'),
      groupEmail: Yup
        .string()
        .max(255)
        .email('Email is invalid!')
        .required('Email is required!'),
      groupArea: Yup
        .string()
        .max(255)
        .required('Area is required!'),
      groupLicence: Yup
        .string()
        .max(255)
        .required('License is required!'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const data = {
          _id: currentGroup?._id,
          groupName: values.groupName,
          groupEmail: values.groupEmail,
          groupContact: values.groupContact,
          groupArea: values.groupArea,
          groupLicence: values.groupLicence,
          groupType: values.groupType.value,
        }

        if (values.groupParentId) {
          data.groupParentId = values.groupParentId.value
        }

        if (parentGroup) {
          data.groupParentId = parentGroup._id;
        }

        if (!currentGroup) {
          const group = await GroupService.createGroup(data);
          router.push(`${paths.dashboard.groups.root}/${group._id}`);
          enqueueSnackbar('Create Successfully', { variant: 'success' });
        } else {
          await GroupService.updateGroup(data);
          enqueueSnackbar('Update Successfully', { variant: 'success' });
        }

        onClose?.();
        getSubGroupList?.();
      } catch (error) {
        enqueueSnackbar(`Failed to ${!!currentGroup ? 'edit' : 'create'} group!`, { variant: 'error' });
      }
      setIsSubmitting(false);
    }
  });

  const handleDelete = useCallback(() => {
    GroupService.deleteManyGroups({ ids: [currentGroup._id] })
      .then(() => {
        router.push(paths.dashboard.groups.root);
        enqueueSnackbar('Delete Sucessfully!', { variant: 'success' });
      });
  }, [router, currentGroup]);

  return (
    <>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid xs={12} md={6}>
            <TextField
              error={!!(formik.touched.groupName && formik.errors.groupName)}
              fullWidth
              helperText={formik.touched.groupName && formik.errors.groupName}
              label="Name (*)"
              name="groupName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.groupName}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              error={!!(formik.touched.groupEmail && formik.errors.groupEmail)}
              fullWidth
              helperText={formik.touched.groupEmail && formik.errors.groupEmail}
              label="Email (*)"
              name="groupEmail"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.groupEmail}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              error={!!(formik.touched.groupContact && formik.errors.groupContact)}
              fullWidth
              helperText={formik.touched.groupContact && formik.errors.groupContact}
              label="Contact"
              name="groupContact"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.groupContact}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              error={!!(formik.touched.groupArea && formik.errors.groupArea)}
              fullWidth
              helperText={formik.touched.groupArea && formik.errors.groupArea}
              label="Area"
              name="groupArea"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.groupArea}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              error={!!(formik.touched.groupLicence && formik.errors.groupLicence)}
              fullWidth
              helperText={formik.touched.groupLicence && formik.errors.groupLicence}
              label="License (*) "
              name="groupLicence"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.groupLicence}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Autocomplete
              fullWidth
              options={groupTypes}
              getOptionLabel={(option) => option.label}
              value={formik.values.groupType}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              onChange={(event, value) => formik.setFieldValue('groupType', value)}
              renderInput={(params) => <TextField {...params} label="Type (*)" error={!!(formik.touched.groupType && formik.errors.groupType)} helperText={formik.touched.groupType && formik.errors.groupType} />}
            />
          </Grid>
          {!parentGroup && <Grid xs={12} md={6}>
            <Autocomplete
              fullWidth
              freeSolo
              options={groups}
              getOptionLabel={(option) => option?.label || ''}
              value={formik.values.groupParentId}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              onChange={(event, value) => formik.setFieldValue('groupParentId', value)}
              renderInput={(params) => <TextField {...params} label="Group" />}
            />
          </Grid>}
        </Grid>

        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: 3 }} spacing={2}>
          {!!currentGroup && <Button variant="contained" color="error" onClick={confirmDelete.onTrue}>
            Delete
          </Button>}

          <Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
            {!!parentGroup && <Button variant="contained" color="inherit" onClick={onClose}>
              Cancel
            </Button>}

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentGroup ? 'Create Group' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Stack>
      </form>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete();
              confirmDelete.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  )
}

export default GroupDetailForm
