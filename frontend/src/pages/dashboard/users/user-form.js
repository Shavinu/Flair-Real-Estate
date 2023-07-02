import { useSnackbar } from "notistack";
import { useRouter } from "../../../hooks/routes";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import { Box, Card, Grid } from "@mui/material";
import { Label } from "@mui/icons-material";

const UserForm = ({ currentUser }) => {
  const router = useRouter();

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
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      email: currentUser?.email,
      phoneNo: currentUser?.phoneNo,
      company: currentUser?.company,
      accType: roles.find(role => role.value === currentUser?.accType)
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

    }
  });

  return <>
    <form onSubmit={formik.handleSubmit} noValidate>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </form>
  </>
}

export default UserForm;
