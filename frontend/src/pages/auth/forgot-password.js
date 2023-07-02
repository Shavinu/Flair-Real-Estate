import { Helmet } from "react-helmet-async"
import { PROJECT_NAME } from "../../config-global"
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import AuthService from "../../services/auth-service";
import { Alert, Box, Link, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { RouterLink } from "../../components";
import { paths } from "../../paths";
import { KeyboardArrowLeftRounded } from '@mui/icons-material';

const ForgotPassword = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await AuthService.forgotPassword({ email: values.email });
        setErrorMsg(response.message);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message);
      }
      setIsSubmitting(false);
    }
  });

  return <>
    <Helmet>
      <title> Forgot Password - {PROJECT_NAME}</title>
    </Helmet>

    <Box sx={{ my: 'auto' }}>
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Typography variant="h4">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>

      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack spacing={2.5} alignItems="center">
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

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

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Send Request
          </LoadingButton>

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
      </form>
    </Box>
  </>
}

export default ForgotPassword
