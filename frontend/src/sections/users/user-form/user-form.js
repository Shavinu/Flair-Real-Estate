import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Box, Button, Card, CardContent, CardHeader, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useFormik } from 'formik';
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { countries } from "src/assets/data";
import Iconify from "src/components/icons/iconify";
import Label from "src/components/label";
import { UploadAvatar } from "src/components/upload";
import { useBoolean } from "src/hooks/use-boolean";
import { paths } from "src/paths";
import AuthService from "src/services/auth-service";
import GroupService from "src/services/group-service";
import UserService from "src/services/user-service";
import { fData } from "src/utils/format-number";
import * as Yup from 'yup';
import { useRouter } from "../../../hooks/routes";
import { ConfirmDialog } from "src/components";

const UserForm = ({ currentUser }) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const showPassword = useBoolean();
  const confirmDelete = useBoolean();

  const [avatar, setAvatar] = useState(null);
  const [groups, setGroups] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

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

  const jobTypes = [
    {
      value: 'incharge',
      label: 'Licence Incharge (Class 1 only)',
    },
    {
      value: 'agent',
      label:
        'Licence Real Estate Agent (Class 1 or Class 2)',
    },
    {
      value: 'assistant',
      label: 'Assistant Agent',
    },
  ]

  const formik = useFormik({
    initialValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNo: currentUser?.phoneNo || '',
      company: currentUser?.company || '',
      accType: roles.find(role => role.value === currentUser?.accType) || roles[0],
      jobType: jobTypes.find(jobType => jobType.value === currentUser?.jobType) || jobTypes[0],
      licence: '',
      avatar: currentUser?.avatar,
      group: null,
      addressLine1: currentUser?.addressLine1 || '',
      addressLine2: currentUser?.addressLine2 || '',
      suburb: currentUser?.suburb || '',
      state: currentUser?.state || '',
      country: currentUser?.country || null,
      postcode: currentUser?.postcode || '',
      password: '',
      passwordConfirmation: '',
    },
    enableReinitialize: true,
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
      licence: Yup
        .string()
        .test('required', 'License is required!', (value) => {
          if (!currentUser && !value) {
            return false;
          }
          return true;
        }),
      password: Yup
        .string()
        .max(255)
        .min(8)
        .nullable()
        .test("isValidPass", "Password is not valid", (value) => {
          if (!value) {
            return true;
          }

          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          let validConditions = 0;
          const numberOfMustBeValidConditions = 3;
          const conditions = [hasUpperCase, hasLowerCase, hasNumber];
          conditions.forEach(condition => (condition ? validConditions++ : null));
          if (validConditions >= numberOfMustBeValidConditions) {
            return true;
          }
          return false;
        })
        .test('required', 'Password is required!', (value) => {
          if (!currentUser && !value) {
            return false;
          }
          return true;
        })
        .matches(
          /^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/,
          'Need one special character',
        ),
      passwordConfirmation: Yup
        .string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .test('required', 'Passwords must match!', (value) => {
          if (!currentUser && !value) {
            return false;
          }
          return true;
        })
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setAlertMessage();

      try {
        let data = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNo: values.phoneNo,
          company: values.company,
          accType: values.accType.value,
          jobType: values.jobType.value,
          avatar: values.avatar,
          group: values.group.value,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          suburb: values.suburb,
          state: values.state,
          country: values.country,
          postcode: values.postcode,
          verifiedLicence: true,
        };

        if (!currentUser) {
          data.password = values.password;
          data.licence = values.licence;
          data.verified = false;
          const verifiedResponse = await AuthService.verifyLicence(data.accType, data.licence);

          if (verifiedResponse?.error) {
            setAlertMessage(verifiedResponse.error.message);
            enqueueSnackbar('Invalid License!', { variant: 'error' });
            return;
          }

          const user = await UserService.createUser(data);
          router.push(`${paths.dashboard.users.list}/${user._id}`);
          enqueueSnackbar('Create Successfully', { variant: 'success' });
        } else {
          if (values.password) {
            data.password = values.password;
          }

          await UserService.updateUser(currentUser._id, data);
          enqueueSnackbar('Update Successfully', { variant: 'success' });
        }

        // setAlertMessage('abc');
      } catch (error) {
        enqueueSnackbar(`Failed to ${!!currentUser ? 'edit' : 'create'} user!`, { variant: 'error' });
      }
      setIsSubmitting(false);
    }
  });

  const getBase64 = useCallback(
    () => {
      if (avatar) {
        let reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onload = function () {
          formik.setFieldValue('avatar', reader.result);
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
    },
    [avatar, formik],
  )

  const handleDropAvatar = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setAvatar(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  const onSendEmail = async () => {
    setIsSendingEmail(true);

    try {
      await AuthService.sendVerifyEmail({ email: currentUser.email });
      enqueueSnackbar(`An email has been sent to ${currentUser.email}`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to send email!', { variant: 'error' });
    }

    setIsSendingEmail(false);
  }

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await UserService.deleteUser(currentUser._id);
      enqueueSnackbar('Delete Successfully', { variant: 'success' });
      router.push(paths.dashboard.users.list);
    } catch (error) {
      enqueueSnackbar('Failed to delete user!', { variant: 'error' });
    }
    setIsDeleting(false);
  }

  useEffect(() => {
    getBase64();
  }, [getBase64]);

  const getGroupList = useCallback(
    async () => {
      try {
        const res = await GroupService.getGroupList();
        const groups = res.map(group => ({ value: group._id, label: group.groupName }))
        setGroups(groups);
        formik.setFieldValue('group', groups.find(group => group.value === currentUser?.group) || groups[0]);
      } catch (error) { }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser],
  );

  useEffect(() => {
    getGroupList();
  }, [getGroupList])

  return <>
    <form onSubmit={formik.handleSubmit} noValidate>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ py: 5 }}>
            <CardContent sx={{ px: 5 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  file={avatar || currentUser?.avatar}
                  onDrop={handleDropAvatar}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              {currentUser && (<>
                <Stack spacing={2}>
                  {!!jobTypes.find(jobType => jobType.value === currentUser.jobType) && <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', width: 1 }}>
                    <Typography variant="subtitle2">
                      License Type:
                    </Typography>
                    <Typography variant="body2">
                      {jobTypes.find(jobType => jobType.value === currentUser.jobType)?.label}
                    </Typography>
                  </Stack>}

                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', width: 1 }}>
                    <Typography variant="subtitle2">
                      License Number:
                    </Typography>
                    <Typography variant="body2">
                      {currentUser.licence}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', width: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Label color={(!!currentUser.verified && 'success') || 'warning'}>
                      {(!!currentUser.verified && 'Verified') || 'Pending'}
                    </Label>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', width: 1 }}>
                    {!currentUser.verified && <LoadingButton variant="contained" color="primary" onClick={onSendEmail} loading={isSendingEmail}>
                      Send Email
                    </LoadingButton>}
                    <LoadingButton variant="contained" color="error" onClick={() => confirmDelete.onTrue()} loading={isDeleting}>
                      Delete User
                    </LoadingButton>
                  </Stack>
                </Stack>
              </>)}
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            {!!alertMessage && <Alert severity="error">{alertMessage}</Alert>}

            <Card>
              <CardHeader title="Account Information" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
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
                  </Grid>
                  <Grid xs={12} md={6}>
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
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.email && formik.errors.email)}
                      fullWidth
                      helperText={formik.touched.email && formik.errors.email}
                      label="Email"
                      name="email"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.email}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.phoneNo && formik.errors.phoneNo)}
                      fullWidth
                      helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                      label="Phone"
                      name="phoneNo"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.phoneNo}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Autocomplete
                      fullWidth
                      options={groups}
                      getOptionLabel={(option) => option.label}
                      value={formik.values.group}
                      isOptionEqualToValue={(option, value) => option.value === value?.value}
                      onChange={(event, value) => formik.setFieldValue('group', value)}
                      renderInput={(params) => <TextField {...params} label="Group" />}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Autocomplete
                      fullWidth
                      options={roles}
                      getOptionLabel={(option) => option.label}
                      value={formik.values.accType}
                      isOptionEqualToValue={(option, value) => option.value === value?.value}
                      onChange={(event, value) => formik.setFieldValue('accType', value)}
                      renderInput={(params) => <TextField {...params} label="Role" />}
                    />
                  </Grid>

                  {(!currentUser || !currentUser.jobType) && <Grid xs={12} md={6}>
                    <Autocomplete
                      fullWidth
                      options={jobTypes}
                      getOptionLabel={(option) => option.label}
                      value={formik.values.jobType}
                      isOptionEqualToValue={(option, value) => option.value === value?.value}
                      onChange={(event, value) => formik.setFieldValue('jobType', value)}
                      renderInput={(params) => <TextField {...params} label="License Type" />}
                    />
                  </Grid>}

                  {!currentUser && <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.licence && formik.errors.licence)}
                      fullWidth
                      helperText={formik.touched.licence && formik.errors.licence}
                      label="License Number"
                      name="licence"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.licence}
                    />
                  </Grid>}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Address" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
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
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Autocomplete
                      name="country"
                      label="Country"
                      options={countries.map((country) => country.label)}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      value={formik.values.country}
                      onChange={(event, value) => formik.setFieldValue('country', value)}
                      renderInput={(params) => <TextField {...params} label="Country" />}
                      renderOption={(props, option) => {
                        const { code, label, phone } = countries.filter(
                          (country) => country.label === option
                        )[0];

                        if (!label) {
                          return null;
                        }

                        return (
                          <li {...props} key={label}>
                            <Iconify
                              key={label}
                              icon={`circle-flags:${code.toLowerCase()}`}
                              width={28}
                              sx={{ mr: 1 }}
                            />
                            {label} ({code}) +{phone}
                          </li>
                        );
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.suburb && formik.errors.suburb)}
                      fullWidth
                      helperText={formik.touched.suburb && formik.errors.suburb}
                      label="Suburb"
                      name="suburb"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.suburb}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.state && formik.errors.state)}
                      fullWidth
                      helperText={formik.touched.state && formik.errors.state}
                      label="State"
                      name="state"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.state}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.addressLine1 && formik.errors.addressLine1)}
                      fullWidth
                      helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
                      label="Address Line 1"
                      name="addressLine1"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.addressLine1}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.addressLine2 && formik.errors.addressLine2)}
                      fullWidth
                      helperText={formik.touched.addressLine2 && formik.errors.addressLine2}
                      label="Address Line 2 (optional)"
                      name="addressLine2"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.addressLine2}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.postcode && formik.errors.postcode)}
                      fullWidth
                      helperText={formik.touched.postcode && formik.errors.postcode}
                      label="Postcode"
                      name="postcode"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.postcode}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Password" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.password && formik.errors.password)}
                      fullWidth
                      helperText={formik.touched.password && formik.errors.password}
                      label="Password"
                      name="password"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type={!showPassword.value ? "password" : "text"}
                      value={formik.values.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={showPassword.onToggle} edge="end">
                              <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
                      fullWidth
                      helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                      label="Confirm Password"
                      name="passwordConfirmation"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type={!showPassword.value ? "password" : "text"}
                      value={formik.values.passwordConfirmation}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={showPassword.onToggle} edge="end">
                              <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Typography variant="body2">
                      Paswords must be at least 8 characters long and have:
                    </Typography>
                    <ul>
                      <li><Typography variant="body2">at least <b>one uppercase letter</b></Typography></li>
                      <li><Typography variant="body2">at least <b>one lowercase letter</b></Typography></li>
                      <li><Typography variant="body2">at least <b>one digit</b></Typography></li>
                      <li><Typography variant="body2">at least <b>one special character</b></Typography></li>
                    </ul>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentUser ? 'Create User' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </form >

    <ConfirmDialog
      open={confirmDelete.value}
      onClose={confirmDelete.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDelete}>
          Delete
        </Button>
      }
    />
  </>
}

export default UserForm;
