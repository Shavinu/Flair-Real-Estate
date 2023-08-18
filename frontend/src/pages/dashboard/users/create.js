import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { CustomBreadcrumbs } from "src/components";
import { PROJECT_NAME } from "src/config-global";
import { paths } from "src/paths";
import UserForm from "src/sections/users/user-form/user-form";

const Create = () => {
  return <>
    <Helmet>
      <title>User Edit - {PROJECT_NAME}</title>
    </Helmet>

    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Create"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Users',
            href: paths.dashboard.users.list,
          },
          { name: 'Create New User' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <UserForm />
    </Container>
  </>
}

export default Create;
