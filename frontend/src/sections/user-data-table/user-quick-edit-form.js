import PropTypes from 'prop-types';

import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useSnackbar } from '../../components/snackbar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import UserService from '../../services/user-service';

const UserQuickEditForm = ({ currentUser, open, onClose, getUserList }) => {
  const { _id, firstName, lastName, email, phoneNo, company, accType, verified } = currentUser;

  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const roles = [
    {
      value: 'admin',
      label: 'Admin',
    },
    {
      value: 'agency',
      label: 'Real Estate Agency',
    },
    {
      value: 'agent',
      label:
        'Real Estate Agent',
    },
    {
      value: 'assistant agent',
      label: 'Assistant Real Estate Agent',
    },
    {
      value: 'moderator',
      label: 'Moderator',
    },
    {
      value: 'developer',
      label: 'Developer',
    },
    {
      value: 'builder',
      label: 'Builder',
    },
  ];

  const formik = useFormik({
    initialValues: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNo: phoneNo,
      company: company,
      accType: roles.find(role => role.value === accType)
    },
    validationSchema: Yup.object({
      firstName: Yup
        .string()
        .max(255)
        .required('First Name is required'),
      lastName: Yup
        .string()
        .max(255)
        .required('Last Name is required'),
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      phoneNo: Yup
        .string()
        .required('Phone Number is required'),
      accType: Yup
        .object()
        .required('Role is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let data = { ...values, accType: values.accType.value };
        await UserService.updateUser(_id, data);

        getUserList();
        onClose();
        enqueueSnackbar('Update success!');
      } catch (error) {

      }
      setIsSubmitting(false);
    }
  });

  return <>
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720, py: 2 },
      }}
    >
      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity={verified ? "success" : "info"} sx={{ mb: 3 }}>
            {!verified ? "Account is waiting for confirmation" : "Account has been verified"}
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <TextField
              error={!!(formik.touched.firstName && formik.errors.firstName)}
              fullWidth
              helperText={formik.touched.firstName && formik.errors.firstName}
              label="First Name"
              name="firstName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.firstName}
            />
            <TextField
              error={!!(formik.touched.lastName && formik.errors.lastName)}
              fullWidth
              helperText={formik.touched.lastName && formik.errors.lastName}
              label="Last Name"
              name="lastName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.lastName}
            />
            <TextField
              error={!!(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
            />
            <TextField
              error={!!(formik.touched.phoneNo && formik.errors.phoneNo)}
              fullWidth
              helperText={formik.touched.phoneNo && formik.errors.phoneNo}
              label="Phone Number"
              name="phoneNo"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.phoneNo}
            />
            <TextField
              error={!!(formik.touched.company && formik.errors.company)}
              fullWidth
              helperText={formik.touched.company && formik.errors.company}
              label="Company"
              name="company"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.company}
            />

            <Autocomplete
              value={formik.values.accType}
              onChange={(e, value) => formik.setFieldValue('accType', value)}
              options={roles}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option) => !!formik.values.accType && option.value === formik.values.accType.value}
              freeSolo
              name="accType"
              renderInput={(params) => <TextField {...params}
                label="Role"
                type="text"
                error={!!(formik.touched.accType && formik.errors.accType)}
                helperText={formik.touched.accType && formik.errors.accType} />}
            />

          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  </>
}

UserQuickEditForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  getUserList: PropTypes.func,
};

export default UserQuickEditForm;
