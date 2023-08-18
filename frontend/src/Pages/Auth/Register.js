import { Helmet } from "react-helmet-async"
import { PROJECT_NAME } from "../../config-global"
import { Alert, Autocomplete, Button, Grid, Link, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RouterLink } from "../../components";
import { paths } from "../../paths";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import AuthService from "../../services/auth-service";
import { useSnackbar } from '../../components/snackbar';

const Register = () => {
  const [type, setType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNo: '',
      email: '',
      company: '',
      licence: '',
      jobType: '',
      password: '',
      passwordConfirmation: '',
      accType: type,
      verified: false,
    },
    validationSchema: Yup.object({
      accType: Yup
        .string()
        .required('Please select an account type'),
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
      company: Yup
        .string()
        .required('Company is required'),
      licence: Yup
        .string()
        .required('licence is required'),
      jobType: Yup
        .object()
        .required('Job Title is required'),
      password: Yup
        .string()
        .max(255)
        .min(8)
        .required('Password is required')
        .test("isValidPass", "Password is not valid", (value) => {
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
        .matches(
          /^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/,
          'Need one special character',
        ),
      passwordConfirmation: Yup
        .string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Passwords must match'),
    }),
    onSubmit: async (values) => {
      let data = { ...values, jobType: values.jobType.value };
      delete data.passwordConfirmation;
      setIsSubmitting(true);

      await AuthService.verifyLicence(data.accType, data.licence)
        .then((response) => {
          if (response?.error) {
            setAlertMessage(response.error.message);
            setIsSubmitting(false);
            return;
          }

          if (response?.message === 'Licence is valid') {
            setAlertMessage();

            data.verifiedLicence = true;

            AuthService.register(data)
              .then((response) => {
                if (response?.message) {
                  setAlertMessage(response.message);
                }
              })
              .catch((response) => {
                if (
                  response?.response?.data?.message
                ) {
                  setAlertMessage(response?.response?.data?.message);
                  enqueueSnackbar('Register Successfully! Please verify your email before login!');
                }
              });
          } else {
            console.log(response.data.message);
            setAlertMessage('Licence verification failed');
            setIsSubmitting(false);
            return;
          }
        })
        .catch((error) => {
          setAlertMessage(error?.response?.data?.error?.message || 'An error occurred while verifying the licence.');
          setIsSubmitting(false);
          return;
        });

      setIsSubmitting(false);
    }
  });

  const selectTypeSection = (
    <>
      <Typography variant="h4">I AM A...</Typography>

      <Typography variant="body2">
        Tell us what type of account you would like to create
      </Typography>

      <Button fullWidth size="large" variant="contained" onClick={() => {
        setType('agency')
      }}>
        Real Estate Agency
      </Button>
      <Button fullWidth size="large" variant="contained" onClick={() => {
        setType('agent')
      }}>
        Real Estate Agent
      </Button>
      <Button fullWidth size="large" variant="contained" onClick={() => {
        setType('assistant agent')
      }}>
        Assistant Real Estate Agent
      </Button>
      <Button fullWidth size="large" variant="contained" onClick={() => {
        setType('builder')
      }}>
        Builder
      </Button>
      <Button fullWidth size="large" variant="contained" onClick={() => {
        setType('developer')
      }}>
        Developer
      </Button>
    </>
  )

  const registerFormSection = (
    <>
      <Typography variant="h4">Create Account</Typography>

      <Typography variant="body2">
        Fill the form below to create a new <strong>{type}</strong> account.
      </Typography>

      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack spacing={2.5}>
          {!!alertMessage && <Alert severity="error">{alertMessage}</Alert>}
          <Button fullWidth size="large" variant="contained" color="inherit" onClick={() => {
            setType('')
          }}>
            Choose another account type
          </Button>

          <Grid container>
            <Grid item xs={6} sx={{ pr: 0.5 }}>
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
            <Grid item xs={6} sx={{ pl: 0.5 }}>
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
          </Grid>

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

          <Typography variant="body2">
            If you do not have a licence, use your corporate
            licence
          </Typography>

          <TextField
            error={!!(formik.touched.licence && formik.errors.licence)}
            fullWidth
            helperText={formik.touched.licence && formik.errors.licence}
            label={type !== 'assistant agent'
              ? 'Licence Number'
              : 'Certificate Number'}
            name="licence"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            value={formik.values.licence}
          />

          <Autocomplete
            value={formik.values.jobType}
            onChange={(e, value) => formik.setFieldValue('jobType', value)}
            options={[
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
            ]}
            getOptionLabel={(option) => option.label || ""}
            isOptionEqualToValue={(option) => !!formik.values.jobType && option.value === formik.values.jobType}
            freeSolo
            name="jobType"
            renderInput={(params) => <TextField {...params}
              label="Job Title"
              type="text"
              error={!!(formik.touched.jobType && formik.errors.jobType)}
              helperText={formik.touched.jobType && formik.errors.jobType} />}
          />

          <Grid container>
            <Grid item xs={6} sx={{ pr: 0.5 }}>
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.password}
              />
            </Grid>

            <Grid item xs={6} sx={{ pl: 0.5 }}>
              <TextField
                error={!!(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
                fullWidth
                helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                label="Confirm Password"
                name="passwordConfirmation"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                value={formik.values.passwordConfirmation}
              />
            </Grid>
          </Grid>

          <Typography variant="body2">
            Paswords must be at least 8 characters long and have:
          </Typography>
          <ul>
            <li><Typography variant="body2">at least <b>one uppercase letter</b></Typography></li>
            <li><Typography variant="body2">at least <b>one lowercase letter</b></Typography></li>
            <li><Typography variant="body2">at least <b>one digit</b></Typography></li>
            <li><Typography variant="body2">at least <b>one special character</b></Typography></li>
          </ul>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </form>
    </>
  )

  useEffect(() => {
    formik.setFieldValue('accType', type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return <>
    <Helmet>
      <title> Register - {PROJECT_NAME}</title>
    </Helmet>

    <Stack spacing={2} sx={{ my: 'auto' }}>
      {!type ? selectTypeSection : registerFormSection}
      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <KeyboardArrowLeftRounded />
        Return to sign in
      </Link>
    </Stack>
  </>
}

export default Register
