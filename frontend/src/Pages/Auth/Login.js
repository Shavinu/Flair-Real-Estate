import { LoadingButton } from '@mui/lab';
import { Alert, Box, Link, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import { RouterLink } from '../../components';
import { PROJECT_NAME } from '../../config-global';
import { useRouter, useSearchParams } from '../../hooks/routes';
import { paths } from '../../paths';
import { AuthContext } from '../../providers/auth/auth-context';

const Login = () => {
  const { login } = useContext(AuthContext);

  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

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
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await login(values.email, values.password);
        router.push(returnTo || paths.dashboard.root);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message);
      }
      setIsSubmitting(false);
    }
  });

  return <>
    <Helmet>
      <title> Login - {PROJECT_NAME}</title>
    </Helmet>

    <Box sx={{ my: 'auto' }}>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Typography variant="h4">Sign in</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Not a member?</Typography>

          <Link component={RouterLink} href={paths.auth.register} variant="subtitle2">
            Create an account
          </Link>
        </Stack>
      </Stack>

      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack spacing={2.5}>
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

          <Link component={RouterLink} href="/auth/forgot-password" variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
            Forgot password?
          </Link>

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Login
          </LoadingButton>
        </Stack>
      </form>
    </Box>
  </>
}

export default Login
